import { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Flex,
  Modal,
  Popconfirm,
  Table,
  Timeline,
  Tooltip,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';

// Custom Imports
import StaffNavbar from '../../../components/nav-staff.component';
import { SubmitHandler, useForm } from 'react-hook-form';
import { hasPermission, isEmpty } from '../../../utils/util';
import { API, API_BASE_URL } from '../../../const/api.const';
import HttpClient from '../../../utils/http-client.util';
import { IApiResponse } from '../../../interfaces/api.interface';
import useLocalStorage from '../../../hooks/useLocalstorage.hook';
import {
  IEmployeeProfile,
  ISearchPayload,
  IUser,
  IWorkHistory,
} from '../../../interfaces/client.interface';
import {
  formatStandardDate,
  formatStandardDateTime,
} from '../../../utils/date.util';
import {
  employeeColumns,
  employeeContributionColumns,
} from '../../../const/table-columns.const';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ManOutlined,
  SettingOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import SearchFormFields from '../../../components/form-search-employee.component';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { TPermissionTypes } from '../../../interfaces/permission.interface';

interface IState {
  isFetchingStaffs: boolean;
  isFetchingEmployees: boolean;
  isAuthModalOpen: boolean;
  isRegistrationModealOpen: boolean;
  isEmployeeRegistrationOpen: boolean;
  isWorkHistoryModalOpen: boolean;
  isPasswordNotMatched: boolean;
  isPasswordMinMaxErr: boolean;
  isUsernameAlreadyExist: boolean;
  stateWorkHistoryPreview?: IWorkHistory;
  employees: IEmployeeProfile[];
  users: IUser[];
  user?: IUser;
}

function StaffEmployeeList() {
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const {
    handleSubmit: handleSubmitSearchFormData,
    control: searchController,
    formState: { isSubmitting: isSearchingEmployee },
  } = useForm<ISearchPayload>();

  const [state, setState] = useState<IState>({
    isFetchingStaffs: false,
    isFetchingEmployees: false,
    isAuthModalOpen: false,
    isRegistrationModealOpen: false,
    isWorkHistoryModalOpen: false,
    isPasswordNotMatched: false,
    isUsernameAlreadyExist: false,
    isPasswordMinMaxErr: false,
    isEmployeeRegistrationOpen: false,
    stateWorkHistoryPreview: {
      client_id: 999,
      company_name: '',
      created_at: '',
      end_date: '',
      id: 999,
      position: '',
      responsibilities: '',
      start_date: '',
      updated_at: '',
      duration: '',
    },
    employees: [],
    users: [],
    user: undefined,
  });

  const onGetUserProfile = async () => {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${getAuthResponse?.access_token}`,
      },
    };
    const getProfileResponse: AxiosResponse = await axios.get(
      `${API_BASE_URL}/api/user/v1`,
      {
        ...config,
      }
    );

    setState((prev) => ({
      ...prev,
      user: getProfileResponse.data,
    }));
  };

  const handleSearch: SubmitHandler<ISearchPayload> = async (data) => {
    const isInvalidSearchkey =
      /[0-9]/.test(data.searchKeyword!) && /[a-zA-Z]/.test(data.searchKeyword!);

    if (isInvalidSearchkey) {
      return toastError(
        'Search keyword must be a School ID or Department name.'
      );
    }
    // Check if the searchKeyword contains a number
    const isNumeric = /\d/.test(data.searchKeyword!);
    if (isNumeric) {
      // If it contains a number, search by schoolId
      await getAllEmployees({ schoolId: data.searchKeyword?.trim() });
    } else {
      // If it doesn't contain a number, search by department
      await getAllEmployees({ searchKeyword: data.searchKeyword?.trim() });
    }
  };

  const handleOk = () => {
    setState((prev) => ({
      ...prev,
      isAuthModalOpen: false,
    }));

    navigate('/', { replace: true });
  };

  const getAllEmployees = async (data?: {
    searchKeyword?: string;
    schoolId?: string;
  }) => {
    setState((prev) => ({
      ...prev,
      isFetchingEmployees: true,
    }));

    let getAllEmployeesResponse: any = null;

    if (!isEmpty(data?.schoolId)) {
      const findBySchoolId = await HttpClient.setAuthToken(
        getAuthResponse?.access_token
      ).get<IEmployeeProfile[], any>(
        `${API.employees}/${data?.schoolId}/information`,
        {}
      );
      if (findBySchoolId.message === 'Employee Not found.') {
        getAllEmployeesResponse = [];
      } else {
        findBySchoolId.data = [findBySchoolId.data as any];
        getAllEmployeesResponse = findBySchoolId;
      }
    } else {
      getAllEmployeesResponse = await HttpClient.setAuthToken(
        getAuthResponse?.access_token
      ).get<IEmployeeProfile[], { role: string }>(API.employees, {
        role: 'EMPLOYEE',
        ...(data?.searchKeyword ? { department: data?.searchKeyword } : {}),
      });
    }
    if (getAllEmployeesResponse.message === 'Authentication required.') {
      setState((prev) => ({
        ...prev,
        isAuthModalOpen: true,
      }));

      return;
    }

    if (!Array.isArray(getAllEmployeesResponse.data)) {
      setState((prev) => ({
        ...prev,
        isFetchingEmployees: false,
      }));
      return toastError(
        'Oops! No employees found for the provided search keyword.'
      );
    }

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${getAuthResponse?.access_token}`,
      },
    };
    const getProfileResponse: AxiosResponse = await axios.get(
      `${API_BASE_URL}/api/user/v1`,
      {
        ...config,
      }
    );

    const user: IUser = getProfileResponse.data;

    setState((prev) => ({
      ...prev,
      isFetchingEmployees: false,
      employees: getAllEmployeesResponse.data?.map((el: IEmployeeProfile) => ({
        ...el,
        middle_name: el.middle_name === 'N/A' ? '' : el.middle_name,
        birthdate: formatStandardDate(el.birthdate),
        created_at: formatStandardDateTime(el.created_at),
        actions: (
          <Flex gap={10}>
            <Popconfirm
              title="Do you want to delete employee information?"
              onConfirm={() => handleDeleteEmployee(el.school_id)}
              okText="Yes"
              cancelText="No"
              placement="bottomLeft"
              disabled={
                !hasPermission(
                  user?.user_permissions!,
                  TPermissionTypes.DELETE
                )
              }
            >
              <Tooltip
                title={
                  !hasPermission(
                    user?.user_permissions!,
                    TPermissionTypes.DELETE
                  )
                    ? 'No permission'
                    : 'Delete'
                }
              >
                <Button
                  htmlType="button"
                  type="dashed"
                  icon={<DeleteOutlined />}
                  disabled={
                    !hasPermission(
                      user?.user_permissions!,
                      TPermissionTypes.DELETE
                    )
                  }
                >
                  Delete
                </Button>
              </Tooltip>
            </Popconfirm>

            <Tooltip title="View">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(`/dashboard/s/employee/${el.school_id}`, {
                    state: el,
                  })
                }
              >
                View
              </Button>
            </Tooltip>
          </Flex>
        ),
        key: el.id,
      })) as any,
    }));
  };

  const handleGeneratePdf = async (contributions: any[]) => {
    try {
      if (contributions.length >= 100) {
        return toastError(
          'Oops! Sorry, We cannot Generate PDF with more than 100 rows'
        );
      }

      const response = await axios.post(
        API.generatePdf,
        {
          array: contributions,
        },
        {
          responseType: 'blob', // Set the response type to blob
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'output.pdf';

      link.click();

      // Cleanup
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleDeleteEmployee = async (school_id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/client/v1/${school_id}`, {
        headers: {
          Authorization: `Bearer ${getAuthResponse?.access_token}`,
        },
      });

      toastSuccess('Removed successfully!');
      await getAllEmployees();
    } catch (error) {
      toastError('Oops! Something went wrong, Please try again.');
    }
  };

  useEffect(() => {
    document.title = 'Account Management | SSS Archiving System';
    onGetUserProfile();
    getAllEmployees();
    return () => {};
  }, []);

  return (
    <>
      {contextHolder}
      <StaffNavbar />

      <div style={{ padding: '50px' }}>
        <SearchFormFields
          onSearch={handleSubmitSearchFormData(handleSearch)}
          control={searchController}
          isSearching={isSearchingEmployee}
        />
        <Table
          columns={employeeColumns as any}
          dataSource={state.employees as any}
          size="middle"
          loading={state.isFetchingEmployees}
          expandable={{
            expandedRowRender: (record: IEmployeeProfile) => {
              return (
                <div
                  style={{
                    padding: 10,
                    border: '1px solid #e4e4e4',
                    borderRadius: 20,
                  }}
                >
                  <Flex justify="center">
                    <p
                      style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#111',
                      }}
                    >
                      Summary of {record.first_name}
                    </p>
                  </Flex>
                  <Flex>
                    <div
                      style={{
                        flex: 1,
                        padding: 50,
                        background: 'white',
                        borderRadius: 20,
                      }}
                    >
                      <p
                        style={{
                          padding: 0,
                          margin: 0,
                          fontSize: 14,
                          color: '#111',
                        }}
                      >
                        SSS Number
                      </p>
                      <p
                        style={{
                          padding: 0,
                          margin: 0,
                          fontSize: 17,
                          fontWeight: 'normal',
                          color: '#444',
                        }}
                      >
                        {record.sss_no}{' '}
                      </p>
                      <Divider />
                      <p
                        style={{
                          padding: 0,
                          margin: 0,
                          fontSize: 14,
                          color: '#111',
                        }}
                      >
                        Full name
                      </p>
                      <p
                        style={{
                          padding: 0,
                          margin: 0,
                          fontSize: 17,
                          fontWeight: 'normal',
                          color: '#444',
                        }}
                      >
                        {record.last_name}, {record.first_name}{' '}
                        {record.middle_name}
                      </p>
                      <p
                        style={{
                          padding: 0,
                          margin: 0,
                          marginTop: 20,
                          fontSize: 14,
                          color: '#111',
                        }}
                      >
                        Gender
                      </p>
                      <p
                        style={{
                          padding: 0,
                          margin: 0,
                          fontSize: 17,
                          fontWeight: 'normal',
                          color: '#444',
                        }}
                      >
                        {record.gender === 'FEMALE' ? (
                          <WomanOutlined style={{ color: 'pink' }} />
                        ) : (
                          <></>
                        )}
                        {record.gender === 'MALE' ? (
                          <ManOutlined style={{ color: 'blue' }} />
                        ) : (
                          <></>
                        )}{' '}
                        {record.gender}
                      </p>
                      <p
                        style={{
                          padding: 0,
                          margin: 0,
                          marginTop: 20,
                          fontSize: 14,
                          color: '#111',
                        }}
                      >
                        Birthdate
                      </p>
                      <p
                        style={{
                          padding: 0,
                          margin: 0,
                          fontSize: 17,
                          fontWeight: 'normal',
                          color: '#444',
                        }}
                      >
                        {record.birthdate}
                      </p>
                      <Divider />
                      <p
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          color: '#444',
                        }}
                      >
                        Work History
                      </p>
                      <div>
                        {record?.work_history.map(
                          (v: IWorkHistory, index: number) => {
                            return (
                              <div
                                key={v.id}
                                style={{ marginTop: index == 0 ? 0 : 30 }}
                              >
                                <p
                                  style={{
                                    color: '#111',
                                    fontSize: 16,
                                    margin: 0,
                                    padding: 0,
                                  }}
                                >
                                  {v.company_name}
                                </p>
                                <p
                                  style={{
                                    color: '#111',
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    margin: 0,
                                    padding: 0,
                                  }}
                                >
                                  <i>{v.position}</i>
                                </p>
                                <p
                                  style={{
                                    color: '#111',
                                    fontSize: 12,
                                    margin: 0,
                                    padding: 0,
                                  }}
                                >
                                  {v.responsibilities}
                                </p>
                                <p
                                  style={{
                                    color: '#111',
                                    fontSize: 10,
                                    margin: 0,
                                    padding: 0,
                                    marginTop: 10,
                                  }}
                                >
                                  {formatStandardDate(v.start_date)} -{' '}
                                  {isEmpty(v.end_date)
                                    ? 'Present'
                                    : formatStandardDate(v.end_date)}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <Divider />
                      <p
                        style={{
                          padding: 0,
                          margin: 0,
                          marginTop: 100,
                          fontSize: 8,
                          color: '#111',
                        }}
                      >
                        Date Created
                      </p>
                      <p
                        style={{
                          padding: 0,
                          margin: 0,
                          fontSize: 12,
                          fontWeight: 'normal',
                          color: '#444',
                        }}
                      >
                        {record.created_at}
                      </p>
                    </div>
                    <div
                      style={{
                        flex: 5,
                        borderRadius: 20,
                      }}
                    >
                      <Flex justify="end" gap={10} style={{ marginBottom: 10 }}>
                        <Tooltip
                          title={
                            !hasPermission(
                              state.user?.user_permissions!,
                              TPermissionTypes.GENERATE
                            )
                              ? 'No permission'
                              : 'Print PDF'
                          }
                        >
                          {' '}
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                              handleGeneratePdf(record.contributions);
                            }}
                            disabled={
                              !hasPermission(
                                state.user?.user_permissions!,
                                TPermissionTypes.GENERATE
                              )
                            }
                          >
                            Generate
                          </Button>
                        </Tooltip>
                      </Flex>
                      <Table
                        columns={employeeContributionColumns}
                        dataSource={record?.contributions?.map((el: any) => ({
                          ...el,
                          key: el.id,
                        }))}
                        loading={false}
                        size="small"
                      />
                    </div>
                  </Flex>
                </div>
              );
            },
          }}
        />
      </div>

      <Modal
        title="Oops!"
        closable={false}
        open={state.isAuthModalOpen}
        width={400}
        cancelButtonProps={{
          style: { display: 'none' },
        }}
        onOk={handleOk}
      >
        <p>
          Authentication session has expired. Kindly proceed to log in again for
          continued access.
        </p>
      </Modal>
    </>
  );

  function toastSuccess(message: string) {
    messageApi.success({
      type: 'success',
      content: message,
      style: {
        marginTop: '90vh',
      },
    });
  }

  function toastError(message: string) {
    messageApi.error({
      type: 'error',
      content: message,
      style: {
        marginTop: '90vh',
      },
    });
  }
}

export default StaffEmployeeList;

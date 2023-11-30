import { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Flex,
  Modal,
  Table,
  Tabs,
  Timeline,
  Tooltip,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';

// Custom Imports
import NavigationBarAdmin from '../../components/nav-admin.component';
import RegistrationFormFields from '../../components/form-registration-staff.component';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IRegistrationPayload } from '../../interfaces/login.interface';
import { isEmpty } from '../../utils/util';
import { API } from '../../const/api.const';
import HttpClient from '../../utils/http-client.util';
import { IApiResponse } from '../../interfaces/api.interface';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import {
  IEmployeeProfile,
  IEmployeeRegistrationPayload,
  ISearchPayload,
  IUser,
  IWorkHistory,
} from '../../interfaces/client.interface';
import {
  formatStandardDate,
  formatStandardDateTime,
} from '../../utils/date.util';
import RegistrationEmployeeFormFields from '../../components/form-registration-employee.component';
import { employeeColumns, staffColumns } from '../../const/table-columns.const';
import { EditOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import SearchFormFields from '../../components/form-search-employee.component';

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
}

function AdminAccountManagement() {
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const {
    handleSubmit: handleSubmitStaffFormData,
    control: staffController,
    formState: { isSubmitting: isCreatingAccount },
  } = useForm<IRegistrationPayload>();

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
    },
    employees: [],
    users: [],
  });

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

  const handleOpeRegistration = (type: 'EMPLOYEE' | 'STAFF') => {
    if (type === 'STAFF') {
      setState((prev) => ({
        ...prev,
        isRegistrationModealOpen: true,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        isEmployeeRegistrationOpen: true,
      }));
    }
  };

  const handleRegistration: SubmitHandler<IRegistrationPayload> = async (
    data
  ) => {
    if (isEmpty(data.username) || isEmpty(data.password)) {
      messageApi.error({
        type: 'error',
        content: 'Username and password is required.',
        style: {
          marginTop: '90vh',
        },
      });

      return;
    }

    if (data.confirm?.trim() !== data.password?.trim()) {
      setState((prev) => ({
        ...prev,
        isPasswordNotMatched: true,
      }));

      messageApi.error({
        type: 'error',
        content: 'Password and confirm password does not match.',
        style: {
          marginTop: '90vh',
        },
      });

      return;
    }

    const registrationResponse = await HttpClient.setAuthToken(
      getAuthResponse?.access_token
    ).post<IApiResponse, IRegistrationPayload>(API.register, {
      password: data.password,
      username: data.username,
      role: 'STAFF',
    });

    if (
      registrationResponse.message?.includes(
        'The username has already been taken.'
      )
    ) {
      setState((prev) => ({
        ...prev,
        isUsernameAlreadyExist: true,
      }));
      messageApi.error({
        type: 'error',
        content: 'The username has already been taken.',
        style: {
          marginTop: '90vh',
        },
      });
      return;
    } else if (
      registrationResponse.message?.includes(
        'The password field must be at least 6 characters.'
      ) ||
      registrationResponse.message?.includes(
        'The password field format is invalid.'
      )
    ) {
      setState((prev) => ({
        ...prev,
        isPasswordNotMatched: true,
      }));
      messageApi.error({
        type: 'error',
        content: 'Password does not meet criteria.',
        style: {
          marginTop: '90vh',
        },
      });
      return;
    } else if (registrationResponse?.message === 'Authentication required.') {
      setState((prev) => ({
        ...prev,
        isRegistrationModealOpen: false,
        isAuthModalOpen: true,
      }));

      return;
    }

    messageApi.success({
      type: 'success',
      content: 'Registration success!',
      style: {
        marginTop: '90vh',
      },
    });

    setState((prev) => ({
      ...prev,
      isPasswordNotMatched: false,
      isUsernameAlreadyExist: false,
      isRegistrationModealOpen: false,
    }));

    await getAllStaffs();
  };

  const toastSuccess = (message: string) => {
    messageApi.success({
      type: 'success',
      content: message,
      style: {
        marginTop: '90vh',
      },
    });
  };

  const toastError = (message: string) => {
    messageApi.error({
      type: 'error',
      content: message,
      style: {
        marginTop: '90vh',
      },
    });
  };

  const handleEmployeeRegistration: SubmitHandler<
    IEmployeeRegistrationPayload
  > = async (data) => {
    const fields = [
      data.first_name,
      // data.middle_name,
      data.last_name,
      data.birthdate,
      data.department,
      data.gender,
      data.permanent_address,
      data.present_address,
      data.phone_number,
    ];

    if (fields.some((field) => isEmpty(field))) {
      return toastError('All fields are required.');
    } else if (
      ![data.first_name, data.last_name].every(
        (name) => name.length >= 2 && name.length <= 75
      )
    ) {
      return toastError('Please use your real name.');
    } else if (
      data.phone_number.substring(0, 4) !== '+639' ||
      data.phone_number.length !== 13
    ) {
      return toastError('Invalid Phone number format');
    }

    if (isEmpty(data.middle_name)) {
      data.middle_name = 'N/A';
    }

    const employeeRegistrationPayload = await HttpClient.setAuthToken(
      getAuthResponse?.access_token
    ).post<IApiResponse, IEmployeeRegistrationPayload>(
      `${API.employeeEnrollment}/${data.id}`,
      data
    );
    if (employeeRegistrationPayload?.message === 'Authentication required.') {
      setState((prev) => ({
        ...prev,
        isRegistrationModealOpen: false,
        isAuthModalOpen: true,
      }));

      return;
    } else if (
      employeeRegistrationPayload?.message === 'Employee already exists.'
    ) {
      return toastError(
        `Employee with school id of <${data.id}> already exist. Please edit the information instead.`
      );
    } else if (
      employeeRegistrationPayload?.message?.includes(
        'The phone number field must be at least 13 characters.'
      )
    ) {
      return toastError('Phone number format should be +631234567890');
    } else if (
      employeeRegistrationPayload?.message?.includes(
        'The phone number has already been taken.'
      )
    ) {
      return toastError('Phone number has already been taken.');
    } else if (
      employeeRegistrationPayload?.message?.includes(
        'The phone number field must not be greater than 13 characters.'
      )
    ) {
      return toastError('Invalid Phone number format');
    }

    toastSuccess('Registration success!');

    setState((prev) => ({
      ...prev,
      isEmployeeRegistrationOpen: false,
    }));

    await getAllEmployees();
  };

  const handleDismissStaffRegistration = () => {
    setState((prev) => ({
      ...prev,
      isRegistrationModealOpen: false,
    }));
  };

  const handleDismissEmployeeRegistration = () => {
    setState((prev) => ({
      ...prev,
      isEmployeeRegistrationOpen: false,
    }));
  };

  const getAllStaffs = async () => {
    setState((prev) => ({
      ...prev,
      isFetchingStaffs: true,
    }));

    const getAllStafsResponse = await HttpClient.setAuthToken(
      getAuthResponse?.access_token
    ).get<IUser[], { role: string }>(API.users, { role: 'STAFF' });

    if (getAllStafsResponse.message === 'Authentication required.') {
      setState((prev) => ({
        ...prev,
        isAuthModalOpen: true,
      }));

      return;
    }

    if (!Array.isArray(getAllStafsResponse.data)) {
      return;
    }

    const mappedStaffs = getAllStafsResponse?.data.map((el) => ({
      key: el.id,
      username: el.username,
      role: el.role,
      verified_at: formatStandardDateTime(el.created_at),
    }));

    setState((prev) => ({
      ...prev,
      isFetchingStaffs: false,
      users: mappedStaffs as any,
    }));
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

    setState((prev) => ({
      ...prev,
      isFetchingEmployees: false,
      employees: getAllEmployeesResponse.data?.map((el: IEmployeeProfile) => ({
        ...el,
        middle_name: el.middle_name === 'N/A' ? '' : el.middle_name,
        birthdate: formatStandardDate(el.birthdate),
        created_at: formatStandardDateTime(el.created_at),
        edit: (
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(`/dashboard/a/account-management/employee/edit`, {
                  state: el,
                })
              }
            />
          </Tooltip>
        ),
        key: el.id,
      })) as any,
    }));
  };

  useEffect(() => {
    document.title = 'Account Management | SSS Archiving System';
    getAllStaffs();
    getAllEmployees();
    return () => {};
  }, []);

  return (
    <>
      {contextHolder}
      <NavigationBarAdmin />

      <div style={{ padding: '50px' }}>
        <Tabs
          tabBarExtraContent={
            <Flex gap={5}>
              <Button
                onClick={() => handleOpeRegistration('STAFF')}
                shape="round"
              >
                Staff Registration
              </Button>
              <Button
                onClick={() =>
                  navigate('/dashboard/a/account-management/employee/create')
                }
                shape="round"
              >
                Employee Registration
              </Button>
            </Flex>
          }
          items={[
            {
              key: '1',
              label: `Staffs`,
              children: (
                <Table
                  columns={staffColumns}
                  dataSource={state.users as any}
                  size="middle"
                  loading={state.isFetchingStaffs}
                />
              ),
            },
            {
              key: '2',
              label: `Employee`,
              children: (
                <>
                  <SearchFormFields
                    onSearch={handleSubmitSearchFormData(handleSearch)}
                    control={searchController}
                    isSearching={isSearchingEmployee}
                  />
                  <Table
                    columns={employeeColumns}
                    dataSource={state.employees as any}
                    size="middle"
                    loading={state.isFetchingEmployees}
                    expandable={{
                      expandedRowRender: (record: any) => {
                        return (
                          <div style={{ padding: 20 }}>
                            <Flex>
                              <div
                                style={{
                                  flex: 1,
                                  margin: 50,
                                  padding: 50,
                                  background: 'white',
                                  borderRadius: 20,
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    color: '#111',
                                  }}
                                >
                                  Summary
                                </p>
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
                                    fontSize: 24,
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
                                    fontSize: 24,
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
                                    fontSize: 24,
                                    fontWeight: 'normal',
                                    color: '#444',
                                  }}
                                >
                                  {record.birthdate}
                                </p>
                                <Divider />

                                <p
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    marginTop: 100,
                                    fontSize: 12,
                                    color: '#111',
                                  }}
                                >
                                  Date Created
                                </p>
                                <p
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                    color: '#444',
                                  }}
                                >
                                  {record.created_at}
                                </p>
                              </div>
                              <div
                                style={{
                                  flex: 2,
                                  margin: 50,
                                  padding: 50,
                                  background: 'white',
                                  borderRadius: 20,
                                }}
                              >
                                {record?.work_history?.length ? (
                                  <>
                                    <p
                                      style={{
                                        padding: 0,
                                        margin: 0,
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        color: '#111',
                                        marginBottom: 20,
                                      }}
                                    >
                                      Experience
                                    </p>
                                    <Divider />
                                    <Timeline
                                      mode="left"
                                      items={record?.work_history?.map(
                                        (v: any) => ({
                                          children: (
                                            <div
                                              style={{ cursor: 'pointer' }}
                                              onClick={() => {
                                                setState((prev) => ({
                                                  ...prev,
                                                  isWorkHistoryModalOpen: true,
                                                  stateWorkHistoryPreview: v,
                                                }));
                                              }}
                                            >
                                              <p
                                                style={{
                                                  padding: 0,
                                                  margin: 0,
                                                  fontSize: 16,
                                                  fontWeight: 'bold',
                                                  color: '#111',
                                                }}
                                              >
                                                {v.company_name}
                                              </p>
                                              <p
                                                style={{
                                                  padding: 0,
                                                  margin: 0,
                                                  fontSize: 12,
                                                  fontWeight: 'normal',
                                                  color: '#444',
                                                  fontStyle: 'italic',
                                                }}
                                              >
                                                {v.position}
                                              </p>
                                              <p
                                                style={{
                                                  padding: 0,
                                                  margin: 0,
                                                  fontSize: 14,
                                                  fontWeight: 'normal',
                                                  color: '#111',
                                                }}
                                              >
                                                {v.responsibilities}
                                              </p>

                                              <p
                                                style={{
                                                  padding: 0,
                                                  margin: 0,
                                                  fontSize: 12,
                                                  marginTop: 20,
                                                  color: '#111',
                                                }}
                                              >
                                                {v.start_date} to {v.end_date}
                                              </p>
                                            </div>
                                          ),
                                        })
                                      )}
                                    />
                                  </>
                                ) : (
                                  <div> </div>
                                )}
                              </div>
                            </Flex>
                          </div>
                        );
                      },
                      rowExpandable: (record) =>
                        record.name !== 'Not Expandable',
                    }}
                  />
                </>
              ),
            },
          ]}
        />
      </div>

      <Modal
        title="Employee Registration"
        open={state.isEmployeeRegistrationOpen}
        cancelButtonProps={{
          style: { display: 'none' },
        }}
        okButtonProps={{
          style: { display: 'none' },
        }}
        width={1450}
        onCancel={handleDismissEmployeeRegistration}
      ></Modal>

      <Modal
        title="Staff Registration"
        open={state.isRegistrationModealOpen}
        cancelButtonProps={{
          style: { display: 'none' },
        }}
        okButtonProps={{
          style: { display: 'none' },
        }}
        width={400}
        onCancel={handleDismissStaffRegistration}
      >
        {/* <form onSubmit={handleSubmitStaffFormData(handleRegistration)}>
          <RegistrationFormFields
            control={staffController}
            isUsernameAlreadyExist={state.isUsernameAlreadyExist}
            isPasswordNotMatched={state.isPasswordNotMatched}
            isRegistrationFailed={false}
          />
          <Button
            type="primary"
            size="middle"
            loading={isCreatingAccount}
            style={{ marginTop: 20 }}
            htmlType="submit"
            shape="round"
            block
          >
            Submit
          </Button>
        </form> */}
      </Modal>

      <Modal
        open={state.isWorkHistoryModalOpen}
        onOk={() =>
          setState((prev) => ({
            ...prev,
            isWorkHistoryModalOpen: !state.isWorkHistoryModalOpen,
          }))
        }
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() =>
          setState((prev) => ({
            ...prev,
            isWorkHistoryModalOpen: !state.isWorkHistoryModalOpen,
          }))
        }
      >
        <p
          style={{
            padding: 0,
            margin: 0,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#111',
          }}
        >
          {state.stateWorkHistoryPreview?.company_name}
        </p>
        <p
          style={{
            padding: 0,
            margin: 0,
            fontSize: 14,
            fontWeight: 'normal',
            color: '#444',
            fontStyle: 'italic',
          }}
        >
          {state.stateWorkHistoryPreview?.position}
        </p>
        <p
          style={{
            padding: 0,
            margin: 0,
            fontSize: 16,
            fontWeight: 'normal',
            color: '#111',
          }}
        >
          {state.stateWorkHistoryPreview?.responsibilities}
        </p>

        <p
          style={{
            padding: 0,
            margin: 0,
            fontSize: 14,
            marginTop: 20,
            color: '#111',
          }}
        >
          {state.stateWorkHistoryPreview?.start_date} to{' '}
          {state.stateWorkHistoryPreview?.end_date}
        </p>
      </Modal>

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
}

export default AdminAccountManagement;

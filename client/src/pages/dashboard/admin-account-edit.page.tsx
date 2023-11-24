import { Button, Card, Flex, Modal, Tooltip, message } from 'antd';
import NavigationBarAdmin from '../../components/nav-admin.component';
import RegistrationEmployeeFormFields from '../../components/form-registration-employee.component';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  IEmployeeProfile,
  IEmployeeRegistrationPayload,
  IExperiencePayload,
  IWorkHistory,
} from '../../interfaces/client.interface';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import moment from 'moment';
import Title from 'antd/es/typography/Title';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  CloseOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import HttpClient from '../../utils/http-client.util';
import { IApiResponse } from '../../interfaces/api.interface';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { API } from '../../const/api.const';
import { isEmpty } from '../../utils/util';
import ExperienceFormFields from '../../components/form-experience.component';

interface IState {
  isAuthModalOpen: boolean;
  isExperienceModalOpen: boolean;
  isDeleteExperienceModalOpen: boolean;
  isDeletingExperience: boolean;
  selectedWorkExperience: {
    company_name: string;
    id: number;
  };
}

function AdminAccountEdit() {
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );
  const [messageApi, contextHolder] = message.useMessage();
  const { state: locationState }: { state: IEmployeeProfile } = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<IState>({
    isAuthModalOpen: false,
    isExperienceModalOpen: false,
    isDeleteExperienceModalOpen: false,
    isDeletingExperience: false,
    selectedWorkExperience: {
      company_name: '',
      id: 0,
    },
  });

  const {
    handleSubmit: handleSubmitEmployeeFormData,
    control: employeeController,
    setValue,
    formState: { isSubmitting: isSavingEmployee },
  } = useForm<IEmployeeRegistrationPayload>();

  const {
    handleSubmit: handleSubmitExperienceFormData,
    control: experienceController,
    setValue: setExperienceValue,
    formState: { isSubmitting: isCreatingExperience },
  } = useForm<IExperiencePayload>();

  const handleSaveEdit: SubmitHandler<IEmployeeRegistrationPayload> = async (
    data
  ) => {
    if (isEmpty(data.middle_name)) {
      data.middle_name = 'N/A';
    }

    const updateBySchoolIdResponse = await HttpClient.setAuthToken(
      getAuthResponse?.access_token
    ).put<IEmployeeProfile, any>(`${API.employees}/${data?.id}`, data);

    console.log(updateBySchoolIdResponse);
    if (updateBySchoolIdResponse?.message === 'Authentication required.') {
      setState((prev) => ({
        ...prev,
        isAuthModalOpen: true,
      }));
      return;
    } else if (updateBySchoolIdResponse?.message === 'Employee Not found.') {
      return toastError('Oops! No employees found.');
    } else if (
      updateBySchoolIdResponse?.message?.includes(
        'The phone number field must be at least 13 characters.'
      )
    ) {
      return toastError('Phone number format should be +631234567890');
    } else if (
      updateBySchoolIdResponse?.message?.includes(
        'The phone number has already been taken.'
      )
    ) {
      return toastError('Phone number has already been taken.');
    } else if (
      updateBySchoolIdResponse?.message?.includes(
        'The phone number field must not be greater than 13 characters.'
      )
    ) {
      return toastError('Invalid Phone number format');
    }

    return toastSuccess('Updated successfully!');
  };

  const handleCreatExperience: SubmitHandler<
    IExperiencePayload & { duration?: any }
  > = async (data) => {
    data.start_date = new Date(data.duration[0]).toISOString().substring(0, 10);
    data.end_date = new Date(data.duration[1]).toISOString().substring(0, 10);

    delete data.duration;

    const experienceResponse = await HttpClient.setAuthToken(
      getAuthResponse?.access_token
    ).post<IApiResponse, IExperiencePayload>(
      `${API.employees}/${locationState.school_id}/workhistory`,
      data
    );

    if (experienceResponse?.message === 'Authentication required.') {
      setState((prev) => ({
        ...prev,
        isAuthModalOpen: true,
      }));
      return;
    } else if (
      experienceResponse?.message === 'Attempt to read property "id" on null'
    ) {
      return toastError('Employee Not found.');
    } else if (
      experienceResponse?.message?.includes(
        'The company name field must be at least 2 characters.'
      ) ||
      experienceResponse?.message?.includes(
        'The position field must be at least 6 characters.'
      ) ||
      experienceResponse?.message?.includes(
        'The responsibilities field must be at least 8 characters.'
      )
    ) {
      return toastError('Ensure that the work experience details are correct.');
    }

    if (experienceResponse?.data) {
      locationState?.work_history.push(experienceResponse.data as any);
    }

    toastSuccess('Created successfully!');

    setState((prev) => ({
      ...prev,
      isExperienceModalOpen: false,
    }));
  };

  const handleDeleteExperience = async (data: {
    company_name: string;
    id: number;
  }) => {
    setState((prev) => ({
      ...prev,
      selectedWorkExperience: {
        company_name: data.company_name,
        id: data.id,
      },
      isDeleteExperienceModalOpen: !prev.isDeleteExperienceModalOpen,
    }));
  };

  const handleConfirmDeleteExperience = async () => {
    setState((prev) => ({
      ...prev,
      isDeletingExperience: true,
    }));

    await HttpClient.setAuthToken(getAuthResponse?.access_token).delete(
      `${API.employees}/${state.selectedWorkExperience.id}/workhistory`
    );

    const indexToDelete = locationState?.work_history.findIndex(
      (obj) => obj.id === state.selectedWorkExperience.id
    );

    if (indexToDelete !== -1) {
      locationState?.work_history.splice(indexToDelete, 1);
    }

    setState((prev) => ({
      ...prev,
      isDeletingExperience: false,
      isDeleteExperienceModalOpen: false,
    }));
  };

  const handleRequireLogin = () => {
    setState((prev) => ({
      ...prev,
      isAuthModalOpen: false,
    }));

    navigate('/', { replace: true });
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

  useEffect(() => {
    setValue('first_name', locationState.first_name);
    setValue('last_name', locationState.last_name);
    setValue(
      'middle_name',
      locationState.middle_name === 'N/A' ? '' : locationState.middle_name
    );
    setValue('present_address', locationState.present_address);
    setValue('permanent_address', locationState.permanent_address);
    setValue('phone_number', locationState.phone_number);
    setValue('id', locationState.school_id);
    setValue('department', locationState.department);
    setValue('birthdate', moment(locationState.birthdate, 'YYYY-MM-DD') as any);
    setValue('gender', locationState.gender);
  }, [setValue]);

  return (
    <>
      {contextHolder}
      <NavigationBarAdmin />
      <Flex
        justify="center"
        gap={50}
        style={{ padding: 90, background: '#fbfbff' }}
      >
        <Flex style={{ background: 'white', padding: 50, borderRadius: 20 }}>
          <div>
            <Flex justify="space-between">
              <Flex align="center" style={{ marginBottom: 20 }}>
                <Tooltip title="Go back">
                  <Button
                    shape="circle"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                  />
                </Tooltip>
                <Title
                  level={4}
                  style={{
                    padding: 0,
                    margin: 0,
                    marginLeft: 15,
                    fontWeight: 'normal',
                  }}
                >
                  Edit Information
                </Title>
              </Flex>
              <Button
                type="dashed"
                icon={<PlusCircleOutlined />}
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    isExperienceModalOpen: !prev.isExperienceModalOpen,
                  }))
                }
              >
                Experience
              </Button>
            </Flex>
            <form onSubmit={handleSubmitEmployeeFormData(handleSaveEdit)}>
              <RegistrationEmployeeFormFields
                control={employeeController}
                isRegistrationFailed={false}
              />
              <Button
                type="primary"
                size="middle"
                loading={isSavingEmployee}
                style={{ marginTop: 20 }}
                htmlType="submit"
                shape="round"
                block
              >
                Submit
              </Button>
            </form>
          </div>
        </Flex>
        <div>
          {locationState?.work_history.map((v) => {
            return (
              <Card
                bordered={false}
                style={{ width: 700, marginBottom: 20, background: 'white' }}
                key={v.created_at}
              >
                <Flex justify="space-between" align="center">
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
                  <Tooltip title={`Delete ${v.company_name}`}>
                    <Button
                      type="text"
                      shape="circle"
                      icon={<CloseOutlined />}
                      onClick={() =>
                        handleDeleteExperience({
                          company_name: v.company_name,
                          id: v.id,
                        })
                      }
                    />
                  </Tooltip>
                </Flex>
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
              </Card>
            );
          })}
        </div>
      </Flex>

      <Modal
        title="Experience"
        open={state.isExperienceModalOpen}
        cancelButtonProps={{
          style: { display: 'none' },
        }}
        okButtonProps={{
          style: { display: 'none' },
        }}
        width={400}
        onCancel={() =>
          setState((prev) => ({
            ...prev,
            isExperienceModalOpen: !prev.isExperienceModalOpen,
          }))
        }
      >
        <form onSubmit={handleSubmitExperienceFormData(handleCreatExperience)}>
          <ExperienceFormFields control={experienceController} />
          <Button
            type="primary"
            size="middle"
            loading={isCreatingExperience}
            style={{ marginTop: 20 }}
            htmlType="submit"
            shape="round"
            block
          >
            Submit
          </Button>
        </form>
      </Modal>

      <Modal
        title={`Delete ${state.selectedWorkExperience.company_name}?`}
        open={state.isDeleteExperienceModalOpen}
        onOk={() => handleConfirmDeleteExperience()}
        confirmLoading={state.isDeletingExperience}
        onCancel={() =>
          setState((prev) => ({
            ...prev,
            isDeleteExperienceModalOpen: !prev.isDeleteExperienceModalOpen,
          }))
        }
      >
        <p>Are you sure you want to delete this work experience entry?</p>
      </Modal>

      <Modal
        title="Oops!"
        closable={false}
        open={state.isAuthModalOpen}
        width={400}
        cancelButtonProps={{
          style: { display: 'none' },
        }}
        onOk={() => handleRequireLogin()}
      >
        <p>
          Authentication session has expired. Kindly proceed to log in again for
          continued access.
        </p>
      </Modal>
    </>
  );
}

export default AdminAccountEdit;

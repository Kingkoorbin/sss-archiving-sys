import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import RegistrationEmployeeFormFields from '../../../components/form-registration-employee.component';
import {
  IEmployeeProfile,
  IEmployeeRegistrationPayload,
} from '../../../interfaces/client.interface';
import { Button, Flex, Tooltip, message } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../const/api.const';
import { IApiResponse } from '../../../interfaces/api.interface';
import useLocalStorage from '../../../hooks/useLocalstorage.hook';
import moment from 'moment';
import { isEmpty } from '../../../utils/util';

interface IState {
  isSuccessUpdatingEmployee: boolean;
}

function AdminEmployeeEdit() {
  const [state, setState] = useState<IState>({
    isSuccessUpdatingEmployee: false,
  });

  const [messageApi, contextHolder] = message.useMessage();
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );
  const navigate = useNavigate();
  const { state: locationState }: { state: IEmployeeProfile } = useLocation();

  const {
    handleSubmit: handleSubmitEmployeeFormData,
    control: employeeController,
    reset,
    setValue,
    formState: { isSubmitting: isUpdatingEmployee, errors: employeeErrors },
  } = useForm<IEmployeeRegistrationPayload>();

  const getEmployeeInfo = async () => {
    try {
      const response: { data: IEmployeeProfile } = await axios.get(
        `${API_BASE_URL}/api/client/v1/${locationState.school_id}/information`,
        {
          headers: {
            Authorization: `Bearer ${getAuthResponse?.access_token}`,
          },
        }
      );
      setValue('address', response.data.address);
      setValue(
        'birthdate',
        moment(response.data.birthdate, 'YYYY-MM-DD') as any
      );
      setValue('blood_type', response.data.blood_type);
      setValue('bpi_atm_account_no', response.data.bpi_atm_account_no ?? '');
      setValue('civil_status', response.data.civil_status);
      if (!isEmpty(response.data.date_hired)) {
        setValue(
          'date_hired',
          moment(response.data.date_hired, 'YYYY-MM-DD') as any
        );
      }
      if (!isEmpty(response.data.date_resigned)) {
        setValue(
          'date_resigned',
          moment(response.data.date_resigned, 'YYYY-MM-DD') as any
        );
      }
      setValue('department', response.data.department);
      setValue('email', response.data.email);
      setValue('first_name', response.data.first_name);
      setValue('gender', response.data.gender);
      setValue('id', response.data.id.toString());
      setValue('last_name', response.data.last_name);
      setValue('main_employer', response.data.main_employer);
      setValue('middle_name', response.data.middle_name);
      setValue('pagibig_no', response.data.pagibig_no ?? '');
      setValue('permanent_address', response.data.permanent_address);
      setValue('personnel_category', response.data.personnel_category);
      setValue('philhealth_no', response.data.philhealth_no ?? '');
      setValue('phone_number', response.data.phone_number);
      setValue('present_address', response.data.present_address);
      setValue('rvm_retirement_no', response.data.rvm_retirement_no ?? '');
      setValue('school_id', response.data.school_id);
      setValue('sss_no', response.data.sss_no ?? '');
      setValue('suffix', response.data.suffix);
      setValue('tin', response.data.tin ?? '');
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmployeeEdit: SubmitHandler<
    IEmployeeRegistrationPayload
  > = async (data) => {
    // console.log(data)

    data.date_hired = new Date(data.date_hired).toISOString().substring(0, 10);
    data.birthdate = new Date(data.birthdate).toISOString().substring(0, 10);
    if (data.date_resigned) {
      data.date_resigned = new Date(data.date_resigned)
        .toISOString()
        .substring(0, 10);
    }
    try {
      await axios.put(`${API_BASE_URL}/api/client/v1/${data.school_id}`, data, {
        headers: {
          Authorization: `Bearer ${getAuthResponse?.access_token}`,
        },
      });
      setState((prev) => ({
        ...prev,
        isSuccessUpdatingEmployee: true,
      }));
      toastSuccess('Success!');
    } catch (error) {
    }
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
    getEmployeeInfo();
  }, []);

  return (
    <>
      {contextHolder}
      <div style={{ background: '#fbfbff' }}>
        <div className="registration-employee-form-container">
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
                Go back
              </Title>
            </Flex>
            <Tooltip title="View">
              <Button
                type="primary"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(`/dashboard/a/employee/${locationState.school_id}`, {
                    state: locationState,
                  })
                }
              />
            </Tooltip>
          </Flex>

          <form onSubmit={handleSubmitEmployeeFormData(handleEmployeeEdit)}>
            <RegistrationEmployeeFormFields
              control={employeeController}
              errors={employeeErrors}
              isRegistrationFailed={false}
            />
            <Flex gap={10}>
              <Button
                type="default"
                size="middle"
                htmlType="reset"
                style={{ marginTop: 20 }}
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button
                type="primary"
                size="middle"
                loading={isUpdatingEmployee}
                htmlType="submit"
                disabled={state.isSuccessUpdatingEmployee}
                icon={
                  state.isSuccessUpdatingEmployee ? (
                    <CheckCircleOutlined />
                  ) : (
                    <></>
                  )
                }
                style={{ marginTop: 20 }}
              >
                Submit
              </Button>
            </Flex>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminEmployeeEdit;

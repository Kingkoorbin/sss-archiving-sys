import { Button, Flex, Tooltip, message } from 'antd';
import RegistrationFormFields from '../../../components/form-registration-staff.component';
import { IRegistrationPayload } from '../../../interfaces/login.interface';
import { SubmitHandler, useForm } from 'react-hook-form';
import Title from 'antd/es/typography/Title';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../const/api.const';
import useLocalStorage from '../../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../../interfaces/api.interface';
import { useState } from 'react';

interface IState {
  isSuccessCreatingStaff: boolean;
}

function AdminStaffRegistration() {
  const [state, setState] = useState<IState>({
    isSuccessCreatingStaff: false,
  });
  const navigate = useNavigate();
  const {
    handleSubmit: handleSubmitStaffFormData,
    control: staffController,
    reset,
    formState: { isSubmitting: isCreatingAccount, errors },
  } = useForm<IRegistrationPayload>();
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );
  const [messageApi, contextHolder] = message.useMessage();

  const handleRegistration: SubmitHandler<IRegistrationPayload> = async (data) => {
    try {
      data.role = "STAFF";
      await axios.post(
        `${API_BASE_URL}/api/auth/v1/register`,
        data,
        {
          headers: {
            Authorization: `Bearer ${getAuthResponse?.access_token}`,
          },
        }
      );
      setState((prev) => ({
        ...prev,
        isSuccessCreatingStaff: true,
      }));
      toastSuccess('Registration success!');
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSuccessCreatingStaff: false,
      }));
      toastError('Failed!');
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

  return (
    <>
      {contextHolder}
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
        </Flex>

        <form onSubmit={handleSubmitStaffFormData(handleRegistration)}>
          <RegistrationFormFields control={staffController} errors={errors} />
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
              loading={isCreatingAccount}
              htmlType="submit"
              disabled={state.isSuccessCreatingStaff}
              icon={
                state.isSuccessCreatingStaff ? (
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
    </>
  );
}

export default AdminStaffRegistration;

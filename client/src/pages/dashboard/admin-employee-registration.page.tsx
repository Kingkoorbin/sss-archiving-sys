import { SubmitHandler, useForm } from 'react-hook-form';
import RegistrationEmployeeFormFields from '../../components/form-registration-employee.component';
import { IEmployeeRegistrationPayload } from '../../interfaces/client.interface';
import { Button, Flex, Tooltip, message } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../const/api.const';
import { IApiResponse } from '../../interfaces/api.interface';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { useState } from 'react';

interface IState {
  isSuccessCreatingEmployee: boolean;
}

function AdminEmployeeRegistration() {
  const [state, setState] = useState<IState>({
    isSuccessCreatingEmployee: false,
  });

  const [messageApi, contextHolder] = message.useMessage();
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );
  const navigate = useNavigate();
  const {
    handleSubmit: handleSubmitEmployeeFormData,
    control: employeeController,
    reset,
    formState: { isSubmitting: isCreatingEmployee, errors: employeeErrors },
  } = useForm<IEmployeeRegistrationPayload>();

  const handleEmployeeRegistration: SubmitHandler<
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

    console.log(data);

    try {
      await axios.post(
        `${API_BASE_URL}/api/client/v1/${data.school_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${getAuthResponse?.access_token}`,
          },
        }
      );
      setState((prev) => ({
        ...prev,
        isSuccessCreatingEmployee: true,
      }));
      toastSuccess('Success!');
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSuccessCreatingEmployee: false,
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
          </Flex>

          <form
            onSubmit={handleSubmitEmployeeFormData(handleEmployeeRegistration)}
          >
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
                loading={isCreatingEmployee}
                htmlType="submit"
                disabled={state.isSuccessCreatingEmployee}
                icon={
                  state.isSuccessCreatingEmployee ? (
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

export default AdminEmployeeRegistration;

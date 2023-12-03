import { useNavigate } from 'react-router-dom';
import { Row, Card, message } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';

// Custom imports
import { ILoginPayload } from '../../interfaces/login.interface';
import { useEffect } from 'react';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../interfaces/api.interface';
import { messages } from '../../const/messages.const';
import { BtnSignIn } from '../../components/btn-signin.component';
import LoginFormFields from '../../components/form-signin.component';
import { API_BASE_URL } from '../../const/api.const';
import axios from 'axios';

function Login() {
  const { setValue: setAuthResponse, removeValue: removeAuthResponse } =
    useLocalStorage<IApiResponse | null>('auth_response', null);

  const navigate = useNavigate();

  const { handleSubmit, control, formState: { errors: loginErrors, isSubmitting: isLoggingIn } } = useForm<ILoginPayload>();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin: SubmitHandler<ILoginPayload> = async (data) => {
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/v1/login`, data)
      if (loginResponse.data) {
        setAuthResponse({
          code: loginResponse.data?.code,
          access_token: loginResponse.data?.access_token,
          role: loginResponse.data?.role as any,
          status: loginResponse.data?.status,
        });
        if (loginResponse.data?.role === 'ADMIN') {
          return navigate('/dashboard/a/requests');
        } 
        else if (loginResponse.data?.role === 'STAFF') {
          return navigate('/dashboard/s/contribution');
        }
      }
    } catch (error: any) {

      // Clear session data
      removeAuthResponse();

      if (error?.response?.status == 401) {
        return messageApi.error({
          type: 'error',
          content:error.response?.data?.message,
          style: {
            marginTop: '90vh',
          },
        });
      }
      return messageApi.error({
        type: 'error',
        content: messages['503'].message,
        style: {
          marginTop: '90vh',
        },
      });
    }
  };

  useEffect(() => {
    document.title = 'Login | SSS Archiving System';
    removeAuthResponse(); // Remove existing token
  }, []);

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '98vh',
        }}>
        <Row justify="center">
          <form onSubmit={handleSubmit(handleLogin)}>
            <Card title={'Authentication'} style={{ width: 280 }}>
              <div>
                <LoginFormFields
                  control={control}
                  errors={loginErrors}/>
                <BtnSignIn isLoading={isLoggingIn} />
              </div>
            </Card>
          </form>
        </Row>
      </div>
    </>
  );
}

export default Login;

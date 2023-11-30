import { Button, Flex, Tooltip, message } from 'antd';
import RegistrationFormFields from '../../components/form-registration-staff.component';
import { IRegistrationPayload } from '../../interfaces/login.interface';
import { SubmitHandler, useForm } from 'react-hook-form';
import Title from 'antd/es/typography/Title';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function AdminStaffRegistration() {
  const navigate = useNavigate();
  const {
    handleSubmit: handleSubmitStaffFormData,
    control: staffController,
    formState: { isSubmitting: isCreatingAccount, errors },
  } = useForm<IRegistrationPayload>();

  const [messageApi, contextHolder] = message.useMessage();

  const handleRegistration: SubmitHandler<IRegistrationPayload> = async (
    data
  ) => {
    messageApi.success({
      type: 'success',
      content: 'Registration success!',
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
        </form>
      </div>
    </>
  );
}

export default AdminStaffRegistration;

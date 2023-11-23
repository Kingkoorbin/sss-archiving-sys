import React from 'react';
import { Form, Input } from 'antd';
import { Control, Controller } from 'react-hook-form';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

interface RegistrationFormFieldsProps {
  control: Control<any>;
  isRegistrationFailed: boolean;
  isPasswordNotMatched: boolean;
  isUsernameAlreadyExist: boolean;
}

const RegistrationFormFields: React.FC<RegistrationFormFieldsProps> = ({
  control,
  isRegistrationFailed,
  isPasswordNotMatched,
  isUsernameAlreadyExist,
}) => {
  return (
    <>
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
        Username or Email
      </p>
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <Form.Item extra="Username requires a minimum of 6 and 100 max characters.">
            <Input
              size="large"
              placeholder="Enter"
              status={
                isRegistrationFailed || isUsernameAlreadyExist ? 'error' : ''
              }
              prefix={<UserOutlined />}
              {...field}
            />
          </Form.Item>
        )}
      />
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Password</p>
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Form.Item extra="Password requires 1 special, 1 uppercase, 1 number, and a minimum of 6 characters.">
            <Input.Password
              size="large"
              placeholder="Enter"
              status={
                isRegistrationFailed || isPasswordNotMatched ? 'error' : ''
              }
              prefix={<LockOutlined />}
              {...field}
            />
          </Form.Item>
        )}
      />
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Confirm</p>
      <Controller
        name="confirm"
        control={control}
        render={({ field }) => (
          <Input.Password
            size="large"
            placeholder="Enter"
            status={isRegistrationFailed || isPasswordNotMatched ? 'error' : ''}
            prefix={<LockOutlined />}
            {...field}
          />
        )}
      />
    </>
  );
};

export default RegistrationFormFields;

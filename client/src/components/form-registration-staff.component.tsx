import React from 'react';
import { Form, Input } from 'antd';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { IRegistrationPayload } from '../interfaces/login.interface';

interface RegistrationFormFieldsProps {
  control: Control<any>;
  errors: FieldErrors<IRegistrationPayload>;
}

const RegistrationFormFields: React.FC<RegistrationFormFieldsProps> = ({
  control,
  errors,
}) => {
  return (
    <>
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
        Username or Email <span style={{ color: 'red' }}>*</span>
      </p>
      <Controller
        name="username"
        control={control}
        rules={{
          required: 'This field is required',
          minLength: {
            message: 'Username must be at least 8 characters',
            value: 8,
          },
          maxLength: {
            message: 'Username must be not greater than 125 characters',
            value: 125,
          },
        }}
        render={({ field }) => (
          <>
            <Form.Item extra="Username requires a minimum of 6 and 100 max characters.">
              <Input
                size="large"
                placeholder="Enter"
                prefix={<UserOutlined />}
                {...field}
              />
            </Form.Item>

            {errors.username && (
              <div style={{ color: 'red', padding: 5 }}>
                {errors.username.message}
              </div>
            )}
          </>
        )}
      />
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
        Password <span style={{ color: 'red' }}>*</span>
      </p>
      <Controller
        name="password"
        control={control}
        rules={{
          required: 'This field is required',
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            message:
              'The password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).',
          },
          minLength: {
            message: 'Password must be at least 8 characters',
            value: 8,
          },
          maxLength: {
            message: 'Password must be not greater than 125 characters',
            value: 125,
          },
        }}
        render={({ field }) => (
          <>
            <Form.Item extra="Password requires 1 special, 1 uppercase, 1 number, and a minimum of 6 characters.">
              <Input.Password
                size="large"
                placeholder="Enter"
                prefix={<LockOutlined />}
                {...field}
              />
            </Form.Item>
            {errors.password && (
              <div style={{ color: 'red', padding: 5 }}>
                {errors.password.message}
              </div>
            )}
          </>
        )}
      />
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
        Confirm <span style={{ color: 'red' }}>*</span>
      </p>
      <Controller
        name="confirm"
        control={control}
        rules={{
          required: 'This field is required',
          validate: (value, { password }) =>
            value === password || 'Passwords do not match',
        }}
        render={({ field }) => (
          <>
            <Input.Password
              size="large"
              placeholder="Enter"
              prefix={<LockOutlined />}
              {...field}
            />
            {errors.confirm && (
              <div style={{ color: 'red', padding: 5 }}>
                {errors.confirm.message}
              </div>
            )}
          </>
        )}
      />
    </>
  );
};

export default RegistrationFormFields;

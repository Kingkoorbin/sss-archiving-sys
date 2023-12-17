import React from 'react';
import { Input } from 'antd';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { ILoginPayload } from '../interfaces/login.interface';

interface LoginFormFieldsProps {
  control: Control<any>;
  errors: FieldErrors<ILoginPayload>;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  control,
  errors,
}) => {
  return (
    <>
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
        Username or Email
      </p>
      <Controller
        name="username"
        control={control}
        rules={{
          required: 'This field is required',
        }}
        render={({ field }) => (
          <Input size="middle" placeholder="Enter" {...field} />
        )}
      />
      {errors.username && (
        <div style={{ color: 'red', padding: 5 }}>
          {errors.username.message}
        </div>
      )}
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Password</p>
      <Controller
        name="password"
        control={control}
        rules={{
          required: 'This field is required',
        }}
        render={({ field }) => (
          <Input.Password size="middle" placeholder="Enter" {...field} />
        )}
      />
      {errors.password && (
        <div style={{ color: 'red', padding: 5 }}>
          {errors.password.message}
        </div>
      )}
    </>
  );
};

export default LoginFormFields;

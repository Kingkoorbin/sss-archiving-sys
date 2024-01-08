import React from 'react';
import { Input, Select } from 'antd';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { ILoginPayload } from '../interfaces/login.interface';
import { IEmailPayload } from '../interfaces/api.interface';
import TextArea from 'antd/es/input/TextArea';

interface EmailFormFieldsProps {
  control: Control<any>;
  errors: FieldErrors<IEmailPayload>;
}

const EmailFormFields: React.FC<EmailFormFieldsProps> = ({
  control,
  errors,
}) => {
  return (
    <>
      <Controller
        name="status"
        control={control}
        rules={{
          required: 'This field is required',
        }}
        render={({ field }) => (
          <Select
            showSearch
            size="large"
            placeholder="Select a Status"
            optionFilterProp="children"
            options={[
              { value: 'PENDING', label: 'Pending' },
              { value: 'PROCESSING', label: 'Processing' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'DONE', label: 'Done' },
            ]}
            style={{ width: '100%' }}
            {...field}
          />
        )}
      />
      {errors.status && (
        <div style={{ color: 'red', padding: 5 }}>{errors.status.message}</div>
      )}

      <Controller
        name="body"
        control={control}
        rules={{
          required: 'This field is required',
        }}
        render={({ field }) => (
          <TextArea
            rows={4}
            placeholder="Write a message"
            maxLength={255}
            style={{ marginTop: 10 }}
            {...field}
          />
        )}
      />
      {errors.status && (
        <div style={{ color: 'red', padding: 5 }}>{errors.status.message}</div>
      )}
    </>
  );
};

export default EmailFormFields;

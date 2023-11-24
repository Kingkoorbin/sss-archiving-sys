import React from 'react';
import { Input } from 'antd';
import { Control, Controller } from 'react-hook-form';
import { FieldNumberOutlined, HomeOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';

interface SbrFormFieldsProps {
  control: Control<any>;
}

const SbrFormFields: React.FC<SbrFormFieldsProps> = ({ control }) => {
  return (
    <>
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>SBR Number</p>
      <Controller
        name="sbr_no"
        control={control}
        render={({ field }) => (
          <Input
            size="large"
            placeholder="Enter"
            prefix={<FieldNumberOutlined />}
            {...field}
          />
        )}
      />
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>SBR Date</p>
      <Controller
        name="sbr_date"
        control={control}
        render={({ field }) => (
          <DatePicker size="large" style={{ width: '100%' }} {...field} />
        )}
      />
    </>
  );
};

export default SbrFormFields;

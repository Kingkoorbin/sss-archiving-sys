import React from 'react';
import { Input } from 'antd';
import { Control, Controller } from 'react-hook-form';
import { HomeOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

interface ExperienceFormFieldsProps {
  control: Control<any>;
}

const ExperienceFormFields: React.FC<ExperienceFormFieldsProps> = ({
  control,
}) => {
  return (
    <>
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
        Company/Employer
      </p>
      <Controller
        name="company_name"
        control={control}
        render={({ field }) => (
          <Input
            size="large"
            placeholder="Enter"
            prefix={<HomeOutlined />}
            {...field}
          />
        )}
      />
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Position</p>
      <Controller
        name="position"
        control={control}
        render={({ field }) => (
          <Input size="large" placeholder="Enter" {...field} />
        )}
      />
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
        Responsibilities
      </p>
      <Controller
        name="responsibilities"
        control={control}
        render={({ field }) => (
          <Input.TextArea size="large" placeholder="Enter" {...field} />
        )}
      />
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12, width: '100%' }}>
        Duration
      </p>
      <Controller
        name="duration"
        control={control}
        render={({ field }) => (
          <RangePicker style={{ width: '100%' }} size="large" {...field} />
        )}
      />
    </>
  );
};

export default ExperienceFormFields;

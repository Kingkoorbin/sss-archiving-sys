import React from 'react';
import { Flex, Input } from 'antd';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { HomeOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import { IExperiencePayload } from '../interfaces/client.interface';

const { RangePicker } = DatePicker;

interface ExperienceFormFieldsProps {
  control: Control<any>;
  errors: FieldErrors<IExperiencePayload>;
}

const ExperienceFormFields: React.FC<ExperienceFormFieldsProps> = ({
  control,
}) => {
  return (
    <>
      <Flex gap={5}>
        <div  style={{ width: '100%' }}>
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
                style={{ width: '100%' }}
                {...field}
              />
            )}
          />
        </div>
        <div  style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Position</p>
          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <Input size="large" placeholder="Enter"  style={{ width: '100%' }} {...field} />
            )}
          />
        </div>
        <div  style={{ width: '100%' }}>
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
        </div>
      </Flex>
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

    </>
  );
};

export default ExperienceFormFields;

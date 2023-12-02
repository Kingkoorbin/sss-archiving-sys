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
  errors
}) => {
  return (
    <>
      <Flex gap={5}>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Company/Employer
          </p>
          <Controller
            name="company_name"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value:/^[A-Za-z\s\-.,&]+$/,
                message: 'Invalid Company name',
              },
              minLength: {
                message: 'Invalid Company name',
                value: 2,
              },
              maxLength: {
                message: 'Maximum of 75 characters only.',
                value: 75,
              },
            }}
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
          {errors.company_name && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.company_name.message}
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Position</p>
          <Controller
            name="position"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Invalid Job Title',
              },
              minLength: {
                message: 'Invalid Job Title',
                value: 6,
              },
              maxLength: {
                message: 'Maximum of 75 characters only.',
                value: 75,
              },
            }}
            render={({ field }) => (
              <Input size="large" placeholder="Enter" style={{ width: '100%' }} {...field} />
            )}
          />
          {errors.position && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.position.message}
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12, width: '100%' }}>
            Duration
          </p>
          <Controller
            name="duration"
            control={control}
            rules={{
              required: 'This field is required',
            }}
            render={({ field }) => (
              <RangePicker style={{ width: '100%' }} size="large" {...field} />
            )}
          />
          {errors.duration && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.duration.message}
            </div>
          )}
        </div>
      </Flex>
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
        Responsibilities
      </p>
      <Controller
        name="responsibilities"
        control={control}
        rules={{
          required: 'This field is required',
          pattern: {
            value:/^[A-Za-z\s\-.,&]+$/,
            message: 'Invalid content.',
          },
          minLength: {
            message: 'Please add more details.',
            value: 8,
          },
          maxLength: {
            message: 'Maximum of 510 characters only.',
            value: 510,
          },
        }}
        render={({ field }) => (
          <Input.TextArea size="large" placeholder="Enter" {...field} />
        )}
      />
      {errors.responsibilities && (
        <div style={{ color: 'red', padding: 5 }}>
          {errors.responsibilities.message}
        </div>
      )}
    </>
  );
};

export default ExperienceFormFields;

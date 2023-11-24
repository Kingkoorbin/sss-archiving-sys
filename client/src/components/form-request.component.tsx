import React from 'react';
import { DatePicker, Flex, Input } from 'antd';
import { Control, Controller } from 'react-hook-form';
import {
  FieldNumberOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';

interface RequestFormFieldsProps {
  control: Control<any>;
  errors: any;
}

const RequestFormFields: React.FC<RequestFormFieldsProps> = ({
  control,
  errors,
}) => {
  return (
    <>
      <div>
        <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Full name</p>
        <Controller
          name="name"
          control={control}
          rules={{
            required: 'This field is required',
            minLength: {
              message: 'Please use your real name.',
              value: 6,
            },
            maxLength: {
              message: 'Please use your real name.',
              value: 255,
            },
          }}
          render={({ field }) => (
            <Input
              size="large"
              placeholder="Enter"
              prefix={<UserOutlined />}
              {...field}
            />
          )}
        />
        {errors.name && (
          <div style={{ color: 'red', padding: 5 }}>{errors.name.message}</div>
        )}
      </div>

      <Flex gap={20}>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Contact No.
          </p>
          <Controller
            name="phone_number"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^\+639\d{9}$/,
                message: 'Please use the correct format e.g. +639000000000',
              },
              minLength: {
                message: 'Invalid number length',
                value: 13,
              },
              maxLength: {
                message: 'Invalid number length',
                value: 13,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                style={{ width: '100%' }}
                prefix={<PhoneOutlined />}
                count={{
                  max: 13,
                  show: true,
                }}
                {...field}
              />
            )}
          />
          {errors.phone_number && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.phone_number.message}
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Email</p>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                style={{ width: '100%' }}
                prefix={<MailOutlined />}
                {...field}
              />
            )}
          />
          {errors.email && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.email.message}
            </div>
          )}
        </div>
      </Flex>

      <div>
        <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
          SSS Number
        </p>
        <Controller
          name="sss_no"
          control={control}
          rules={{
            required: 'This field is required',
            minLength: {
              message: 'Minimum length of 10',
              value: 10,
            },
            maxLength: {
              message: 'Maximum length of 25',
              value: 25,
            },
          }}
          render={({ field }) => (
            <Input
              size="large"
              type="number"
              placeholder="Enter"
              prefix={<FieldNumberOutlined />}
              {...field}
            />
          )}
        />
        {errors.sss_no && (
          <div style={{ color: 'red', padding: 5 }}>
            {errors.sss_no.message}
          </div>
        )}
      </div>
      <Flex gap={20}>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Date of Employment
          </p>
          <Controller
            name="date_of_employment"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <DatePicker size="large" style={{ width: '100%' }} {...field} />
            )}
          />
          {errors.date_of_employment && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.date_of_employment.message}
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Date of Resignation
          </p>
          <Controller
            name="date_of_resignation"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <DatePicker size="large" style={{ width: '100%' }} {...field} />
            )}
          />
          {errors.date_of_resignation && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.date_of_resignation.message}
            </div>
          )}
        </div>
      </Flex>
      <div>
        <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Requester</p>
        <Controller
          name="requester"
          control={control}
          rules={{
            required: 'This field is required',
            minLength: {
              message: 'Please use a real name.',
              value: 6,
            },
            maxLength: {
              message: 'Please use a real name.',
              value: 255,
            },
          }}
          render={({ field }) => (
            <Input
              size="large"
              placeholder="Enter"
              prefix={<UserOutlined />}
              {...field}
            />
          )}
        />
        {errors.requester && (
          <div style={{ color: 'red', padding: 5 }}>
            {errors.requester.message}
          </div>
        )}
      </div>
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Date needed</p>
      <Controller
        name="date_needed"
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field }) => (
          <DatePicker size="large" style={{ width: '100%' }} {...field} />
        )}
      />
      {errors.date_needed && (
        <div style={{ color: 'red', padding: 5 }}>
          {errors.date_needed.message}
        </div>
      )}
    </>
  );
};

export default RequestFormFields;

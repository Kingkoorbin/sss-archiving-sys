import React from 'react';
import { Checkbox, DatePicker, Flex, Input } from 'antd';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { MailOutlined, NumberOutlined, UserOutlined } from '@ant-design/icons';

interface RequestFormFieldsProps {
  control: Control<any>;
  errors: any;
  watch: UseFormWatch<any>;
}

const RequestFormFields: React.FC<RequestFormFieldsProps> = ({
  control,
  errors,
  watch,
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

      <Flex gap={20} className="registration-employee-row1">
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
                value: /^[0-9]+$/,
                message: 'Invalid Phone number',
              },
              minLength: {
                message: 'Invalid Phone number',
                value: 10,
              },
              maxLength: {
                message: 'Invalid Phone number',
                value: 10,
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                addonBefore="+63"
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
            pattern: {
              value: /^[0-9]{2}-[0-9]+-[0-9]{1}$/,
              message: 'Format of SSS No. 00-00000000-0',
            },
            minLength: {
              message: 'Invalid SSS No.',
              value: 9,
            },
            maxLength: {
              message: 'Invalid SSS No.',
              value: 25,
            },
          }}
          render={({ field }) => (
            <Input
              size="large"
              placeholder="Enter"
              prefix={<NumberOutlined />}
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
      <Flex gap={20} style={{ opacity: watch('all') ? 0.15 : 1 }}>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Date start
          </p>
          <Controller
            name="date_of_employment"
            control={control}
            rules={{
              required: {
                value: watch('all') ? false : true,
                message: 'This field is required',
              },
            }}
            render={({ field }) => (
              <DatePicker
                size="large"
                style={{ width: '100%' }}
                {...field}
                disabled={watch('all')}
              />
            )}
          />
          {errors.date_of_employment && !watch('all') && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.date_of_employment.message}
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            Date end
          </p>
          <Controller
            name="date_of_resignation"
            control={control}
            rules={{
              required: {
                value: watch('all') ? false : true,
                message: 'This field is required',
              },
            }}
            render={({ field }) => (
              <DatePicker
                size="large"
                style={{ width: '100%' }}
                {...field}
                disabled={watch('all') ? true : false}
              />
            )}
          />
          {errors.date_of_resignation && !watch('all') && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.date_of_resignation.message}
            </div>
          )}
        </div>
      </Flex>

      <div style={{ marginTop: 20 }}>
        <Controller
          name="all"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Request my entire record
            </Checkbox>
          )}
        />
      </div>
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
        <div style={{ marginTop: 20 }}>
          <Controller
            name="same_as_fullname"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              >
                Same as Full name
              </Checkbox>
            )}
          />
        </div>
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

      <Flex justify="end" style={{ marginTop: 20 }}>
        <Controller
          name="accept_terms"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              style={{ fontSize: 11 }}
            >
              I have read and understood the terms and conditions outlined in the Data Privacy Act of 2012, <br/>and I hereby agree to abide by them. I understand that my use of this system is subject to these terms.
            </Checkbox>
          )}
        />
      </Flex>
    </>
  );
};

export default RequestFormFields;

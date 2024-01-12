import React from 'react';
import { Flex, Input } from 'antd';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FieldNumberOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import { IContribution } from '../interfaces/client.interface';

interface ContributionFormFieldsProps {
  control: Control<any>;
  includeBatchDate?: boolean;
  errors: FieldErrors<IContribution>;
}

const ContributionFormFields: React.FC<ContributionFormFieldsProps> = ({
  control,
  includeBatchDate,
  errors,
}) => {
  return (
    <>
      <div style={{ width: '100%' }}>
        <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Name</p>
        <Controller
          name="name"
          control={control}
          rules={{
            required: 'This field is required',
          }}
          render={({ field }) => (
            <Input
              size="large"
              placeholder="Enter"
              {...field}
            />
          )}
        />
        {errors.name && (
          <div style={{ color: 'red', padding: 5 }}>{errors.name.message}</div>
        )}
      </div>
      <div style={{ width: '100%' }}>
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
      <Flex gap={10}>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            SBR Number
          </p>
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
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
            SBR Date
          </p>
          <Controller
            name="sbr_date"
            control={control}
            render={({ field }) => (
              <DatePicker size="large" style={{ width: '100%' }} {...field} />
            )}
          />
        </div>
        {includeBatchDate ? (
          <div style={{ width: '100%' }}>
            <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Year</p>
            <Controller
              name="batchDate"
              control={control}
              rules={{
                required: {
                  message: 'This field is required',
                  value: includeBatchDate,
                },
              }}
              render={({ field }) => (
                <DatePicker
                  picker="month"
                  size="large"
                  style={{ width: '100%' }}
                  {...field}
                />
              )}
            />
            {errors.batchDate && (
              <div style={{ color: 'red', padding: 5 }}>
                {errors.batchDate.message}
              </div>
            )}
          </div>
        ) : (
          <> </>
        )}
      </Flex>
      <Flex gap={10}>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>SS</p>
          <Controller
            name="ss"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: 'Only numbers and up to two decimals are allowed.',
              },
            }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                {...field}
              />
            )}
          />
          {errors.ss && (
            <div style={{ color: 'red', padding: 5 }}>{errors.ss.message}</div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>EC</p>
          <Controller
            name="ec"
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: 'Only numbers and up to two decimals are allowed.',
              },
            }}
            control={control}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                {...field}
              />
            )}
          />
          {errors.ec && (
            <div style={{ color: 'red', padding: 5 }}>{errors.ec.message}</div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>TOTAL</p>
          <Controller
            name="total"
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: 'Only numbers and up to two decimals are allowed.',
              },
            }}
            control={control}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Enter"
                {...field}
              />
            )}
          />
          {errors.total && (
            <div style={{ color: 'red', padding: 5 }}>
              {errors.total.message}
            </div>
          )}
        </div>
      </Flex>
    </>
  );
};

export default ContributionFormFields;

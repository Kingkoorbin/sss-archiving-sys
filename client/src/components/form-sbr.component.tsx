import React from 'react';
import { Flex, Input } from 'antd';
import { Control, Controller } from 'react-hook-form';
import { FieldNumberOutlined, HomeOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';

interface ContributionFormFieldsProps {
  control: Control<any>;
}

const ContributionFormFields: React.FC<ContributionFormFieldsProps> = ({
  control,
}) => {
  return (
    <>
      <div style={{ width: '100%' }}>
        <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Name</p>
        <Controller
          name="name"
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
          SSS Number
        </p>
        <Controller
          name="sss_no"
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
      </Flex>
      <Flex gap={10}>
        <div style={{ width: '100%' }}>
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>SS</p>
          <Controller
            name="ss"
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
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>EC</p>
          <Controller
            name="ec"
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
          <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>TOTAL</p>
          <Controller
            name="total"
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
      </Flex>
    </>
  );
};

export default ContributionFormFields;

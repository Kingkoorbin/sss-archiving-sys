import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

interface DateRangeFormFieldsProps {
  control: Control<any>;
}

const DateRangeeFormFields: React.FC<DateRangeFormFieldsProps> = ({
  control,
}) => {
  return (
    <>
      <Controller
        name="duration"
        control={control}
        render={({ field }) => (
          <RangePicker style={{ width: '100%' }} size="middle" {...field} />
        )}
      />
    </>
  );
};

export default DateRangeeFormFields;

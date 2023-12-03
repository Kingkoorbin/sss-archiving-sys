import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchFormFieldsProps {
  control: Control<any>;
  isSearching: boolean;
}

const SearchSSSNoFormFields: React.FC<SearchFormFieldsProps> = ({
  control,
}) => {
  return (
    <>
      <Controller
        name="searchKeyword"
        control={control}
        render={({ field }) => (
          <Input
            placeholder="Search by SSS Number"
            style={{ marginBottom: 20 }}
            prefix={<SearchOutlined />}
            {...field}
          />
        )}
      />
    </>
  );
};

export default SearchSSSNoFormFields;

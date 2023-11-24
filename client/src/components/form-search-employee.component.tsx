import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Search from 'antd/es/input/Search';

interface SearchFormFieldsProps {
  control: Control<any>;
  onSearch: any;
  isSearching: boolean;
}

const SearchFormFields: React.FC<SearchFormFieldsProps> = ({
  control,
  isSearching,
  onSearch,
}) => {
  return (
    <>
      <Controller
        name="searchKeyword"
        control={control}
        render={({ field }) => (
          <Search
            placeholder="Search by School ID or department"
            style={{ marginBottom: 20 }}
            loading={isSearching}
            onSearch={onSearch}
            {...field}
          />
        )}
      />
    </>
  );
};

export default SearchFormFields;

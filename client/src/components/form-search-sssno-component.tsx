import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Search from 'antd/es/input/Search';

interface SearchFormFieldsProps {
  control: Control<any>;
  onSearch: any;
  isSearching: boolean;
}

const SearchSSSNoFormFields: React.FC<SearchFormFieldsProps> = ({
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
            placeholder="Search by SSS Number"
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

export default SearchSSSNoFormFields;

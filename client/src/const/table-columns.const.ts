import { ColumnsType } from 'antd/es/table';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

export const staffColumns: ColumnsType<DataType> = [
  {
    title: 'User',
    dataIndex: 'username',
    width: 150,
  },
  {
    title: 'Date Joined',
    dataIndex: 'verified_at',
    width: 150,
  },
  {
    title: 'Role',
    dataIndex: 'role',
    width: 150,
  },
];

export const employeeColumns: ColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'school_id',
    width: 120,
  },
  {
    title: 'Department',
    dataIndex: 'department',
    width: 150,
  },
  {
    title: 'First name',
    dataIndex: 'first_name',
    width: 140,
  },
  {
    title: 'Middle name',
    dataIndex: 'middle_name',
    width: 140,
  },
  {
    title: 'Last name',
    dataIndex: 'last_name',
    width: 140,
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    width: 60,
  },
  {
    title: 'Birthdate',
    dataIndex: 'birthdate',
    width: 100,
  },
  {
    title: 'Present address',
    dataIndex: 'present_address',
    width: 150,
  },
  {
    title: 'Permanent address',
    dataIndex: 'permanent_address',
    width: 150,
  },
  {
    title: 'Phone',
    dataIndex: 'phone_number',
    width: 60,
  },
  {
    title: 'Created',
    dataIndex: 'created_at',
    width: 160,
  },
];

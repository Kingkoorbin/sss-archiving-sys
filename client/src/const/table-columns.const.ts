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
    width: 100,
  },
  {
    title: 'Date Joined',
    dataIndex: 'verified_at',
    width: 100,
  },
  {
    title: 'Role',
    dataIndex: 'role',
    width: 100,
  },
  {
    title: 'Permission',
    dataIndex: 'permission',
    width: '60%',
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
    width: 200,
  },
  {
    title: 'First name',
    dataIndex: 'first_name',
    width: 100,
  },
  {
    title: 'Middle name',
    dataIndex: 'middle_name',
    width: 100,
  },
  {
    title: 'Last name',
    dataIndex: 'last_name',
    width: 100,
  },

  // {
  //   title: 'Birthdate',
  //   dataIndex: 'birthdate',
  //   width: 100,
  // },
  {
    title: 'Present address',
    dataIndex: 'present_address',
    width: 170,
  },
  {
    title: 'Permanent address',
    dataIndex: 'permanent_address',
    width: 170,
  },
  {
    title: 'Phone',
    dataIndex: 'phone_number',
    width: 40,
  },
  {
    title: '',
    dataIndex: 'edit',
    width: 30,
  },
  {
    title: '',
    dataIndex: 'view',
    width: 30,
  },
  // {
  //   title: 'Created',
  //   dataIndex: 'created_at',
  //   width: 160,
  // },
];

export const contributionColumns: ColumnsType<DataType> = [
  {
    title: 'SSS No',
    dataIndex: 'sss_no',
    width: 50,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'SBR No',
    dataIndex: 'sbr_no',
    width: 100,
  },
  {
    title: 'SBR Date',
    dataIndex: 'sbr_date',
    width: 100,
  },
  {
    title: 'SS',
    dataIndex: 'ss',
    width: 100,
  },
  {
    title: 'EC',
    dataIndex: 'ec',
    width: 100,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    width: 100,
  },
  {
    title: '',
    dataIndex: 'edit',
    width: 40,
  },
];

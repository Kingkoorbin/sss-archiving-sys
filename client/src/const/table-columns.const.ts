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
    width: '20%',
  },
  {
    title: 'Date created',
    dataIndex: 'verified_at',
    width: '10%',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    width: '10%',
  },

  {
    title: 'Permission',
    dataIndex: 'permission',
    width: '50%',
  },
  {
    title: '',
    dataIndex: 'actions',
    width: '10%',
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
    dataIndex: 'actions',
    width: '10%',
  },
];

export const contributionColumns: ColumnsType<DataType> = [
  {
    title: 'Date',
    dataIndex: 'batchDate',
    width: '5%',
  },
  {
    title: 'SSS No',
    dataIndex: 'sss_no',
    width: '10%',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '30%',
  },
  {
    title: 'SBR No',
    dataIndex: 'sbr_no',
    width: '10%',
  },
  {
    title: 'SBR Date',
    dataIndex: 'sbr_date',
    width: '10%',
  },
  {
    title: 'SS',
    dataIndex: 'ss',
    width: '10%',
  },
  {
    title: 'EC',
    dataIndex: 'ec',
    width: '10%',
  },
  {
    title: 'Total',
    dataIndex: 'total',
    width: '10%',
  },
  {
    title: '',
    dataIndex: 'actions',
    width: '10%',
  },
];

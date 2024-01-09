import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tooltip,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';

// Custom Imports
import NavigationBarAdmin from '../../../components/nav-admin.component';
import RegistrationFormFields from '../../../components/form-registration-staff.component';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IRegistrationPayload } from '../../../interfaces/login.interface';
import { isEmpty } from '../../../utils/util';
import { API, API_BASE_URL } from '../../../const/api.const';
import HttpClient from '../../../utils/http-client.util';
import { IApiResponse } from '../../../interfaces/api.interface';
import useLocalStorage from '../../../hooks/useLocalstorage.hook';
import {
  IEmployeeProfile,
  IPermission,
  IUser,
  IUserPermission,
  IWorkHistory,
} from '../../../interfaces/client.interface';
import {
  formatStandardDate,
  formatStandardDateTime,
} from '../../../utils/date.util';
import { staffColumns } from '../../../const/table-columns.const';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

interface IState {
  isFetchingStaffs: boolean;
  isFetchingEmployees: boolean;
  isAuthModalOpen: boolean;
  isRegistrationModealOpen: boolean;
  isEmployeeRegistrationOpen: boolean;
  isWorkHistoryModalOpen: boolean;
  isPasswordNotMatched: boolean;
  isPasswordMinMaxErr: boolean;
  isUsernameAlreadyExist: boolean;
  stateWorkHistoryPreview?: IWorkHistory;
  employees: IEmployeeProfile[];
  users: IUser[];
  permissions: any[];
}

function AdminStaffList() {
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [state, setState] = useState<IState>({
    isFetchingStaffs: false,
    isFetchingEmployees: false,
    isAuthModalOpen: false,
    isRegistrationModealOpen: false,
    isWorkHistoryModalOpen: false,
    isPasswordNotMatched: false,
    isUsernameAlreadyExist: false,
    isPasswordMinMaxErr: false,
    isEmployeeRegistrationOpen: false,
    employees: [],
    users: [],
    permissions: [],
  });

  const handleOk = () => {
    setState((prev) => ({
      ...prev,
      isAuthModalOpen: false,
    }));

    navigate('/', { replace: true });
  };

  const onPermissionChange = async (
    value: { permissionId: number; userId: number },
    type: 'SELECT' | 'DESELECT'
  ) => {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${getAuthResponse?.access_token}`,
      },
    };
    try {
      if (type === 'DESELECT') {
        console.log('DESELECT!!');
        await axios.delete(
          `${API_BASE_URL}/api/user/v1/permission/${value.permissionId}`,
          config
        );
      } else if (type === 'SELECT') {
        console.log('SELECT!!');
        await axios.post(
          `${API_BASE_URL}/api/user/v1/permission`,
          {
            user_id: value.userId,
            permission_name_id: value.permissionId,
          },
          config
        );
      }

      toastSuccess('Permission updated successfully!');
    } catch (error: any) {
      if (error?.response?.status == 401) {
        setState((prev) => ({
          ...prev,
          isAuthModalOpen: true,
        }));
      }
      toastError('Oops! Something went wrong, Please try again.');
    }
  };

  const getAllStaffs = async () => {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${getAuthResponse?.access_token}`,
      },
    };

    setState((prev) => ({
      ...prev,
      isFetchingStaffs: true,
    }));

    try {
      const getAllStaffsResponse: AxiosResponse & { data: IUser[] } =
        await axios.get(`${API_BASE_URL}/api/client/v1`, {
          params: {
            role: 'STAFF',
          },
          ...config,
        });

      if (!Array.isArray(getAllStaffsResponse.data)) {
        return;
      }

      const getAllPermissionsResponse: { data: IPermission[] } =
        await axios.get(`${API_BASE_URL}/api/permission/v1`, config);
      const permissions = getAllPermissionsResponse.data.map(
        (el: IPermission) => {
          return {
            label: el.name,
            value: el.name,
          };
        }
      );

      const mappedStaffs = getAllStaffsResponse?.data.map((el: IUser) => {
        const currentPermissions = el.user_permissions.map((el: any) => {
          return {
            id: el.id,
            label: el.permission_name.name,
            value: el.permission_name.name,
          };
        });

        return {
          key: el.id,
          username: el.username,
          role: el.role,
          verified_at: formatStandardDate(el.created_at),
          actions: (
            <>
              <Popconfirm
                title="Do you want to delete this user?"
                onConfirm={() => onDeleteUser(el.id)}
                okText="Yes"
                cancelText="No"
                placement="bottomLeft"
              >
                <Tooltip title="Delete">
                  <Button
                    htmlType="button"
                    style={{ color: 'red' }}
                    icon={<CloseOutlined />}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </Popconfirm>
            </>
          ),
          permission: (
            <>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Select
                  mode="tags"
                  size={'middle'}
                  placeholder="Please select"
                  style={{ width: '100%' }}
                  options={permissions}
                  defaultValue={currentPermissions}
                  onSelect={(v) => {
                    const foundPermission: any =
                      getAllPermissionsResponse.data.find(
                        (permission: any) => permission.name === v
                      );
                    onPermissionChange(
                      { permissionId: foundPermission.id, userId: el.id },
                      'SELECT'
                    );
                  }}
                  onDeselect={(v) => {
                    const foundPermission: any = currentPermissions.find(
                      (permission: any) => permission.label === v
                    );
                    onPermissionChange(
                      { permissionId: foundPermission.id, userId: el.id },
                      'DESELECT'
                    );
                  }}
                />
              </Space>
            </>
          ),
        };
      });

      setState((prev) => ({
        ...prev,
        isFetchingStaffs: false,
        users: mappedStaffs as any,
      }));
    } catch (error: any) {
      if (error?.response?.status == 401) {
        setState((prev) => ({
          ...prev,
          isAuthModalOpen: true,
        }));
      }
    }
  };

  const onDeleteUser = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/user/v1/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthResponse?.access_token}`,
        },
      });

      toastSuccess('Removed successfully!');
      await getAllStaffs();
    } catch (error) {
      toastError('Oops! Something went wrong, Please try again.');
    }
  };

  useEffect(() => {
    document.title = 'Account Management | SSS Archiving System';
    getAllStaffs();
  }, []);

  return (
    <>
      {contextHolder}
      <NavigationBarAdmin />

      <div style={{ padding: '50px' }}>
        <Table
          columns={staffColumns}
          dataSource={state.users as any}
          size="middle"
          loading={state.isFetchingStaffs}
        />
      </div>

      <Modal
        open={state.isWorkHistoryModalOpen}
        onOk={() =>
          setState((prev) => ({
            ...prev,
            isWorkHistoryModalOpen: !state.isWorkHistoryModalOpen,
          }))
        }
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() =>
          setState((prev) => ({
            ...prev,
            isWorkHistoryModalOpen: !state.isWorkHistoryModalOpen,
          }))
        }
      >
        <p
          style={{
            padding: 0,
            margin: 0,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#111',
          }}
        >
          {state.stateWorkHistoryPreview?.company_name}
        </p>
        <p
          style={{
            padding: 0,
            margin: 0,
            fontSize: 14,
            fontWeight: 'normal',
            color: '#444',
            fontStyle: 'italic',
          }}
        >
          {state.stateWorkHistoryPreview?.position}
        </p>
        <p
          style={{
            padding: 0,
            margin: 0,
            fontSize: 16,
            fontWeight: 'normal',
            color: '#111',
          }}
        >
          {state.stateWorkHistoryPreview?.responsibilities}
        </p>

        <p
          style={{
            padding: 0,
            margin: 0,
            fontSize: 14,
            marginTop: 20,
            color: '#111',
          }}
        >
          {state.stateWorkHistoryPreview?.start_date} to{' '}
          {state.stateWorkHistoryPreview?.end_date}
        </p>
      </Modal>

      <Modal
        title="Oops!"
        closable={false}
        open={state.isAuthModalOpen}
        width={400}
        cancelButtonProps={{
          style: { display: 'none' },
        }}
        onOk={handleOk}
      >
        <p>
          Authentication session has expired. Kindly proceed to log in again for
          continued access.
        </p>
      </Modal>
    </>
  );

  function toastSuccess(message: string) {
    messageApi.success({
      type: 'success',
      content: message,
      style: {
        marginTop: '90vh',
      },
    });
  }

  function toastError(message: string) {
    messageApi.error({
      type: 'error',
      content: message,
      style: {
        marginTop: '90vh',
      },
    });
  }
}

export default AdminStaffList;

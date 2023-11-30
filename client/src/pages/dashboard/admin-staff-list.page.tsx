import { useEffect, useState } from 'react';
import { Button, Modal, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';

// Custom Imports
import NavigationBarAdmin from '../../components/nav-admin.component';
import RegistrationFormFields from '../../components/form-registration-staff.component';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IRegistrationPayload } from '../../interfaces/login.interface';
import { isEmpty } from '../../utils/util';
import { API } from '../../const/api.const';
import HttpClient from '../../utils/http-client.util';
import { IApiResponse } from '../../interfaces/api.interface';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import {
  IEmployeeProfile,
  IUser,
  IWorkHistory,
} from '../../interfaces/client.interface';
import { formatStandardDateTime } from '../../utils/date.util';
import { staffColumns } from '../../const/table-columns.const';

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
    stateWorkHistoryPreview: {
      client_id: 999,
      company_name: '',
      created_at: '',
      end_date: '',
      id: 999,
      position: '',
      responsibilities: '',
      start_date: '',
      updated_at: '',
    },
    employees: [],
    users: [],
  });

  const handleOk = () => {
    setState((prev) => ({
      ...prev,
      isAuthModalOpen: false,
    }));

    navigate('/', { replace: true });
  };

  const toastSuccess = (message: string) => {
    messageApi.success({
      type: 'success',
      content: message,
      style: {
        marginTop: '90vh',
      },
    });
  };

  const handleDismissStaffRegistration = () => {
    setState((prev) => ({
      ...prev,
      isRegistrationModealOpen: false,
    }));
  };

  const getAllStaffs = async () => {
    setState((prev) => ({
      ...prev,
      isFetchingStaffs: true,
    }));

    const getAllStafsResponse = await HttpClient.setAuthToken(
      getAuthResponse?.access_token
    ).get<IUser[], { role: string }>(API.users, { role: 'STAFF' });

    if (getAllStafsResponse.message === 'Authentication required.') {
      setState((prev) => ({
        ...prev,
        isAuthModalOpen: true,
      }));

      return;
    }

    if (!Array.isArray(getAllStafsResponse.data)) {
      return;
    }

    const mappedStaffs = getAllStafsResponse?.data.map((el) => ({
      key: el.id,
      username: el.username,
      role: el.role,
      verified_at: formatStandardDateTime(el.created_at),
    }));

    setState((prev) => ({
      ...prev,
      isFetchingStaffs: false,
      users: mappedStaffs as any,
    }));
  };

  useEffect(() => {
    document.title = 'Account Management | SSS Archiving System';
    getAllStaffs();
    return () => {};
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
}

export default AdminStaffList;

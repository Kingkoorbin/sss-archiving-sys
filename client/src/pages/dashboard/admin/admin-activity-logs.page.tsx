import { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';

// Custom Imports
import NavigationBarAdmin from '../../../components/nav-admin.component';
import { ColumnsType } from 'antd/es/table/interface';
import { API } from '../../../const/api.const';
import HttpClient from '../../../utils/http-client.util';
import {
  IActivity,
  IGetActivityPayload,
  IPaginationResponse,
} from '../../../interfaces/activity.interface';
import useLocalStorage from '../../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../../interfaces/api.interface';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../../utils/date.util';

interface IState {
  activities: IActivity[];
  isFetchingActivities: boolean;
  isAuthModalOpen: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'User',
    dataIndex: 'user',
    width: 150,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: 150,
  },
  {
    title: 'Date & Time',
    dataIndex: 'datetime',
    width: 150,
  },
];

function AdminActivityLogs() {
  const navigate = useNavigate();
  const [state, setState] = useState<IState>({
    activities: [],
    isFetchingActivities: false,
    isAuthModalOpen: false,
    pagination: {
      current: 1,
      pageSize: 13, // Set your initial page size here
      total: 0,
    },
  });

  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );

  const getActivities = async (page: number = 1) => {
    setState((prev) => ({
      ...prev,
      isFetchingActivities: true,
    }));

    const activitiesResponse = await HttpClient.setAuthToken(
      getAuthResponse?.access_token
    ).get<IPaginationResponse, IGetActivityPayload>(API.activities, {
      limit: state.pagination.pageSize,
      page,
    });

    if (activitiesResponse.message === 'Authentication required.') {
      setState((prev) => ({
        ...prev,
        isAuthModalOpen: true,
      }));

      return;
    }

    if (!Array.isArray(activitiesResponse.data?.data)) {
      return;
    }

    const mappedActivities = activitiesResponse.data?.data.map((el) => ({
      key: el.id,
      user: el.user.username,
      action: el.action_name,
      datetime: formatDateTime(el.created_at),
    }));

    setState((prev) => ({
      ...prev,
      activities: mappedActivities as any,
      isFetchingActivities: false,
      pagination: {
        ...prev.pagination,
        total: activitiesResponse.data?.total || 0,
      },
    }));
  };

  const handleTableChange = (pagination: any) => {
    setState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    }));
    getActivities(pagination.current);
  };

  const handleOk = () => {
    setState((prev) => ({
      ...prev,
      isAuthModalOpen: false,
    }));

    navigate('/', { replace: true });
  };

  useEffect(() => {
    document.title = 'Activity Logs | SSS Archiving System';

    getActivities();
    return () => {};
  }, []);

  return (
    <>
      <NavigationBarAdmin />
      <div style={{ padding: '50px' }}>
        <Table
          columns={columns}
          dataSource={state.activities as any}
          size="middle"
          loading={state.isFetchingActivities}
          pagination={state.pagination}
          onChange={handleTableChange}
        />
      </div>

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

export default AdminActivityLogs;

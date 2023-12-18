import { useEffect, useState } from 'react';
import StaffNavbar from '../../../components/nav-staff.component';
import {
  Badge,
  Button,
  Collapse,
  Divider,
  Flex,
  Modal,
  Select,
  Tooltip,
  theme,
} from 'antd';
import { CaretRightOutlined, EyeOutlined } from '@ant-design/icons';
import { IContributionRequest } from '../../../interfaces/client.interface';
import useLocalStorage from '../../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../../interfaces/api.interface';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../const/api.const';
import { formatStandardDate } from '../../../utils/date.util';
import axios, { AxiosRequestConfig } from 'axios';

interface IState {
  isAuthModalOpen: boolean;
  isFetchingContributionRequests: boolean;
  contributionRequests: IContributionRequest[];
}

function StaffRequests() {
  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );
  const [state, setState] = useState<IState>({
    isAuthModalOpen: false,
    isFetchingContributionRequests: false,
    contributionRequests: [],
  });

  const navigate = useNavigate();

  const getBadge = (value: string) => {
    switch (value) {
      case 'PENDING': {
        return <Badge color={'geekblue'} />;
      }
      case 'PROCESSING': {
        return <Badge color={'orange'} />;
      }
      case 'REJECTED': {
        return <Badge color={'red'} />;
      }
      case 'DONE': {
        return <Badge color={'green'} />;
      }
      default: {
      }
    }
  };

  const onContributionRequestStatusChange = async (
    status: string,
    id: number
  ) => {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${getAuthResponse?.access_token}`,
      },
    };
    try {
      const body = {
        id: id,
        status: status,
      };
      await axios.put(`${API_BASE_URL}/api/contribution/v1`, body, config);
      await getContributionsRequests();
    } catch (error) {
      console.log(error);
    }
  };

  const getContributionsRequests = async (status?: string) => {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${getAuthResponse?.access_token}`,
      },
      ...(status && { params: { status } }),
    };
    setState((prev) => ({
      ...prev,
      isFetchingContributionRequests: true,
    }));

    try {
      const getAllContributionRequestsResponse: {
        data: IContributionRequest[];
      } = await axios.get(`${API_BASE_URL}/api/contribution/v1`, config);
      setState((prev) => ({
        ...prev,
        isFetchingContributionRequests: false,
        contributionRequests: getAllContributionRequestsResponse.data?.map(
          (el) => ({
            ...el,
            key: el.id,
            label: (
              <Flex justify="space-between">
                <Flex gap={20}>
                  <div style={{ color: '#111', fontWeight: '600' }}>
                    {el.requester}
                  </div>
                  <div style={{ color: '#111', fontWeight: '600' }}>
                    SSS No. {el.sss_no}
                  </div>
                  <div style={{ color: '#111' }}>From. {el.name}</div>
                </Flex>
                <Flex gap={20}>
                  <div style={{ color: '#111' }}>
                    {formatStandardDate(el.created_at)}
                  </div>
                  <div style={{ color: '#111', fontWeight: '600' }}>
                    {getBadge(el.status)}
                  </div>
                </Flex>
              </Flex>
            ),
            children: (
              <div
                style={{ background: 'white', padding: 20, borderRadius: 20 }}
              >
                <Flex justify="space-between" align="start">
                  <div>
                    <div style={{ color: '#111', fontSize: 12 }}>SSS No.</div>
                    <div style={{ color: '#111', fontSize: 32 }}>
                      {el.sss_no}
                    </div>
                    <div style={{ color: '#111', fontSize: 12 }}>
                      Request my entire record
                    </div>
                    <div style={{ color: '#111', fontSize: 32 }}>
                      {' '}
                      {el.all ? 'YES' : 'NO'}
                    </div>
                  </div>

                  <Select
                    style={{ width: 200 }}
                    placeholder="Search to Select"
                    defaultValue={el.status}
                    onChange={(v) =>
                      onContributionRequestStatusChange(v, el.id)
                    }
                    options={[
                      {
                        value: 'PENDING',
                        label: 'Pending',
                      },
                      {
                        value: 'PROCESSING',
                        label: 'Processing',
                      },
                      {
                        value: 'REJECTED',
                        label: 'Rejected',
                      },
                      {
                        value: 'DONE',
                        label: 'Done',
                      },
                    ]}
                  />
                </Flex>
                <Divider dashed />
                <div style={{ color: '#111', fontSize: 12 }}>Contact No.</div>
                <div style={{ color: '#111', fontSize: 18 }}>
                  {el.phone_number}
                </div>
                <Divider dashed />
                <div style={{ color: '#111', fontSize: 12 }}>Email</div>
                <div style={{ color: '#111', fontSize: 18 }}>{el.email}</div>
                <Divider dashed />
                <div style={{ color: '#111', fontSize: 12 }}>Start - End</div>
                <Flex gap={20} align="center">
                  <div style={{ color: '#111', fontSize: 18 }}>
                    {formatStandardDate(el.date_of_employment)}
                  </div>
                  <div style={{ fontSize: 10 }}>TO</div>
                  <div style={{ color: '#111', fontSize: 18 }}>
                    {formatStandardDate(el.date_of_resignation)}
                  </div>
                </Flex>
                <Divider dashed />
                <div style={{ color: '#111', fontSize: 12 }}>Date needed</div>
                <div style={{ color: '#111', fontSize: 18 }}>
                  {formatStandardDate(el.date_needed)}
                </div>
                <Tooltip title="View">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    style={{ marginTop: 50 }}
                    onClick={() =>
                      navigate(`/dashboard/s/contribution`, {
                        state: {
                          request: el,
                        },
                      })
                    }
                  >
                    View contributions
                  </Button>
                </Tooltip>
                ,
              </div>
            ),
            style: panelStyle,
          })
        ) as any,
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

  const handleRequireLogin = () => {
    setState((prev) => ({
      ...prev,
      isAuthModalOpen: false,
    }));

    navigate('/', { replace: true });
  };

  useEffect(() => {
    document.title = 'Requests | SSS Archiving System';
    getContributionsRequests();
    return () => {};
  }, []);

  return (
    <>
      <StaffNavbar />

      <div style={{ padding: 50, background: '#fbfbff' }}>
        <Flex
          gap={20}
          style={{ marginBottom: 20, padding: 20, borderRadius: 20 }}
          justify="end"
        >
          <Flex
            gap={5}
            align="center"
            style={{ cursor: 'pointer ' }}
            onClick={() => getContributionsRequests('PENDING')}
          >
            <Badge color={'geekblue'} />
            <div style={{ fontSize: 12 }}>Pending</div>
          </Flex>
          <Flex
            gap={5}
            align="center"
            style={{ cursor: 'pointer ' }}
            onClick={() => getContributionsRequests('PROCESSING')}
          >
            <Badge color={'orange'} />
            <div style={{ fontSize: 12 }}>Processing</div>
          </Flex>
          <Flex
            gap={5}
            align="center"
            style={{ cursor: 'pointer ' }}
            onClick={() => getContributionsRequests('REJECTED')}
          >
            <Badge color={'red'} />
            <div style={{ fontSize: 12 }}>Rejected</div>
          </Flex>
          <Flex
            gap={5}
            align="center"
            style={{ cursor: 'pointer ' }}
            onClick={() => getContributionsRequests('DONE')}
          >
            <Badge color={'green'} />
            <div style={{ fontSize: 12 }}>Done</div>
          </Flex>
        </Flex>

        <Collapse
          bordered={false}
          size="middle"
          activeKey={1}
          ghost
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          items={state.contributionRequests as any}
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
        onOk={() => handleRequireLogin()}
      >
        <p>
          Authentication session has expired. Kindly proceed to log in again for
          continued access.
        </p>
      </Modal>
    </>
  );
}

export default StaffRequests;

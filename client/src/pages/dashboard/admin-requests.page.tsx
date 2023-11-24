import { useEffect, useState } from 'react';
import NavigationBarAdmin from '../../components/nav-admin.component';
import { Badge, Collapse, Divider, Flex, Modal, message, theme } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { IContributionRequest } from '../../interfaces/client.interface';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../interfaces/api.interface';
import { useNavigate } from 'react-router-dom';
import HttpClient from '../../utils/http-client.util';
import { API } from '../../const/api.const';
import { formatStandardDate } from '../../utils/date.util';

interface IState {
  isAuthModalOpen: boolean;
  isFetchingContributionRequests: boolean;
  contributionRequests: IContributionRequest[];
}

function AdminRequests() {
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

  const [messageApi, contextHolder] = message.useMessage();
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
  const getContributionsRequests = async () => {
    setState((prev) => ({
      ...prev,
      isFetchingContributionRequests: true,
    }));

    const getAllContributionRequestsResponse = await HttpClient.setAuthToken(
      getAuthResponse?.access_token
    ).get<IContributionRequest[], any>(API.contributionRequests, {});

    if (
      getAllContributionRequestsResponse.message === 'Authentication required.'
    ) {
      setState((prev) => ({
        ...prev,
        isAuthModalOpen: true,
      }));

      return;
    }

    if (!Array.isArray(getAllContributionRequestsResponse.data)) {
      return;
    }

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
            <div style={{ background: 'white', padding: 20, borderRadius: 20 }}>
              <div style={{ color: '#111', fontSize: 12 }}>SSS No.</div>
              <div style={{ color: '#111', fontSize: 18 }}>{el.sss_no}</div>
              <Divider dashed />

              <div style={{ color: '#111', fontSize: 12 }}>Contact No.</div>
              <div style={{ color: '#111', fontSize: 18 }}>
                {el.phone_number}
              </div>
              <Divider dashed />
              <div style={{ color: '#111', fontSize: 12 }}>Email</div>
              <div style={{ color: '#111', fontSize: 18 }}>{el.email}</div>
              <Divider dashed />
              <div style={{ color: '#111', fontSize: 12 }}>
                Date of Employment - Date of Resignation
              </div>
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
            </div>
          ),
          style: panelStyle,
        })
      ) as any,
    }));
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
      <NavigationBarAdmin />

      <div style={{ padding: 50, background: '#fbfbff' }}>
        <Flex
          gap={20}
          style={{ marginBottom: 20, padding: 20, borderRadius: 20 }}
          justify="end"
        >
          <Flex gap={5} align="center">
            <Badge color={'geekblue'} />
            <div style={{ fontSize: 12 }}>Pending</div>
          </Flex>
          <Flex gap={5} align="center">
            <Badge color={'orange'} />
            <div style={{ fontSize: 12 }}>Processing</div>
          </Flex>
          <Flex gap={5} align="center">
            <Badge color={'red'} />
            <div style={{ fontSize: 12 }}>Rejected</div>
          </Flex>
          <Flex gap={5} align="center">
            <Badge color={'green'} />
            <div style={{ fontSize: 12 }}>Done</div>
          </Flex>
        </Flex>

        <Collapse
          bordered={false}
          size="middle"
          ghost
          defaultActiveKey={['1']}
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

export default AdminRequests;

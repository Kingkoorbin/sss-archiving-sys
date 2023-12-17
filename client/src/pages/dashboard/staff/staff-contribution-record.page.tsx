import StaffNavbar from '../../../components/nav-staff.component';
import {
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  FilterOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {
  Alert,
  Button,
  Flex,
  Modal,
  Table,
  Tooltip,
  Upload,
  message,
} from 'antd';
import { API, API_BASE_URL } from '../../../const/api.const';
import { contributionColumns } from '../../../const/table-columns.const';
import {
  IContribution,
  IGeneratePdfPayload,
  ISBRPayload,
  IUser,
} from '../../../interfaces/client.interface';
import { useEffect, useState } from 'react';
import useLocalStorage from '../../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../../interfaces/api.interface';
import HttpClient from '../../../utils/http-client.util';
import SearchSSSNoFormFields from '../../../components/form-search-sssno-component';
import { SubmitHandler, useForm } from 'react-hook-form';
import DateRangeeFormFields from '../../../components/form-daterange.component';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import SbrFormFields from '../../../components/form-sbr.component';
import { hasPermission, isEmpty } from '../../../utils/util';
import { TPermissionTypes } from '../../../interfaces/permission.interface';

const { Dragger } = Upload;

interface IState {
  user?: IUser;
  isAuthModalOpen: boolean;
  isFetchingContributions: boolean;
  isSBRModalOpen: boolean;
  contributions: IContribution[];
  selectedContributionId: number | null;
}

export default function StaffContributionRecord() {
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );
  const [state, setState] = useState<IState>({
    user: undefined,
    isAuthModalOpen: false,
    isFetchingContributions: false,
    isSBRModalOpen: false,
    contributions: [],
    selectedContributionId: null,
  });

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    handleSubmit: handleSubmitGenerateFormData,
    control: generateController,
    setValue: setSearchValue,
  } = useForm<IGeneratePdfPayload>();

  const {
    handleSubmit: handleSubmitSBRFormData,
    control: sbrController,
    formState: { isSubmitting: isCreatingSBR },
  } = useForm<ISBRPayload>();

  const onGetUserProfile = async () => {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${getAuthResponse?.access_token}`,
      },
    };
    const getProfileResponse: AxiosResponse = await axios.get(
      `${API_BASE_URL}/api/user/v1`,
      {
        ...config,
      }
    );

    setState((prev) => ({
      ...prev,
      user: getProfileResponse.data,
    }));
  };

  const getContributions = async (data?: IGeneratePdfPayload) => {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${getAuthResponse?.access_token}`,
      },
    };

    try {
      setState((prev) => ({
        ...prev,
        isFetchingContributions: true,
      }));

      const getAllContributionsResponse: AxiosResponse & {
        data: IContribution[];
      } = await axios.get(`${API_BASE_URL}/api/record/v1`, {
        params: data,
        ...config,
      });

      const getProfileResponse: AxiosResponse = await axios.get(
        `${API_BASE_URL}/api/user/v1`,
        {
          ...config,
        }
      );

      const user: IUser = getProfileResponse.data;

      if (!user.user_permissions.length) {
        setState((prev) => ({
          ...prev,
          isFetchingContributions: false,
        }));
      }

      if (!Array.isArray(getAllContributionsResponse.data)) {
        return;
      }

      setState((prev) => ({
        ...prev,
        isFetchingContributions: false,
        contributions: getAllContributionsResponse.data?.map(
          (el: IContribution) => ({
            ...el,
            key: el.id,
            actions: (
              <Flex gap={10}>
                <Tooltip
                  title={
                    hasPermission(user.user_permissions, TPermissionTypes.EDIT)
                      ? 'Edit'
                      : 'No Permission'
                  }
                >
                  <Button
                    type="dashed"
                    icon={<EditOutlined />}
                    disabled={
                      !hasPermission(
                        user.user_permissions,
                        TPermissionTypes.EDIT
                      )
                    }
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        selectedContributionId: el.id,
                        isSBRModalOpen: !prev.isSBRModalOpen,
                      }))
                    }
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip
                  title={
                    hasPermission(
                      user.user_permissions,
                      TPermissionTypes.DELETE
                    )
                      ? 'Delete'
                      : 'No Permission'
                  }
                >
                  <Button
                    style={{ color: 'red' }}
                    icon={<CloseOutlined />}
                    disabled={
                      !hasPermission(
                        user.user_permissions,
                        TPermissionTypes.DELETE
                      )
                    }
                    onClick={() => onDeleteContribution(el.id)}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </Flex>
            ),
          })
        ) as any,
      }));

      // If there is a state coming from redirection
      if (!isEmpty(location.state)) {
        setSearchValue('searchKeyword', location.state?.request?.sss_no ?? '');
      }
    } catch (error: any) {
      if (error?.response?.status == 401) {
        setState((prev) => ({
          ...prev,
          isAuthModalOpen: true,
          isFetchingContributions: false,
        }));
      }
    }
  };

  const handleUpdateSbr: SubmitHandler<ISBRPayload> = async (data) => {
    const updateSbrResponse = await HttpClient.setAuthToken(
      getAuthResponse?.access_token
    ).put<IApiResponse, ISBRPayload>(
      `${API.contributions}/${state.selectedContributionId}/sbr`,
      data
    );

    if (updateSbrResponse?.message === 'Authentication required.') {
      setState((prev) => ({
        ...prev,
        isAuthModalOpen: true,
      }));

      return;
    }

    await getContributions();

    toastSuccess('Updated successfully!');

    setState((prev) => ({
      ...prev,
      isSBRModalOpen: false,
    }));
  };

  const handleApplyFilter: SubmitHandler<
    IGeneratePdfPayload & { searchKeyword?: string; duration?: any }
  > = async (data) => {
    const isInvalidSearchkey =
      /[0-9]/.test(data.searchKeyword!) && /[a-zA-Z]/.test(data.searchKeyword!);

    if (isInvalidSearchkey) {
      return toastError('Search keyword must be a Name or SSS Number');
    }

    // Check if the searchKeyword contains a number
    const isNumeric = /\d/.test(data.searchKeyword!);
    if (isNumeric) {
      // If it contains a number, search by schoolId
      await getContributions({
        sssNo: data.searchKeyword,
      });
    } else {
      // If it doesn't contain a number, search by department

      let startDate = null;
      let endDate = null;
      if (data.duration?.length == 2) {
        startDate = new Date(data.duration[0]).toISOString().substring(0, 10);
        endDate = new Date(data.duration[1]).toISOString().substring(0, 10);
      }

      console.log({
        name: data.searchKeyword,
        ...(startDate ? { from: startDate } : {}),
        ...(endDate ? { to: endDate } : {}),
      });
      await getContributions({
        name: data.searchKeyword,
        ...(startDate ? { from: startDate } : {}),
        ...(endDate ? { to: endDate } : {}),
      });
    }
  };

  const handleGeneratePdf = async () => {
    try {
      if (state.contributions.length >= 100) {
        return toastError(
          'Oops! Sorry, We cannot Generate PDF with more than 100 rows'
        );
      }

      const response = await axios.post(
        API.generatePdf,
        {
          array: state.contributions,
        },
        {
          responseType: 'blob', // Set the response type to blob
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'output.pdf';

      link.click();

      // Cleanup
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const props: UploadProps = {
    name: 'csv',
    multiple: false,
    action: API.uploadCsv,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        getContributions();
      } else if (status === 'error') {
        console.log('UPLOAD SUCCESS');
      }
    },
    accept: '.csv',
    showUploadList: true,
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleRequireLogin = () => {
    setState((prev) => ({
      ...prev,
      isAuthModalOpen: false,
    }));

    navigate('/', { replace: true });
  };

  const onDeleteContribution = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/record/v1/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthResponse?.access_token}`,
        },
      });

      toastSuccess('Removed successfully!');
      await getContributions();
    } catch (error) {
      toastError('Oops! Something went wrong, Please try again.');
    }
  };

  useEffect(() => {
    getContributions();
    onGetUserProfile();
  }, []);

  return (
    <>
      {contextHolder}
      <StaffNavbar />

      <div style={{ padding: 50 }}>
        <Tooltip
          title={
            hasPermission(
              state.user?.user_permissions!,
              TPermissionTypes.GENERATE
            )
              ? 'Generate'
              : 'No Permission'
          }
        >
          <Dragger
            disabled={
              !hasPermission(
                state.user?.user_permissions!,
                TPermissionTypes.GENERATE
              )
            }
            {...props}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag the CSV file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Strictly prohibited from uploading company data or other banned
              files.
            </p>
          </Dragger>
        </Tooltip>

        <div style={{ marginTop: 20 }}>
          <form onSubmit={handleSubmitGenerateFormData(handleApplyFilter)}>
            <Flex gap={5}>
              <SearchSSSNoFormFields
                control={generateController}
                isSearching={false}
              />
              <div>
                <DateRangeeFormFields control={generateController} />
              </div>
              <Button type="dashed" icon={<FilterOutlined />} htmlType="submit">
                Search
              </Button>

              <div style={{ marginLeft: 20 }}>
                <Tooltip
                  title={
                    hasPermission(
                      state.user?.user_permissions!,
                      TPermissionTypes.GENERATE
                    )
                      ? 'Generate'
                      : 'No Permission'
                  }
                >
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => handleGeneratePdf()}
                    disabled={
                      state.contributions.length >= 100 ||
                      !hasPermission(
                        state.user?.user_permissions!,
                        TPermissionTypes.GENERATE
                      )
                    }
                  >
                    Generate
                  </Button>
                </Tooltip>
              </div>
            </Flex>
          </form>

          <Modal
            title="Edit SBR"
            open={state.isSBRModalOpen}
            cancelButtonProps={{
              style: { display: 'none' },
            }}
            okButtonProps={{
              style: { display: 'none' },
            }}
            width={400}
            onCancel={() =>
              setState((prev) => ({
                ...prev,
                isSBRModalOpen: !prev.isSBRModalOpen,
              }))
            }
          >
            <form onSubmit={handleSubmitSBRFormData(handleUpdateSbr)}>
              <SbrFormFields control={sbrController} />
              <Button
                type="primary"
                size="middle"
                loading={isCreatingSBR}
                htmlType="submit"
                style={{ marginTop: 20 }}
                block
              >
                Submit
              </Button>
            </form>
          </Modal>

          <Table
            columns={contributionColumns}
            dataSource={state.contributions as any}
            loading={state.isFetchingContributions}
            size="middle"
          />

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
              Authentication session has expired. Kindly proceed to log in again
              for continued access.
            </p>
          </Modal>
        </div>
      </div>
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

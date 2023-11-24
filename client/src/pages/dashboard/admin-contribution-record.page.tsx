import NavigationBarAdmin from '../../components/nav-admin.component';
import {
  DownloadOutlined,
  EditOutlined,
  FilterOutlined,
  InboxOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Flex, Modal, Table, Tooltip, Upload, message } from 'antd';
import { API } from '../../const/api.const';
import { contributionColumns } from '../../const/table-columns.const';
import {
  IContribution,
  IGeneratePdfPayload,
  ISBRPayload,
  ISearchPayload,
} from '../../interfaces/client.interface';
import { useEffect, useState } from 'react';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../interfaces/api.interface';
import HttpClient from '../../utils/http-client.util';
import SearchSSSNoFormFields from '../../components/form-search-sssno-component';
import { SubmitHandler, useForm } from 'react-hook-form';
import DateRangeeFormFields from '../../components/form-daterange.component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SbrFormFields from '../../components/form-sbr.component';

const { Dragger } = Upload;

interface IState {
  isAuthModalOpen: boolean;
  isFetchingContributions: boolean;
  isSBRModalOpen: boolean;
  contributions: IContribution[];
  selectedContributionId: number | null;
}

export default function AdminContributionRecord() {
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );
  const [state, setState] = useState<IState>({
    isAuthModalOpen: false,
    isFetchingContributions: false,
    isSBRModalOpen: false,
    contributions: [],
    selectedContributionId: null,
  });

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const {
    handleSubmit: handleSubmitGenerateFormData,
    control: generateController,
    formState: { isSubmitting: isGeneratingPdf },
  } = useForm<IGeneratePdfPayload>();

  const {
    handleSubmit: handleSubmitSBRFormData,
    control: sbrController,
    formState: { isSubmitting: isCreatingSBR },
  } = useForm<ISBRPayload>();

  const getContributions = async (data?: IGeneratePdfPayload) => {
    setState((prev) => ({
      ...prev,
      isFetchingContributions: true,
    }));

    const getAllContributionsResponse = await HttpClient.setAuthToken(
      getAuthResponse?.access_token
    ).get<IContribution[], IGeneratePdfPayload>(API.contributions, data!);

    if (getAllContributionsResponse.message === 'Authentication required.') {
      setState((prev) => ({
        ...prev,
        isAuthModalOpen: true,
      }));

      return;
    }

    if (!Array.isArray(getAllContributionsResponse.data)) {
      return;
    }

    setState((prev) => ({
      ...prev,
      isFetchingContributions: false,
      contributions: getAllContributionsResponse.data?.map((el) => ({
        ...el,
        key: el.id,
        edit: (
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  selectedContributionId: el.id,
                  isSBRModalOpen: !prev.isSBRModalOpen,
                }))
              }
            />
          </Tooltip>
        ),
      })) as any,
    }));
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

  const toastSuccess = (message: string) => {
    messageApi.success({
      type: 'success',
      content: message,
      style: {
        marginTop: '90vh',
      },
    });
  };

  const handleRequireLogin = () => {
    setState((prev) => ({
      ...prev,
      isAuthModalOpen: false,
    }));

    navigate('/', { replace: true });
  };

  const toastError = (message: string) => {
    messageApi.error({
      type: 'error',
      content: message,
      style: {
        marginTop: '90vh',
      },
    });
  };

  useEffect(() => {
    getContributions();
  }, []);

  return (
    <>
      {contextHolder}
      <NavigationBarAdmin />
      <div style={{ padding: 50 }}>
        <Dragger {...props}>
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

        <div style={{ marginTop: 20 }}>
          <form onSubmit={handleSubmitGenerateFormData(handleApplyFilter)}>
            <Flex gap={5}>
              <SearchSSSNoFormFields
                onSearch={() => {}}
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
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => handleGeneratePdf()}
                  disabled={state.contributions.length >= 100}
                >
                  Generate
                </Button>
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
                shape="round"
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
}

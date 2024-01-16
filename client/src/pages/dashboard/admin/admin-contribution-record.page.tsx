import NavigationBarAdmin from '../../../components/nav-admin.component';
import {
  CloseOutlined,
  DeleteColumnOutlined,
  DownloadOutlined,
  EditOutlined,
  FileOutlined,
  FilterOutlined,
  InboxOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {
  Button,
  DatePicker,
  Flex,
  Modal,
  Popconfirm,
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
} from '../../../interfaces/client.interface';
import { useEffect, useState } from 'react';
import useLocalStorage from '../../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../../interfaces/api.interface';
import HttpClient from '../../../utils/http-client.util';
import SearchSSSNoFormFields from '../../../components/form-search-sssno-component';
import { SubmitHandler, useForm } from 'react-hook-form';
import DateRangeeFormFields from '../../../components/form-daterange.component';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ContributionFormFields from '../../../components/form-sbr.component';
import { isEmpty } from '../../../utils/util';

import dayjs from 'dayjs';
import moment from 'moment';

const { Dragger } = Upload;

interface IState {
  isAuthModalOpen: boolean;
  isFetchingContributions: boolean;
  isSBRModalOpen: boolean;
  isModalSingleContributionOpen: boolean;
  contributions: IContribution[];
  selectedContributionId: number | null;
  batchDate: string;
  sbrModalContent: {
    sbrDate: string;
    sbrNo: string;
  };
  generatePdfQuery?: any;
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
    batchDate: '',
    sbrModalContent: {
      sbrDate: '',
      sbrNo: '',
    },
    isModalSingleContributionOpen: false,
    generatePdfQuery: {},
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
    reset: sbrFormReset,
    setValue: setSbrValue,
    formState: { isSubmitting: isCreatingSBR, errors: contributionEditErrors },
  } = useForm<ISBRPayload>();

  const {
    handleSubmit: singleContributionSubmit,
    control: singleContributionController,
    reset: singleContributionReset,
    formState: {
      isSubmitting: singleContributionIsSubmitting,
      errors: singleContributionErrors,
    },
  } = useForm<IContribution>();

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

    // If there is a state coming from redirection
    if (!isEmpty(location.state)) {
      setSearchValue('searchKeyword', location.state?.request?.sss_no ?? '');
    }

    setState((prev) => ({
      ...prev,
      isFetchingContributions: false,
      contributions: getAllContributionsResponse.data?.map((el) => {
        return {
          ...el,
          key: el.id,
          batchDate: dayjs(el.batchDate).format('MMM YYYY'),
          ec: '₱' + el.ec,
          ss: '₱' + el.ss,
          total: '₱' + el.total,
          actions: (
            <Flex gap={10}>
              <Popconfirm
                title="Do you want to edit this contribution?"
                onConfirm={() => {
                  sbrFormReset();
                  if (el?.sbr_no) {
                    setSbrValue('sbr_no', el.sbr_no);
                  }
                  if (el?.sbr_date) {
                    setSbrValue(
                      'sbr_date',
                      moment(el.sbr_date, 'YYYY-MM-DD') as any
                    );
                  }
                  if (el?.ec) {
                    setSbrValue('ec', el.ec);
                  }
                  if (el?.ss) {
                    setSbrValue('ss', el.ss);
                  }
                  if (el?.total) {
                    setSbrValue('total', el.total);
                  }
                  if (el?.name) {
                    setSbrValue('name', el.name);
                  }
                  if (el?.sbr_no) {
                    setSbrValue('sbr_no', el.sbr_no);
                  }
                  if (el?.sss_no) {
                    setSbrValue('sss_no', el.sss_no);
                  }

                  setState((prev) => ({
                    ...prev,
                    selectedContributionId: el.id,
                    isSBRModalOpen: !prev.isSBRModalOpen,
                  }));
                }}
                okText="Yes"
                cancelText="No"
                placement="bottomLeft"
              >
                <Tooltip title="Edit">
                  <Button
                    htmlType="button"
                    type="dashed"
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>
                </Tooltip>
              </Popconfirm>

              <Popconfirm
                title="Do you want to delete this contribution?"
                onConfirm={() => onDeleteContribution(el.id)}
                okText="Yes"
                cancelText="No"
                placement="left"
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
            </Flex>
          ),
        };
      }) as any,
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

    sbrFormReset();

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

    let startDate: any = null;
    let endDate: any = null;
    if (data.duration?.length == 2) {
      startDate = new Date(data.duration[0]).toISOString().substring(0, 10);
      endDate = new Date(data.duration[1]).toISOString().substring(0, 10);
    }

    // Check if the searchKeyword contains a number
    const regex = /.*\d.*/;
    if (regex.test(data.searchKeyword!)) {
      // If it contains a number, search by schoolId
      await getContributions({
        sssNo: data.searchKeyword,
        ...(startDate ? { from: startDate } : {}),
        ...(endDate ? { to: endDate } : {}),
      });

      setState((prev) => ({
        ...prev,
        generatePdfQuery: {
          sssNo: data.searchKeyword,
          from: startDate,
          to: endDate,
        },
      }));
    } else {
      // If it doesn't contain a number, search by department
      await getContributions({
        name: data.searchKeyword,
        ...(startDate ? { from: startDate } : {}),
        ...(endDate ? { to: endDate } : {}),
      });
      setState((prev) => ({
        ...prev,
        generatePdfQuery: {
          name: data.searchKeyword,
          from: startDate,
          to: endDate,
        },
      }));
    }
  };

  const handleGeneratePdf = async () => {
    try {
      if (state.contributions.length >= 100) {
        return toastError(
          'Oops! Sorry, We cannot Generate PDF with more than 100 rows'
        );
      }
      await axios
        .get(API.generateContributionPdf, {
          params: {
            ...(state?.generatePdfQuery.name
              ? { name: state?.generatePdfQuery.name }
              : {}),
            ...(state?.generatePdfQuery.sssNo
              ? { sssNo: state?.generatePdfQuery.sssNo }
              : {}),
            ...(state?.generatePdfQuery.sssNo
              ? { displaySSSNo: state?.generatePdfQuery.sssNo }
              : {}),
            ...(state?.generatePdfQuery.name
              ? { displayName: state?.generatePdfQuery.name }
              : {}),
            ...(state?.generatePdfQuery.from && state?.generatePdfQuery.to
              ? {
                  from: state?.generatePdfQuery.from,
                  to: state?.generatePdfQuery.to,
                }
              : {}),
            ...(state?.generatePdfQuery.from && state?.generatePdfQuery.to
              ? {
                  displayCoverage: `${dayjs(
                    state?.generatePdfQuery.from
                  ).format('MMMM YYYY')} up to ${dayjs(
                    state?.generatePdfQuery.to
                  ).format('MMMM YYYY')}`,
                }
              : {}),
          },
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
          responseType: 'blob',
        })
        .then((response) => {
          console.log('response', response);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${new Date().toISOString()}.pdf`);
          document.body.appendChild(link);
          link.click();
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  const props: UploadProps = {
    name: 'csv',
    multiple: false,
    customRequest({ file, onSuccess, onError }) {
      if (typeof file === 'string') {
        console.log('String file:', file);
        return;
      }

      const formData = new FormData();
      formData.append('csv', file);
      formData.append('batchDate', state.batchDate);

      try {
        axios
          .post(API.uploadCsv, formData)
          .then((response) => {
            onSuccess?.(response, file as any);
            console.log('Upload success:', response);
          })
          .catch((error) => {
            onError?.(error, file);
            console.error('Upload error:', error);
          });
      } catch (error) {
        console.log(error);
      }
    },

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

  const rowProps = (record: IContribution) => ({
    onDoubleClick: () => {
      sbrFormReset();
      if (record?.sbr_no) {
        setSbrValue('sbr_no', record.sbr_no);
      }
      if (record?.sbr_date) {
        setSbrValue('sbr_date', moment(record.sbr_date, 'YYYY-MM-DD') as any);
      }
      if (record?.ec) {
        setSbrValue('ec', record.ec.substring(1, record.ec.length));
      }
      if (record?.ss) {
        setSbrValue('ss', record.ss.substring(1, record.ss.length));
      }
      if (record?.total) {
        setSbrValue('total', record.total.substring(1, record.total.length));
      }
      if (record?.name) {
        setSbrValue('name', record.name);
      }
      if (record?.sbr_no) {
        setSbrValue('sbr_no', record.sbr_no);
      }
      if (record?.sss_no) {
        setSbrValue('sss_no', record.sss_no);
      }
      setState((prev: any) => ({
        ...prev,
        selectedContributionId: record.id,
        isSBRModalOpen: !prev.isSBRModalOpen,
      }));
    },
  });

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

  const handleChangeBatchDate = (v: any) => {
    if (!isEmpty(v)) {
      setState((prev) => ({
        ...prev,
        batchDate: new Date(v).toISOString().substring(0, 10),
      }));
    }
  };

  const handleSaveSingleContribution: SubmitHandler<IContribution> = async (
    data
  ) => {
    try {
      await axios.post(`${API_BASE_URL}/api/record/v1/s`, data, {
        headers: {
          Authorization: `Bearer ${getAuthResponse?.access_token}`,
        },
      });

      singleContributionReset();

      await getContributions();

      toastSuccess('Saved successfully!');
      await getContributions();
    } catch (error) {
      toastError('Oops! Something went wrong, Please try again.');
    }
  };

  const handleDeleteContributionsByBatch = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/record/v1/batch/delete`, {
        data: {
          "date": `${state.batchDate.substring(0, 7)}-01`
        },
        headers: {
          Authorization: `Bearer ${getAuthResponse?.access_token}`,
        },
      });

      toastSuccess('Batch removed successfully!');
      await getContributions();
    } catch (error) {
      toastError('Oops! Something went wrong, Please try again.');
    }
  }

  useEffect(() => {
    getContributions();
  }, []);

  return (
    <>
      {contextHolder}
      <NavigationBarAdmin />
      <div style={{ padding: 50 }}>
        <div>
          <Dragger disabled={isEmpty(state.batchDate)} {...props}>
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
        </div>

        <div style={{ marginTop: 20 }}>
          <form onSubmit={handleSubmitGenerateFormData(handleApplyFilter)}>
            <Flex gap={5}>
              <Tooltip title="Add a single contribution">
                <Button
                  type="default"
                  shape="circle"
                  icon={<FileOutlined />}
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      isModalSingleContributionOpen:
                        !prev.isModalSingleContributionOpen,
                    }))
                  }
                />
              </Tooltip>
              <Flex gap={10} flex={3}>
                <SearchSSSNoFormFields
                  control={generateController}
                  isSearching={false}
                />
              </Flex>

              <div>
                <DateRangeeFormFields control={generateController} />
              </div>
              <Button type="dashed" icon={<FilterOutlined />} htmlType="submit">
                Search
              </Button>
              <div style={{ marginLeft: 20 }}>
                <Popconfirm
                  title="Do you want to print PDF?"
                  onConfirm={() => handleGeneratePdf()}
                  okText="Yes"
                  cancelText="No"
                  placement="bottomLeft"
                >
                  <Tooltip title="Print">
                    <Button
                      type="primary"
                      htmlType="button"
                      icon={<DownloadOutlined />}
                      disabled={state.contributions.length >= 100}
                      style={{ opacity:  state.contributions.length >= 100 ? 0.3 : 1 }}
                    >
                      Generate
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </div>
              <Flex flex={1}>
                <div></div>
              </Flex>
              <div>
                <Flex gap={5}>
                  <Tooltip
                    title="Select a batch date before uploading"
                    placement="bottomLeft"
                  >
                    <DatePicker
                      onChange={(v) => handleChangeBatchDate(v)}
                      picker="month"
                    />
                  </Tooltip>
                  <Tooltip
                    title="Delete the selected batch"
                    placement="bottomLeft"
                  >
                    <Button
                      type="default"
                      icon={<DeleteColumnOutlined />}
                      style={{ color: 'red', opacity:  isEmpty(state.batchDate) ? 0.3 : 1 }}
                      onClick={() => handleDeleteContributionsByBatch()}
                      disabled={isEmpty(state.batchDate)}
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </Flex>
              </div>
            </Flex>
          </form>

          <Modal
            title="Save Contribution"
            open={state.isModalSingleContributionOpen}
            cancelButtonProps={{
              style: { display: 'none' },
            }}
            okButtonProps={{
              style: { display: 'none' },
            }}
            width={700}
            onCancel={() =>
              setState((prev) => ({
                ...prev,
                isModalSingleContributionOpen:
                  !prev.isModalSingleContributionOpen,
              }))
            }
          >
            <form
              onSubmit={singleContributionSubmit(handleSaveSingleContribution)}
            >
              <ContributionFormFields
                control={singleContributionController}
                errors={singleContributionErrors}
                includeBatchDate
              />
              <Button
                type="primary"
                size="middle"
                loading={singleContributionIsSubmitting}
                htmlType="submit"
                style={{ marginTop: 10 }}
                block
              >
                Submit
              </Button>
            </form>
          </Modal>

          <Modal
            title="Edit Contribution"
            open={state.isSBRModalOpen}
            cancelButtonProps={{
              style: { display: 'none' },
            }}
            okButtonProps={{
              style: { display: 'none' },
            }}
            width={700}
            onCancel={() =>
              setState((prev) => ({
                ...prev,
                isSBRModalOpen: !prev.isSBRModalOpen,
              }))
            }
          >
            <form onSubmit={handleSubmitSBRFormData(handleUpdateSbr)}>
              <ContributionFormFields
                errors={contributionEditErrors}
                control={sbrController}
              />
              <Button
                type="primary"
                size="middle"
                loading={isCreatingSBR}
                htmlType="submit"
                style={{ marginTop: 10 }}
                block
              >
                Submit
              </Button>
            </form>
          </Modal>

          <Table
            columns={contributionColumns as any}
            dataSource={state.contributions as any}
            loading={state.isFetchingContributions}
            size="middle"
            onRow={rowProps}
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

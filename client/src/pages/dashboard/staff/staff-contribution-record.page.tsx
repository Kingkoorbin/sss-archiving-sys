import StaffNavbar from '../../../components/nav-staff.component';
import {
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  FileOutlined,
  FilterOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {
  Alert,
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
import dayjs from 'dayjs';
import ContributionFormFields from '../../../components/form-sbr.component';
import moment from 'moment';

const { Dragger } = Upload;

interface IState {
  user?: IUser;
  isAuthModalOpen: boolean;
  isFetchingContributions: boolean;
  isSBRModalOpen: boolean;
  contributions: IContribution[];
  selectedContributionId: number | null;
  batchDate: string;
  generatePdfQuery?: any;
  isModalSingleContributionOpen: boolean;
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
    batchDate: '',
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
    setValue: cntributionSetValue,
    formState: { isSubmitting: isCreatingSBR, errors: contributionEditErrors },
  } = useForm<ISBRPayload>();

  const {
    handleSubmit: singleContributionSubmit,
    control: singleContributionController,
    reset: singleContributionReset,
    setValue: singleContributionSetValue,
    formState: {
      isSubmitting: singleContributionIsSubmitting,
      errors: singleContributionErrors,
    },
  } = useForm<IContribution>();

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
            batchDate: dayjs(el.batchDate).format('MMM YYYY'),
            ec: '₱' + el.ec,
            ss: '₱' + el.ss,
            total: '₱' + el.total,
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
                    onClick={() => {
                      singleContributionReset();
                      if (el?.sbr_no) {
                        cntributionSetValue('sbr_no', el.sbr_no);
                      }
                      if (el?.sbr_date) {
                        cntributionSetValue(
                          'sbr_date',
                          moment(el.sbr_date, 'YYYY-MM-DD') as any
                        );
                      }
                      if (el?.ec) {
                        cntributionSetValue(
                          'ec',
                          el.ec.startsWith('₱') ? el.ec.substring(1) : el.ec
                        );
                      }
                      if (el?.ss) {
                        cntributionSetValue(
                          'ss',
                          el.ss.startsWith('₱') ? el.ss.substring(1) : el.ss
                        );
                      }
                      if (el?.total) {
                        cntributionSetValue(
                          'total',
                          el.total.startsWith('₱')
                            ? el.total.substring(1)
                            : el.total
                        );
                      }
                      if (el?.name) {
                        cntributionSetValue('name', el.name);
                      }
                      if (el?.sbr_no) {
                        cntributionSetValue('sbr_no', el.sbr_no);
                      }
                      if (el?.sss_no) {
                        cntributionSetValue('sss_no', el.sss_no);
                      }
                      setState((prev) => ({
                        ...prev,
                        selectedContributionId: el.id,
                        isSBRModalOpen: !prev.isSBRModalOpen,
                      }));
                    }}
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
        // Handle the case where 'file' is a string (e.g., file URL)
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
            // Handle success
            onSuccess?.(response, file as any);
            console.log('Upload success:', response);
          })
          .catch((error) => {
            // Handle error
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

  const rowProps = (record: IContribution) => ({
    onDoubleClick: () => {
      if (hasPermission(state.user?.user_permissions!, TPermissionTypes.EDIT)) {
        singleContributionReset();
        if (record?.sbr_no) {
          cntributionSetValue('sbr_no', record.sbr_no);
        }
        if (record?.sbr_date) {
          cntributionSetValue(
            'sbr_date',
            moment(record.sbr_date, 'YYYY-MM-DD') as any
          );
        }
        if (record?.ec) {
          cntributionSetValue('ec', record.ec.substring(1, record.ec.length));
        }
        if (record?.ss) {
          cntributionSetValue('ss', record.ss.substring(1, record.ss.length));
        }
        if (record?.total) {
          cntributionSetValue(
            'total',
            record.total.substring(1, record.total.length)
          );
        }
        if (record?.name) {
          cntributionSetValue('name', record.name);
        }
        if (record?.sbr_no) {
          cntributionSetValue('sbr_no', record.sbr_no);
        }
        if (record?.sss_no) {
          cntributionSetValue('sss_no', record.sss_no);
        }
        setState((prev: any) => ({
          ...prev,
          selectedContributionId: record.id,
          isSBRModalOpen: !prev.isSBRModalOpen,
        }));

        return;
      }

      alert('No Edit Permission');
    },
  });

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
          <div style={{ padding: 50 }}>
            <div style={{ position: 'relative' }}>
              <Dragger
                disabled={
                  isEmpty(state.batchDate) ||
                  !hasPermission(
                    state.user?.user_permissions!,
                    TPermissionTypes.UPLOAD
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
                  Strictly prohibited from uploading company data or other
                  banned files.
                </p>
              </Dragger>
              <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                <DatePicker
                  onChange={(v) => handleChangeBatchDate(v)}
                  disabled={
                    !hasPermission(
                      state.user?.user_permissions!,
                      TPermissionTypes.UPLOAD
                    )
                  }
                  picker="month"
                  size="large"
                />
              </div>
            </div>
          </div>
        </Tooltip>

        <div style={{ marginTop: 20 }}>
          <form onSubmit={handleSubmitGenerateFormData(handleApplyFilter)}>
            <Flex gap={5}>
              <Tooltip title="Add a single contribution">
                <Button
                  type="default"
                  shape="circle"
                  icon={<FileOutlined />}
                  disabled={
                    !hasPermission(
                      state.user?.user_permissions!,
                      TPermissionTypes.UPLOAD
                    )
                  }
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      isModalSingleContributionOpen:
                        !prev.isModalSingleContributionOpen,
                    }))
                  }
                />
              </Tooltip>
              <Flex gap={10} flex={1}>
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
                  title={
                    hasPermission(
                      state.user?.user_permissions!,
                      TPermissionTypes.GENERATE
                    )
                      ? 'Do you want to print PDF?'
                      : 'No Permission'
                  }
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
                </Popconfirm>
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
            title="Edit SBR"
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
              <SbrFormFields
                control={sbrController}
                errors={contributionEditErrors}
              />
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
            columns={contributionColumns as any}
            dataSource={state.contributions as any}
            loading={state.isFetchingContributions}
            onRow={rowProps}
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

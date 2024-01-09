import { SubmitHandler, useForm } from 'react-hook-form';
import RequestFormFields from '../../components/form-request.component';
import { IContributionRequest } from '../../interfaces/client.interface';
import { Button, Flex, message } from 'antd';
import { API_BASE_URL } from '../../const/api.const';
import axios from 'axios';
import { useEffect } from 'react';
import { isEmpty } from '../../utils/util';

function RequestPage() {
  const {
    handleSubmit: handleSubmitRequestFormData,
    control: requestController,
    watch,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting: isCreatingRequest, errors },
  } = useForm<IContributionRequest>();
  const [messageApi, contextHolder] = message.useMessage();

  const handleCreateRequest: SubmitHandler<IContributionRequest> = async (
    data
  ) => {
    data.status = 'PENDING';
    console.log(data);
    if (isEmpty(data.date_of_employment) && isEmpty(data.date_of_resignation)) {
      data.date_of_employment = '1999-01-01';
      data.date_of_resignation = '1999-01-01';
    }
    await axios.post(`${API_BASE_URL}/api/contribution/v1`, data);

    return toastSuccess('Submitted successfully!');
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

  useEffect(() => {
    if (watch('same_as_fullname') && getValues('name')) {
      setValue('requester', getValues('name'));
    }
  }, [watch('same_as_fullname')]);

  return (
    <>
      {contextHolder}
      <div style={{ background: '#fbfbff' }}>
        <Flex
          justify="center"
          style={{
            background: 'white',
            borderRadius: 20,
            width: '100%',
            marginTop: 100,
          }}
        >
          <div className="registration-employee-form-container">
            <form onSubmit={handleSubmitRequestFormData(handleCreateRequest)}>
              <RequestFormFields
                control={requestController}
                errors={errors}
                watch={watch}
              />
              <Flex gap={10}>
                <Button
                  type="default"
                  size="middle"
                  htmlType="reset"
                  style={{ marginTop: 20 }}
                  onClick={() => reset()}
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  size="middle"
                  loading={isCreatingRequest}
                  style={{ marginTop: 20 }}
                  htmlType="submit"
                >
                  Submit
                </Button>
              </Flex>
            </form>
          </div>
        </Flex>
      </div>
    </>
  );
}

export default RequestPage;

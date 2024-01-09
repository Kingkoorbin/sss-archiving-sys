import { SubmitHandler, useForm } from 'react-hook-form';
import RequestFormFields from '../../components/form-request.component';
import { IContributionRequest } from '../../interfaces/client.interface';
import { Button, Flex, Modal, message } from 'antd';
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
  const [modal, _] = Modal.useModal();

  const handleCreateRequest: SubmitHandler<IContributionRequest> = async (
    data
  ) => {
    data.status = 'PENDING';
    if (isEmpty(data.date_of_employment) && isEmpty(data.date_of_resignation)) {
      data.date_of_employment = '1999-01-01';
      data.date_of_resignation = '1999-01-01';
    }
    await axios.post(`${API_BASE_URL}/api/contribution/v1`, data);

    reset();
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
    if (watch('accept_terms')) {
      Modal.info({
        title: 'Data Privacy Act of 2012 Agreement',
        width:"30%",
        content: (
          <div>
            <p>
              Before proceeding, please review and agree to the terms outlined
              in the Data Privacy Act of 2012 (DPA). Your privacy is important
              to us, and we are committed to protecting your personal
              information. Terms and Conditions:
            </p>
            <p>
              1. <b>Confidentiality</b>: We assure you that any information you provide
              will be treated with the utmost confidentiality and will only be
              used for the intended purposes.
            </p>
            <p>
              2. <b>Data Security</b>: We employ industry-standard security measures to
              safeguard your data against unauthorized access, disclosure,
              alteration, and destruction.
            </p>
            <p>
              3. <b>Purpose Limitation</b>: Your data will only be used for the
              specified purpose for which it was collected, and no other
              unrelated purposes.
            </p>
            <p>
              4. <b>Consent</b>: You explicitly consent to the processing of your
              personal information in accordance with the provisions of the Data
              Privacy Act of 2012.
            </p>
          </div>
        ),
        onOk() {},
      });
    }
  }, [watch('same_as_fullname'), watch('accept_terms')]);

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
                  disabled={!watch('accept_terms')}
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

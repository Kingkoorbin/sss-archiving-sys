import axios from 'axios';
import NavigationBarAdmin from '../../components/nav-admin.component';
import { IEmployeeProfile, IExperiencePayload } from '../../interfaces/client.interface';
import { useEffect, useState } from 'react';
import { Button, Divider, Flex, message } from 'antd';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../interfaces/api.interface';
import { API_BASE_URL } from '../../const/api.const';
import { useLocation, useNavigate } from 'react-router-dom';
import avatar from "../../assets/avatar.png";
import Title from 'antd/es/typography/Title';
import { isEmpty } from '../../utils/util';
import { CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import ExperienceFormFields from '../../components/form-experience.component';
import { useForm } from 'react-hook-form';

interface IState {
    employee?: IEmployeeProfile;
    isSuccessCreatingEmployee: boolean;
}

function AdminEmployeePreview() {
    const [state, setState] = useState<IState>({
        employee: undefined,
        isSuccessCreatingEmployee: false
    });
    const { state: locationState }: { state: IEmployeeProfile } = useLocation();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();
    const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
        'auth_response',
        null
    );
    const {
        handleSubmit: handleSubmitExperienceFormData,
        control: experienceController,
        reset,
        formState: { isSubmitting: isCreatingExperience, errors },
    } = useForm<IExperiencePayload>();

    const getEmployeeInfo = async () => {
        try {
            const response: { data: IEmployeeProfile } = await axios.get(`${API_BASE_URL}/api/client/v1/${locationState.school_id}/information`, {
                headers: {
                    Authorization: `Bearer ${getAuthResponse?.access_token}`,
                },
            });

            setState((prev) => ({
                ...prev,
                employee: response.data
            }))
        } catch (error) {
            console.log(error)
        }
    }

    const toastSuccess = (message: string) => {
        messageApi.success({
            type: 'success',
            content: message,
            style: {
                marginTop: '90vh',
            },
        });
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
        getEmployeeInfo();
    }, [])


    return <>
        <NavigationBarAdmin />

        <div style={{ padding: "50px", background: "#fbfbff", }}>
            <Flex gap={50} justify='center'>
                <img src={avatar} alt="abatar" style={{ height: 250 }} />
                <div>
                    <div style={{ background: "white", padding: 50, width: 800, borderRadius: 20 }}>
                        <Flex justify='space-between' align='center'>
                            <div>
                                <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600" }}>Full name</p>
                                <p style={{ fontSize: 26, padding: 0, margin: 0 }}>
                                    {state.employee?.suffix}{!isEmpty(state.employee?.suffix) && <>.&nbsp;</>}
                                    {state.employee?.first_name}&nbsp;
                                    {state.employee?.last_name},&nbsp;
                                    {state.employee?.middle_name}
                                </p>
                            </div>
                            <Button
                                icon={<EditOutlined />}
                                onClick={() =>
                                    navigate(`/dashboard/a/account-management/employee/${state.employee?.school_id}/edit`, {
                                        state: state.employee,
                                    })
                                }
                            >Edit</Button>
                        </Flex>
                        <Divider dashed />

                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600" }}>Gender</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.gender}</p>
                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>Birthday</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.birthdate}</p>
                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>Civil Status</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.civil_status}</p>
                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>Blood type</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.blood_type}</p>
                        <Divider dashed />

                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>Phone No.</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.phone_number}</p>
                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>Email</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.email}</p>
                        <Divider dashed />

                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>Present Address</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.present_address}</p>
                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>Permanent Address</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.permanent_address}</p>
                        <Divider dashed />

                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>Main Employer</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.main_employer}</p>
                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>Address</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.address}</p>
                        <Divider dashed />

                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>School ID</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.school_id}</p>
                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>Department</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.department}</p>
                        <p style={{ padding: 0, margin: 0, fontSize: 11, color: "#111", fontWeight: "600", marginTop: 10 }}>Personnel Category</p>
                        <p style={{ fontSize: 26, padding: 0, margin: 0 }}>{state.employee?.personnel_category}</p>
                    </div>

                    <div style={{ background: "white", padding: 50, width: 800, marginTop: 50, borderRadius: 20 }}>
                        <Title>Work Experience</Title>
                        <ExperienceFormFields
                            errors={errors}
                            control={experienceController} />

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
                                loading={isCreatingExperience}
                                htmlType="submit"
                                disabled={state.isSuccessCreatingEmployee   }
                                icon={
                                    state.isSuccessCreatingEmployee ? (
                                        <CheckCircleOutlined />
                                    ) : (
                                        <></>
                                    )
                                }
                                style={{ marginTop: 20 }}
                            >
                                Submit
                            </Button>
                        </Flex>
                    </div>
                </div>
            </Flex>
        </div>
    </>
}

export default AdminEmployeePreview
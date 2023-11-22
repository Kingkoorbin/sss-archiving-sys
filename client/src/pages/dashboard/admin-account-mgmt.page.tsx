import { useEffect, useState } from "react";
import { Button, Flex, Modal, Table, Tabs, message } from "antd";
import { useNavigate } from "react-router-dom";

// Custom Imports
import NavigationBarAdmin from "../../components/nav-admin.component";
import RegistrationFormFields from "../../components/form-registration.component";
import { SubmitHandler, useForm } from "react-hook-form";
import { IRegistrationPayload } from "../../interfaces/login.interface";
import { isEmpty } from "../../utils/util";
import { API } from "../../const/api.const";
import HttpClient from "../../utils/http-client.util";
import { IApiResponse } from "../../interfaces/api.interface";
import useLocalStorage from "../../hooks/useLocalstorage.hook";
import { IEmployeeRegistrationPayload, IUser } from "../../interfaces/client.interface";
import { ColumnsType } from "antd/es/table";
import {  formatStandardDateTime } from "../../utils/date.util";
import RegistrationEmployeeFormFields from "../../components/form-registration-employee.component";

interface IState {
    isFetchingStaffs: boolean;
    isFetchingEmployees: boolean;
    isAuthModalOpen: boolean;
    isRegistrationModealOpen: boolean;
    isEmployeeRegistrationOpen: boolean;
    isPasswordNotMatched: boolean;
    isPasswordMinMaxErr: boolean;
    isUsernameAlreadyExist: boolean;
    users: IUser[];
}

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: "User",
        dataIndex: "username",
        width: 150,
    },
    {
        title: "Date Joined",
        dataIndex: "verified_at",
        width: 150,
    },
    {
        title: "Role",
        dataIndex: "role",
        width: 150,
    },
];

function AdminAccountManagement() {
    const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
        "auth_response",
        null,
    );
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    
    const { 
        handleSubmit: handleSubmitStaffFormData, 
        control: staffController, 
        formState: { isSubmitting: isCreatingAccount } 
    } = useForm<IRegistrationPayload>();

    const { 
        handleSubmit: handleSubmitEmployeeFormData, 
        control: employeeController,
        formState: { isSubmitting: isCreatingEmployee } 
    } = useForm<IEmployeeRegistrationPayload>();

    const [state, setState] = useState<IState>({
        isFetchingStaffs: false,
        isFetchingEmployees: false,
        isAuthModalOpen: false,
        isRegistrationModealOpen: false,
        isPasswordNotMatched: false,
        isUsernameAlreadyExist: false,
        isPasswordMinMaxErr: false,
        isEmployeeRegistrationOpen: false,
        users: [],
    });

    const handleOk = () => {
        setState((prev) => ({
            ...prev,
            isAuthModalOpen: false,
        }));

        navigate("/", { replace: true });
    };

    const handleOpeRegistration = (type: "EMPLOYEE" | "STAFF") => {
        if(type === "STAFF") {
            setState((prev) => ({
                ...prev,
                isRegistrationModealOpen: true,
            }));
        } else {
            setState((prev) => ({
                ...prev,
                isEmployeeRegistrationOpen: true,
            }));
        }
    };

    const handleRegistration: SubmitHandler<IRegistrationPayload> = async (
        data,
    ) => {
        if (isEmpty(data.username) || isEmpty(data.password)) {
            messageApi.error({
                type: "error",
                content: "Username and password is required.",
                style: {
                    marginTop: "90vh",
                },
            });

            return;
        }

        if (data.confirm?.trim() !== data.password?.trim()) {
            setState((prev) => ({
                ...prev,
                isPasswordNotMatched: true,
            }));

            messageApi.error({
                type: "error",
                content: "Password and confirm password does not match.",
                style: {
                    marginTop: "90vh",
                },
            });

            return;
        }

        const registrationResponse = await HttpClient.setAuthToken(
            getAuthResponse?.access_token,
        ).post<IApiResponse, IRegistrationPayload>(API.register, {
            password: data.password,
            username: data.username,
            role: "STAFF",
        });

        if (
            registrationResponse.message?.includes(
                "The username has already been taken.",
            )
        ) {
            setState((prev) => ({
                ...prev,
                isUsernameAlreadyExist: true,
            }));
            messageApi.error({
                type: "error",
                content: "The username has already been taken.",
                style: {
                    marginTop: "90vh",
                },
            });
            return;
        } else if (
            registrationResponse.message?.includes(
                "The password field must be at least 6 characters.",
            ) ||
            registrationResponse.message?.includes(
                "The password field format is invalid.",
            )
        ) {
            setState((prev) => ({
                ...prev,
                isPasswordNotMatched: true,
            }));
            messageApi.error({
                type: "error",
                content: "Password does not meet criteria.",
                style: {
                    marginTop: "90vh",
                },
            });
            return;
        } else if (
            registrationResponse?.message === "Authentication required."
        ) {
            setState((prev) => ({
                ...prev,
                isRegistrationModealOpen: false,
                isAuthModalOpen: true,
            }));

            return;
        }

        messageApi.success({
            type: "success",
            content: "Registration success!",
            style: {
                marginTop: "90vh",
            },
        });

        setState((prev) => ({
            ...prev,
            isPasswordNotMatched: false,
            isUsernameAlreadyExist: false,
            isRegistrationModealOpen: false,
        }));

        await getAllStaffs();
    };

    const handleEmployeeRegistration: SubmitHandler<IEmployeeRegistrationPayload> = async (data) =>  {
        const employeeRegistrationPayload = await HttpClient.setAuthToken(
            getAuthResponse?.access_token,
        ).post<IApiResponse, IEmployeeRegistrationPayload>(`${API.employeeEnrollment}/${data.id}`, data);
        if (
            employeeRegistrationPayload?.message === "Authentication required."
        ) {
            setState((prev) => ({
                ...prev,
                isRegistrationModealOpen: false,
                isAuthModalOpen: true,
            }));

            return;
        }

        messageApi.success({
            type: "success",
            content: "Registration success!",
            style: {
                marginTop: "90vh",
            },
        });

        setState((prev) => ({
            ...prev,
            isEmployeeRegistrationOpen: false,
        }));
    }

    const handleDismissStaffRegistration = () => {
        setState((prev) => ({
            ...prev,
            isRegistrationModealOpen: false,
        }));
    };

    const handleDismissEmployeeRegistration = () => {
        setState((prev) => ({
            ...prev,
            isEmployeeRegistrationOpen: false,
        }));
    };

    const getAllStaffs = async () => {
        setState((prev) => ({
            ...prev,
            isFetchingStaffs: true,
        }));

        const getAllStafsResponse = await HttpClient
            .setAuthToken(getAuthResponse?.access_token)
            .get<IUser[], { role: string }>(API.users, { role: "STAFF" });

        if(getAllStafsResponse.message === "Authentication required.") {
            setState((prev) => ({
                ...prev,
                isAuthModalOpen: true
            }));

            return;
        }

        if(!Array.isArray(getAllStafsResponse.data)) {
            return;
        }

        const mappedStaffs = getAllStafsResponse?.data.map((el) => ({
            key: el.id,
            username: el.username,
            role: el.role,
            verified_at: formatStandardDateTime(el.created_at)
        }));

        setState((prev) => ({
            ...prev,
            isFetchingStaffs: false,
            users: mappedStaffs as any,
        }));
    };

    useEffect(() => {
        document.title = "Account Management | SSS Archiving System";
        getAllStaffs();
        return () => {};
    }, []);

    return (
        <>
            {contextHolder}
            <NavigationBarAdmin />

            <div style={{ padding: "50px" }}>
                <Tabs
                    tabBarExtraContent={
                       <Flex gap={5}>
                        <Button
                            onClick={() => handleOpeRegistration("STAFF")}
                            shape="round">
                            Staff Registration
                        </Button>
                        <Button
                            onClick={() => handleOpeRegistration("EMPLOYEE")}
                            shape="round">
                            Employee Registration
                        </Button>
                        </Flex>
                    }
                    items={[
                        {
                            key: "1",
                            label: `Staffs`,
                            children: (
                                <Table
                                    columns={columns}
                                    dataSource={state.users as any}
                                    size="middle"
                                    loading={state.isFetchingStaffs}
                                    // pagination={state.pagination}
                                    // onChange={handleTableChange}
                                />
                            ),
                        },
                        {
                            key: "2",
                            label: `Employee`,
                            children: <>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis voluptate, tempora doloribus possimus placeat deleniti libero velit provident maxime maiores.
                            </>,
                        },
                    ]}
                />
            </div>

            <Modal
                title="Employee Registration"
                open={state.isEmployeeRegistrationOpen}
                cancelButtonProps={{
                    style: { display: "none" },
                }}
                okButtonProps={{
                    style: { display: "none" },
                }}
                width={600}
                onCancel={handleDismissEmployeeRegistration}
            >
                <form onSubmit={handleSubmitEmployeeFormData(handleEmployeeRegistration)}>
                    <RegistrationEmployeeFormFields
                        control={employeeController}
                        isRegistrationFailed={false}
                    />
             
             <Button
                        type="primary"
                        size="middle"
                        loading={isCreatingEmployee}
                        htmlType="submit"
                        shape="round"
                        style={{ marginTop: 20 }}
                        block
                    >
                        Submit
                    </Button>
                </form>
            </Modal>

            <Modal
                title="Staff Registration"
                open={state.isRegistrationModealOpen}
                cancelButtonProps={{
                    style: { display: "none" },
                }}
                okButtonProps={{
                    style: { display: "none" },
                }}
                width={400}
                onCancel={handleDismissStaffRegistration}
            >
                <form onSubmit={handleSubmitStaffFormData(handleRegistration)}>
                    <RegistrationFormFields
                        control={staffController}
                        isUsernameAlreadyExist={state.isUsernameAlreadyExist}
                        isPasswordNotMatched={state.isPasswordNotMatched}
                        isRegistrationFailed={false}
                    />
                    <Button
                        type="primary"
                        size="middle"
                        loading={isCreatingAccount}
                        style={{ marginTop: 20 }}
                        htmlType="submit"
                        shape="round"
                        block
                    >
                        Submit
                    </Button>
                </form>
            </Modal>

            <Modal
                title="Oops!"
                closable={false}
                open={state.isAuthModalOpen}
                width={400}
                cancelButtonProps={{
                    style: { display: "none" },
                }}
                onOk={handleOk}
            >
                <p>
                    Authentication session has expired. Kindly proceed to log in
                    again for continued access.
                </p>
            </Modal>
        </>
    );
}

export default AdminAccountManagement;

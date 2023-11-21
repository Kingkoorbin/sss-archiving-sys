import { useNavigate } from "react-router-dom";
import { Row, Checkbox, Card, message } from "antd";
import { SubmitHandler, useForm } from "react-hook-form";

// Custom imports
import HttpClient from "../../utils/http-client.util";
import {
    ILoginEncryptedPayload,
    ILoginPayload,
} from "../../interfaces/login.interface";
import { useEffect, useState } from "react";
import useLocalStorage from "../../hooks/useLocalstorage.hook";
import { IApiResponse, ISavedLogin } from "../../interfaces/api.interface";
import { messages } from "../../const/messages.const";
import { BtnNotYou, BtnSignIn } from "../../components/btn-signin.component";
import LoginFormFields from "../../components/form-signin.component";
import { API } from "../../const/api.const";
import { isEmpty } from "../../utils/util";

function Login() {
    const { setValue: setAuthResponse, removeValue: removeAuthResponse } =
        useLocalStorage<IApiResponse | null>("auth_response", null);

    const navigate = useNavigate();
    const [state, setState] = useState({
        isSavedLogin: true,
        isLoggingIn: false,
        isLoginFailed: false,
    });

    const { handleSubmit, control } = useForm<ILoginPayload>();
    const [messageApi, contextHolder] = message.useMessage();

    const handleLogin: SubmitHandler<ILoginPayload> = async (data) => {
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
        setState((prev) => ({
            ...prev,
            isLoginFailed: false,
            isLoggingIn: true,
        }));

        try {
            const loginResponse = await HttpClient.post<any, ILoginPayload>(
                API.login,
                {
                    password: data.password,
                    username: data.username,
                },
            );

            switch (loginResponse.code) {
                case "00":
                    {
                        setState((prev) => ({
                            ...prev,
                            isLoggingIn: false,
                            isLoginFailed: false,
                        }));
                        setAuthResponse({
                            code: loginResponse.data.code,
                            access_token: loginResponse.data.access_token,
                            role: loginResponse.data.role,
                            status: loginResponse.data.status
                        })
                    }
                    break;

                case "9001":
                    {
                        messageApi.error({
                            type: "error",
                            content: loginResponse.message,
                            style: { marginTop: "90vh" },
                        });
                        setState((prev) => ({
                            ...prev,
                            isLoggingIn: false,
                            isLoginFailed: true,
                        }));
                        removeAuthResponse();
                    }
                    break;

                default: {
                    messageApi.error({
                        type: "error",
                        content: loginResponse.message,
                        style: { marginTop: "90vh" },
                    });
                    setState((prev) => ({
                        ...prev,
                        isLoggingIn: false,
                    }));
                    removeAuthResponse();
                }
            }
        } catch (error: any) {
            removeAuthResponse();
            messageApi.error({
                type: "error",
                content: messages["500"].message,
                style: {
                    marginTop: "90vh",
                },
            });
        }
    };

    const handleSaveLogin = () => {
        setState((prev) => ({ ...prev, isSavedLogin: !state.isSavedLogin }));
    };

    const handleClearLocalStorage = () => {
        removeAuthResponse();
    };

    useEffect(() => {
        document.title = "Login | SSS Archiving System";
        removeAuthResponse(); // Remove existing token
    }, []);

    return (
        <>
            {contextHolder}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "98vh",
                }}
            >
                <Row justify="center">
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <Card title={"Authentication"} style={{ width: 280 }}>
                            <div>
                                <LoginFormFields
                                    control={control}
                                    isLoginFailed={state.isLoginFailed}
                                />
                                <Checkbox
                                    onChange={() => handleSaveLogin()}
                                    style={{ marginTop: 20 }}
                                    checked={state.isSavedLogin}
                                >
                                    Remember me
                                </Checkbox>
                                <BtnSignIn isLoading={state.isLoggingIn} />
                            </div>
                        </Card>
                    </form>
                </Row>
            </div>
        </>
    );
}

export default Login;

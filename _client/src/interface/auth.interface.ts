export interface ILoginResponse {
    status: string;
    message: string;
    data: {
        role: string;
        access_token: string;
    }
}

export type TRegistrationResponse = ILoginResponse;

export interface IRegistrationLocalStorage {
    email: string;
    mobileNumber: string;
    password: string;
    role: string;
}
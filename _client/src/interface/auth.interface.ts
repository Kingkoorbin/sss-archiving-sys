export interface ILoginResponse {
    status: string;
    message: string;
    data: {
        role: string;
        access_token: string;
    }
}

export interface IRegistrationResponse {
    status: string;
    message: string;
}

export interface IRegistrationLocalStorage {
    email: string;
    mobileNumber: string;
    password: string;
    role: string;
}
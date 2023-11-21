export interface IApiResponse<T = any> {
    status: any;
    code: any;
    role: any;
    access_token: any;
    [key: string]: T;
}

export interface ISavedLogin {
    owner: string;
    token: string;
}

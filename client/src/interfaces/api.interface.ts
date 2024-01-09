export interface IApiResponse<> {
  status: any;
  code: any;
  role: 'ADMIN' | 'STAFF';
  access_token: any;
}

export interface ISavedLogin {
  owner: string;
  token: string;
}

export interface IEmailPayload {
  email: string;
  status: string;
  body: string;
}

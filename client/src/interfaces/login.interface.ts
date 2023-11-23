export interface ILoginPayload {
  username: string;
  password: string;
}

export interface IRegistrationPayload {
  username: string;
  password: string;
  confirm?: string;
  role: 'STAFF' | 'USER';
}

export interface ILoginEncryptedPayload {
  content: string;
}

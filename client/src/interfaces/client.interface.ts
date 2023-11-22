export interface IProfile {
    user: string;
    firstName: string;
    lastName: string;
    birthdate: string;
    address: string;
    contactNumber: string;
    gender: string;
    refferedBy: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IRole {
    _id: string;
    user: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IUser {
    id: number;
    username: string;
    verified_at: string | null;
    role: string;
    created_at: string;
    updated_at: string;
}
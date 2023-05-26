export interface ISubscriptionPlan {
    dateStarted: string;
    gateway: string;
    amount: string;
    currency: string;
}

export interface Tenant {
    id: number;
    user_id: number;
    company_name: string;
    description: string;
    address: string;
    subscription_plan: ISubscriptionPlan;
    verified: boolean;
    created_at: string;
    updated_at: string;
}
export interface Client {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    present_address: string;
    permanent_address: string;
    birthdate: string;
    created_at: string;
    updated_at: string;
}

export interface GetAccountsApiResponse {
    status: string;
    message: string;
    data: Tenant[] | Client[];
}
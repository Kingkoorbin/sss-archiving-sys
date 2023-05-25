export interface ICreateClientResponse {
    status: string;
    message: string;
    data: {
        first_name: string;
        last_name: string;
        present_address: string;
        permanent_address: string;
        birthdate: string;
        user_id: number,
        updated_at: string;
        created_at: string;
        id: number
    }
}

export interface ICreateTenantResponse {
    status: string;
    message: string;
    data: {
        company_name: string;
        description: string;
        address: string;
        subscription_plan: string;
        verified: string;
        user_id: number,
        id: number
    }
}
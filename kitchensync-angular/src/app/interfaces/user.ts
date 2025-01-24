export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    user_type_id: number;
    family_id: number;
    family?: Family[];
    user_type?: UserType[];
}

export interface Family {
    id: number;
    name: string;
}

export interface UserType {
    id: number;
    type: string;
}
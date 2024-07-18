export interface User {
    id: number;
    first_name: string;
    last_name: string;
}

export interface WorkFromHomeData {
    user_id: number;
    actual_hours: number;
    user: User;
}

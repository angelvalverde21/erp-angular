import { User } from "./user.interface";

export interface Employee {
    id: number;
    user_id: number,
    user?: User;
    salary: number;
    comission: number;
    tag_sales: string;
    phone: string;
    created_at?: string;
    updated_at?: string;
}

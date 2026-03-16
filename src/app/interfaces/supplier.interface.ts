import { User } from "./user.interface";

export interface Supplier {
  id: number;
  user_id: number;
  user?: User;
  created_at?: string;
  updated_at?: string;
}
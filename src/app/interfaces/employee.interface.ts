export interface Employee {
  id: number;
  store_id: number;
  user_id: number;
  account?: { id: number; email: string; status: number | boolean };
  name: string;
  email: string;
  phone?: string | null;
  identity_id?: number | null;
  document_number?: string | null;
  biometric_code?: string | null;
  status: boolean;
  roles: string[];
  salary: number | string | null;
  comission: number | null;
  tag_sales?: string | null;
  type?: 'fulltime' | 'partime' | null;
  date_entry?: string | null;
  work_time_start?: string | null;
  work_time_end?: string | null;
  tolerance_minutes: number;
  allow_extra_hours: boolean;
  attendances?: any[];
  schedules?: any[];
  attendances_count?: number;
  schedules_count?: number;
  created_at?: string;
  updated_at?: string;
}

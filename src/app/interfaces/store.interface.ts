export interface Store {
  id: number;                 // bigint(20), PRIMARY KEY
  name: string;               // varchar(255), obligatorio
  phone?: number | null;      // bigint(20), opcional
  email: string;              // varchar(255), obligatorio
  slug: string;               // varchar(255), obligatorio
  identity_id?: number | null; // bigint(20), opcional
  document_number: string;    // varchar(20), obligatorio
  units?: any[] | null;        // json, opcional
  created_at?: string | null; // timestamp, opcional
  updated_at?: string | null; // timestamp, opcional
}
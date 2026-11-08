import { Branch } from './branch.interface';

export interface Warehouse {
  id: number;
  branch_id: number;
  name: string;
  subtitle?: string | null;
  code: string;
  readonly address: string | null;
  readonly address_id?: number | null;
  is_active: boolean;
  branch?: Branch;
  locations_count?: number;
}

export interface WarehousePayload {
  branch_id: number;
  name: string;
  subtitle?: string | null;
  code: string;
  is_active: boolean;
}

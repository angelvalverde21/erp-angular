export interface Branch {
  id: number;
  store_id: number;
  address_id: number | null;
  address?: BranchAddress | null;
  name: string;
  code: string;
  is_main: boolean;
  is_active: boolean;
  warehouses_count?: number;
}

export interface BranchPayload {
  address_id?: number | null;
  name: string;
  code: string;
  is_main: boolean;
  is_active: boolean;
}

export interface BranchAddress { id: number; name: string | null; primary: string; }

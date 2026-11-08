export type InventoryStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';
export type InventoryScope = 'branch' | 'warehouse' | 'location';
export interface InventoryOperator { id: number; name: string; }
export interface InventoryTarget { id: number; name: string; subtitle?: string | null; code?: string; branch?: { name: string; subtitle?: string | null }; warehouse?: { name: string; subtitle?: string | null }; }
export interface Inventory {
  id: number;
  store_id: number;
  created_user_id: number;
  name: string;
  comment: string | null;
  status: InventoryStatus;
  scope_type: InventoryScope | null;
  inventoriable_id: number | null;
  inventoriable?: InventoryTarget | null;
  creator?: InventoryOperator;
  sessions_count?: number;
  counted_quantity?: number | string | null;
  location_progress_count?: number;
  adjustments_count?: number;
  open_sessions_count?: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}
export interface InventoryPayload {
  name: string;
  comment: string | null;
  inventoriable_type: InventoryScope | null;
  inventoriable_id: number | null;
  status?: InventoryStatus;
}
export interface InventoryOptions {
  branches: InventoryTarget[];
  warehouses: InventoryTarget[];
  locations: InventoryTarget[];
  operators: InventoryOperator[];
  current_user_id: number;
}

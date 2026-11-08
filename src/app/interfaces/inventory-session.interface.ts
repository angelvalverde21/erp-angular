import { InventoryOperator } from './inventory.interface';
import { Warehouse } from './warehouse.interface';
export type InventorySessionStatus = 'open' | 'closed' | 'cancelled';
export interface InventorySession {
  id: number;
  inventory_id: number;
  warehouse_id: number;
  counted_quantity?: number | string | null;
  counts_count?: number;
  warehouse?: Warehouse;
  user_id: number;
  user?: InventoryOperator;
  comment: string | null;
  status: InventorySessionStatus;
  started_at: string;
  ended_at: string | null;
}
export interface InventorySessionPayload {
  warehouse_id: number;
  user_id: number;
  comment: string | null;
  status?: InventorySessionStatus;
}

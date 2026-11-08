import { InventoryOperator } from './inventory.interface';
import { Location } from './location.interface';

export interface InventoryWorkspaceLocation extends Location { warehouse?: { id: number; name: string; subtitle?: string | null; branch_id?: number; branch?: { id: number; name: string; store_id?: number } }; }
export interface InventoryWorkspaceOptions {
  locations: InventoryWorkspaceLocation[];
  location_tree?: InventoryWorkspaceLocation[];
  branches?: { id: number; name: string }[];
  warehouses?: { id: number; name: string; subtitle?: string | null; branch_id: number }[];
  current_user_id?: number;
  recording_locked?: boolean;
}
export interface InventoryVariant {
  id: number; sku: string | null; stock: number | null;
  price?: string | number | null;
  updated_at?: string | null;
  variant_option_values?: { id: number; option?: { name: string; label?: string | null }; option_value?: { value: string } }[];
  product?: { id: number; name: string; image?: { url_thumbnail?: string | null; url_medium?: string | null } | null };
}
export type LocationProgressStatus = 'pending' | 'in_progress' | 'counted' | 'verified';
export interface InventoryLocationProgress {
  id: number; inventory_id: number; location_id: number; verified_by: number | null;
  status: LocationProgressStatus; started_at: string | null; counted_at: string | null; verified_at: string | null;
  location?: InventoryWorkspaceLocation; verifier?: InventoryOperator | null;
}
export interface LocationProgressPayload { location_id: number; status?: LocationProgressStatus; }
export interface InventoryCount {
  id: number; inventory_session_id: number; location_id: number; variant_id: number; user_id: number;
  quantity: number; count_round: number; status: 'valid' | 'replaced' | 'cancelled'; counted_at: string;
  location?: InventoryWorkspaceLocation; variant?: InventoryVariant; user?: InventoryOperator;
}
export interface InventoryCountPayload { location_id: number; variant_id: number; quantity: number; mode: 'accumulate' | 'recount'; status?: 'valid' | 'cancelled'; }
export interface InventoryRackItem {
  variant_id: number;
  counted_quantity: number | string;
  capture_count: number | string;
  variant?: InventoryVariant | null;
}
export interface InventoryRackResponse {
  data: InventoryRackItem[];
  current_page: number;
  last_page: number;
  total: number;
  summary: { units: number; captures: number; variants: number };
}
export interface InventoryAdjustment {
  id: number; inventory_id: number; variant_id: number; system_quantity: number; counted_quantity: number; difference: number;
  status: 'pending' | 'approved' | 'applied' | 'rejected'; approved_by: number | null; approved_at: string | null; applied_at: string | null;
  comment: string | null; variant?: InventoryVariant; approver?: InventoryOperator | null;
}
export interface InventoryAdjustmentPayload { variant_id: number; comment: string | null; refresh?: boolean; }
export type InventoryAdjustmentAction = 'approve' | 'reject' | 'apply';

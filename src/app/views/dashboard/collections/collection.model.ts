export interface CollectionRecord {
  id: number; name: string; description: string | null; status: string;
  starts_on: string | null; ends_on: string | null; launch_on: string | null; processes_count?: number;
}
export interface CollectionOption { id: number; name: string; }
export interface CollectionInventoryReview {
  domain: string; location_name: string; percentage: number; token: string;
  items: { variant_id: number; sku: string; name: string; planned_units: number; export_units: number; current_units: number }[];
}
export interface CollectionManufactureVariant {
  id: number; variant_id: number; name: string; sku: string | null; quantity: number;
  shopify_variant_id?: string | null;
  process_id: number; source_id: number; source_name: string; source_type: 'order' | 'production';
}
export interface CollectionProcess {
  id: number; collection_id: number; collection_name: string; name: string; kind: string; source_type: string;
  source_id: number | null; owner_type: string; owner_id: number; status: string; progress: number | null;
  starts_on: string | null; due_on: string | null; notes: string | null; purchases_amount: number; paid: number;
  source_created_at?: string | null; created_at?: string | null;
  purchases: any[]; stages: any[]; products_count?: number;
  responsible_id?: number | null; responsible?: { id: number; name: string } | null;
}
export interface CollectionSummary {
  processes: number; completed: number; overdue: number; planned_units: number; received_units: number; attributed_units: number;
  purchases: number; paid: number; pending_payment: number; sales: number; collected: number;
  cash_balance: number; remaining_recovery: number; recovery_percent: number | null;
}
export interface CollectionWorkspace {
  collection: CollectionRecord; collections: CollectionOption[]; processes: CollectionProcess[]; products: any[];
  purchases: any[]; sales: any[]; summary: CollectionSummary;
  overview: { total_sales: number | null; orders_count: number | null; total_spent: number; remaining_recovery: number | null; recovery_percent: number | null; recovery_status: 'low' | 'progress' | 'recovered' | 'neutral'; sales_available?: boolean };
  timeline: { date: string; paid: number; collected: number }[];
}

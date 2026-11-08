export interface BarcodeVariant {
  id: number;
  product_id?: number;
  sku?: string | null;
  price?: string | number | null;
  stock?: number | null;
  updated_at?: string | null;
  kardexes?: BarcodeKardex[] | null;
  product?: {
    id: number;
    name: string;
    image?: {
      url_thumbnail?: string | null;
      url_medium?: string | null;
      url_large?: string | null;
    } | null;
  };
  variant_option_values?: {
    id: number;
    option?: { name: string; label?: string | null };
    option_value?: { value: string };
  }[];
}

export type BarcodeSearchResponse = BarcodeVariant | { data: BarcodeVariant | null } | null;

export type InventoryOperation = 'partial' | 'total' | 'manual';

export interface KardexMovement {
  variant_id: number;
  direction: 'in' | 'out';
  quantity: number;
  comment: string;
}

export interface BarcodeKardex extends KardexMovement {
  id: number;
  created_at?: string | null;
  variant?: Omit<BarcodeVariant, 'kardexes'> | null;
}

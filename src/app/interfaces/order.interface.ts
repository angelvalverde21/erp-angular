export type OrderStatus =
  | 'registrado'
  | 'pago_recibido'
  | 'pago_confirmado'
  | 'preparacion'
  | 'enviado'
  | 'cancelado'
  | 'en_espera';

export const ORDER_STATUS_OPTIONS: ReadonlyArray<{ value: OrderStatus; label: string }> = [
  { value: 'registrado', label: 'Registrado' },
  { value: 'pago_recibido', label: 'Pago recibido' },
  { value: 'pago_confirmado', label: 'Pago confirmado' },
  { value: 'preparacion', label: 'En preparación' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'en_espera', label: 'En espera' },
];

export interface OrderAddress {
  name?: string | null;
  phone?: string | null;
  document_number?: string | null;
  purpose?: string | null;
  primary?: string | null;
  district?: { name: string } | null;
}

export interface OrderListItem {
  id: number;
  created_at?: string | null;
  shopify_order_name?: string | null;
  status?: string | null;
  total?: number | string | null;
  addresses?: OrderAddress[];
  variants?: { id?: number; name?: string; quantity: number; price?: number | string }[];
  courier_address?: OrderAddress & {
    addressable?: {
      name?: string | null;
      delivery_type?: string | null;
    } | null;
  } | null;
}

export interface OrderPage {
  orders: OrderListItem[];
  total: number | null;
  hasMore: boolean;
}

export interface OrderIndexResponse {
  data: OrderListItem[];
  meta?: { total?: number; last_page?: number };
  total?: number;
  last_page?: number;
  links?: { next?: string | null };
  next_page_url?: string | null;
}

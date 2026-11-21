import { OrderProgressDates, OrderProgressStatus } from '../shopify/orders/shared/order-status-stepper/order-status.model';

export type PreparationStatus = 'ready' | 'preparing' | 'shipped' | 'review' | 'on_hold' | 'scheduled' | 'cancelled';
export type PreparationFilter = PreparationStatus | 'all';
export interface OrderProductImage {
  url: string; url_thumbnail: string; url_large: string; altText: string;
  fallback_images?: { url_thumbnail: string; url_large: string }[];
}
export interface OrderProduct {
  id: string; title: string; variant: string; sku: string; quantity: number;
  image: OrderProductImage | null; unitPrice: string; total: string;
}
export interface WorkspaceOrder {
  id: number; number: string; createdAt: string | null; customer: string; destination: string | null;
  preparation: PreparationStatus; partiallyShipped: boolean; payment: string; paid: boolean; total: string;
  units: number; productCount: number; products: OrderProduct[]; comments: number;
}
export interface WorkspacePage {
  orders: WorkspaceOrder[]; runId: string | null;
  counts: Record<'total' | 'ready' | 'preparing' | 'shipped', number>;
  page: number; lastPage: number; total: number;
}
export interface WorkspaceOrderDetail {
  order: WorkspaceOrder; progress: OrderProgressStatus; dates: OrderProgressDates; onHold: boolean;
  email: string | null; phone: string | null; address: string; note: string;
  totals: { label: string; amount: string }[];
  payments: { id: string; label: string; status: string; date: string | null; amount: string }[];
  shipments: { id: string; name: string; status: string; date: string | null; tracking: string[] }[];
  eventCounts: { all: number; comments: number; system: number };
  historyUnavailable: boolean; shopifyUrl: string;
}

export const PREPARATION_STATES: Record<PreparationStatus, { label: string; icon: string; tone: string }> = {
  ready: { label: 'Por empacar', icon: 'fa-box-open', tone: 'success' },
  preparing: { label: 'En preparación', icon: 'fa-box', tone: 'primary' },
  shipped: { label: 'Enviado', icon: 'fa-circle-check', tone: 'neutral' },
  review: { label: 'Por revisar', icon: 'fa-circle-exclamation', tone: 'warning' },
  on_hold: { label: 'En espera', icon: 'fa-pause', tone: 'warning' },
  scheduled: { label: 'Programado', icon: 'fa-calendar', tone: 'neutral' },
  cancelled: { label: 'Cancelado', icon: 'fa-ban', tone: 'danger' },
};
export const PREPARATION_FILTERS = [
  { key: 'all', count: 'total', label: 'Pedidos', icon: 'fa-bag-shopping' },
  { key: 'ready', count: 'ready', label: 'Por alistar', icon: 'fa-box-open' },
  { key: 'preparing', count: 'preparing', label: 'Por enviar', icon: 'fa-truck-fast' },
] as const;

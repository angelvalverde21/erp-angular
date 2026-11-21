export interface ImportedMoney { amount: string; currencyCode: string; }
export interface MoneySet { shopMoney: ImportedMoney; }
export interface ImportedRun { id: string; created_at: string; status: string; }
export interface ImportedOrderUpdate {
  id: number; run_id: string; status: 'queued' | 'scanning' | 'importing' | 'completed' | 'failed';
  checked_orders: number; added_orders: number; completed_tasks: number; total_tasks: number;
  search_from: string; search_until: string; created_at: string; completed_at: string | null;
  error_message: string | null; can_resume: boolean;
}
export interface PageInfo { page: number; last_page: number; total: number; }
export interface ImportedOrder {
  id: number; run_id: string; shopify_id: string; name: string; created_at: string | null;
  customer: string; email: string | null; financial_status: string | null; fulfillment_status: string | null;
  cancelled_at: string | null; total: ImportedMoney | null; timeline_status: string; comment_count: number; events_count: number;
  packing_state?: string; destination?: string | null; item_count?: number; units_count?: number; packing_items?: ImportedItem[];
}
export interface ImportedOrderList {
  run: ImportedRun | null; runs: ImportedRun[]; items: ImportedOrder[]; pagination: PageInfo;
  summary: { total: number; unavailable: number; with_comments: number; unchecked: number };
  order_update?: ImportedOrderUpdate | null;
  packing_summary?: { total: number; ready: number; preparing: number; shipped: number; [key: string]: number };
}
export interface ImportedAddress {
  name?: string; company?: string; address1?: string; address2?: string; city?: string; province?: string; country?: string; zip?: string; phone?: string;
}
export interface ImportedOrderPayload {
  note?: string; email?: string; phone?: string; tags?: string[]; sourceName?: string; processedAt?: string; updatedAt?: string;
  shippingAddress?: ImportedAddress; billingAddress?: ImportedAddress;
  totalPriceSet?: MoneySet; currentSubtotalPriceSet?: MoneySet; currentTotalTaxSet?: MoneySet; totalShippingPriceSet?: MoneySet;
  totalDiscountsSet?: MoneySet; totalRefundedSet?: MoneySet; totalOutstandingSet?: MoneySet;
  customAttributes?: { key: string; value: string }[];
}
export interface ImportedItemImage {
  url: string; altText: string; url_thumbnail: string; url_large: string;
  fallback_urls?: string[]; fallback_images?: { url_thumbnail: string; url_large: string }[];
}
export interface ImportedItem {
  id: string; name?: string; title?: string; variantTitle?: string; sku?: string; quantity: number; currentQuantity?: number;
  originalUnitPriceSet?: MoneySet; discountedUnitPriceSet?: MoneySet; discountedTotalSet?: MoneySet; originalTotalSet?: MoneySet;
  display_image?: ImportedItemImage | null;
}
export interface ImportedTransaction { id: string; kind: string; status: string; gateway?: string; formattedGateway?: string; createdAt?: string; processedAt?: string; amountSet?: MoneySet; }
export interface ImportedFulfillment { id: string; name?: string; status: string; displayStatus?: string; createdAt?: string; trackingInfo?: { company?: string; number?: string; url?: string }[]; }
export interface ImportedRefund { id: string; createdAt?: string; note?: string; totalRefundedSet?: MoneySet; }
export interface ImportedOrderDetail {
  order: ImportedOrder & { payload: ImportedOrderPayload }; run: ImportedRun; items: ImportedItem[]; shopify_url: string;
  related: { transactions: ImportedTransaction[]; fulfillments: ImportedFulfillment[]; refunds: ImportedRefund[]; [key: string]: unknown[] };
  event_counts: { all: number; comments: number; system: number };
  step_events?: { action?: string; createdAt?: string }[];
}
export interface ImportedAttachment { id: number; name: string; status: string; is_image: boolean; bytes: number | null; remote_url: string | null; }
export interface ImportedEvent { id: number; shopify_id: string; kind: string; created_at: string | null; message: string; edited: boolean; critical: boolean; attachments: ImportedAttachment[]; payload: unknown; }
export interface ImportedEventPage { items: ImportedEvent[]; pagination: PageInfo; }

const statusLabels: Record<string, string> = {
  PAID: 'Pagado', PENDING: 'Pendiente', PARTIALLY_PAID: 'Pago parcial', REFUNDED: 'Reembolsado', PARTIALLY_REFUNDED: 'Reembolso parcial',
  AUTHORIZED: 'Autorizado', VOIDED: 'Anulado', EXPIRED: 'Vencido', UNFULFILLED: 'Sin preparar', FULFILLED: 'Enviado', PARTIALLY_FULFILLED: 'Envío parcial',
  IN_PROGRESS: 'En preparación', ON_HOLD: 'En espera', SCHEDULED: 'Programado', SUCCESS: 'Correcto', FAILURE: 'Fallido', ERROR: 'Error',
  SALE: 'Venta', CAPTURE: 'Cobro', REFUND: 'Reembolso', AUTHORIZATION: 'Autorización', VOID: 'Anulación', DELIVERED: 'Entregado',
};
export const importedOrderView = {
  money(value: ImportedMoney | null | undefined): string {
    if (!value || !Number.isFinite(Number(value.amount))) return '—';
    try { return new Intl.NumberFormat('es-PE', { style: 'currency', currency: value.currencyCode }).format(Number(value.amount)); }
    catch { return `${value.currencyCode} ${value.amount}`; }
  },
  date(value: string | null | undefined, time = false): string {
    if (!value || Number.isNaN(Date.parse(value))) return '—';
    return new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: 'short', year: 'numeric', ...(time ? { hour: '2-digit', minute: '2-digit' } as const : {}) }).format(new Date(value));
  },
  status(value: string | null | undefined): string { return value ? statusLabels[value] ?? value.replaceAll('_', ' ').toLowerCase() : 'Sin información'; },
  timeline(order: ImportedOrder): string {
    if (order.timeline_status === 'unavailable_comments') return 'Comentarios no recuperados';
    if (order.timeline_status !== 'available') return 'Sin revisar';
    return order.comment_count ? `${order.comment_count} comentario${order.comment_count === 1 ? '' : 's'}` : 'Sin comentarios registrados';
  },
};

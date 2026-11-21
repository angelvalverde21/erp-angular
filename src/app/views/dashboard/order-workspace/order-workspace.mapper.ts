import { ImportedItem, ImportedOrder, ImportedOrderDetail, ImportedOrderList, importedOrderView as view } from '../initial-import/orders/imported-order.model';
import { orderProgress, orderProgressDates } from '../shopify/orders/shared/order-status-stepper/order-status.model';
import { OrderProduct, PreparationStatus, WorkspaceOrder, WorkspaceOrderDetail, WorkspacePage } from './order-workspace.model';

/** The screen's model stays independent of staging table names and API payloads. */
export function preparationStatus(order: ImportedOrder): PreparationStatus {
  if (order.cancelled_at) return 'cancelled';
  switch (order.fulfillment_status) {
    case 'FULFILLED': return 'shipped';
    case 'PARTIALLY_FULFILLED': case 'IN_PROGRESS': return 'preparing';
    case 'ON_HOLD': return 'on_hold';
    case 'SCHEDULED': return 'scheduled';
    case 'UNFULFILLED': return order.financial_status === 'PAID' ? 'ready' : 'review';
    default: return 'review';
  }
}
export function toOrderProduct(item: ImportedItem): OrderProduct {
  return { id: item.id, title: item.title || item.name || 'Artículo sin nombre',
    variant: item.variantTitle === 'Default Title' ? '' : item.variantTitle || '', sku: item.sku || '',
    quantity: item.currentQuantity ?? item.quantity, image: item.display_image ?? null,
    unitPrice: view.money(item.discountedUnitPriceSet?.shopMoney || item.originalUnitPriceSet?.shopMoney),
    total: view.money(item.discountedTotalSet?.shopMoney || item.originalTotalSet?.shopMoney) };
}
export function toWorkspaceOrder(order: ImportedOrder): WorkspaceOrder {
  return { id: order.id, number: order.name, createdAt: order.created_at, customer: order.customer,
    destination: order.destination ?? null, preparation: preparationStatus(order), partiallyShipped: order.fulfillment_status === 'PARTIALLY_FULFILLED', payment: view.status(order.financial_status),
    paid: order.financial_status === 'PAID', total: view.money(order.total), units: order.units_count ?? 0,
    productCount: order.item_count ?? 0, products: (order.packing_items ?? []).map(toOrderProduct), comments: order.comment_count };
}
export function toWorkspacePage(data: ImportedOrderList): WorkspacePage {
  return { orders: data.items.map(toWorkspaceOrder), runId: data.run?.id ?? null,
    counts: data.packing_summary ?? { total: data.summary.total, ready: 0, preparing: 0, shipped: 0 },
    page: data.pagination.page, lastPage: data.pagination.last_page, total: data.pagination.total };
}
export function toWorkspaceDetail(data: ImportedOrderDetail): WorkspaceOrderDetail {
  const { order, items, related } = data;
  const payload = order.payload;
  const shipping = payload.shippingAddress;
  const products = items.filter(item => (item.currentQuantity ?? item.quantity) > 0).map(toOrderProduct);
  return {
    order: { ...toWorkspaceOrder(order), products, productCount: products.length, units: products.reduce((sum, item) => sum + item.quantity, 0) },
    progress: orderProgress({ displayFinancialStatus: order.financial_status ?? undefined, displayFulfillmentStatus: order.fulfillment_status ?? undefined }),
    dates: orderProgressDates({ createdAt: order.created_at, displayFinancialStatus: order.financial_status, transactions: related.transactions, fulfillments: related.fulfillments, events: data.step_events }),
    onHold: order.fulfillment_status === 'ON_HOLD', email: order.email, phone: payload.phone || shipping?.phone || null,
    address: shipping ? [shipping.name, shipping.address1, shipping.address2, [shipping.city, shipping.province].filter(Boolean).join(', '), shipping.country].filter(Boolean).join('\n') : '',
    note: payload.note || '',
    totals: [
      { label: 'Subtotal', amount: view.money(payload.currentSubtotalPriceSet?.shopMoney) },
      { label: 'Descuentos', amount: view.money(payload.totalDiscountsSet?.shopMoney) },
      { label: 'Envío', amount: view.money(payload.totalShippingPriceSet?.shopMoney) },
      { label: 'Impuestos', amount: view.money(payload.currentTotalTaxSet?.shopMoney) },
    ],
    payments: related.transactions.map(payment => ({ id: payment.id, label: payment.formattedGateway || payment.gateway || 'Pago',
      status: view.status(payment.status), date: payment.processedAt || payment.createdAt || null, amount: view.money(payment.amountSet?.shopMoney) })),
    shipments: related.fulfillments.map(shipment => ({ id: shipment.id, name: shipment.name || 'Envío', status: view.status(shipment.displayStatus || shipment.status),
      date: shipment.createdAt || null, tracking: (shipment.trackingInfo ?? []).map(tracking => [tracking.company, tracking.number].filter(Boolean).join(' · ')) })),
    eventCounts: data.event_counts, historyUnavailable: order.timeline_status === 'unavailable_comments', shopifyUrl: data.shopify_url,
  };
}

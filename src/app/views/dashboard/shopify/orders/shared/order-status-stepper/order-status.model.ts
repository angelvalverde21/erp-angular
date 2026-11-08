export type OrderProgressStatus = 'registrado' | 'pago_recibido' | 'pago_confirmado' | 'preparacion' | 'enviado' | 'desconocido';

export interface PaymentState {
  label: string;
  description: string;
  tone: 'neutral' | 'warning' | 'success' | 'danger';
  step: number;
}

export function paymentState(status: string | null | undefined): PaymentState {
  switch (status) {
    case 'PENDING':
      return { label: 'Esperando pago', description: 'El pago aún no ha sido confirmado.', tone: 'warning', step: 0 };
    case 'AUTHORIZED':
      return { label: 'Pago autorizado', description: 'El importe está autorizado, pendiente de captura.', tone: 'warning', step: 0 };
    case 'PARTIALLY_PAID':
      return { label: 'Pago parcial', description: 'Se recibió un abono. Queda un saldo pendiente.', tone: 'warning', step: 0 };
    case 'PAID':
      return { label: 'Pago confirmado', description: 'El importe del pedido está pagado por completo.', tone: 'success', step: 1 };
    case 'PARTIALLY_REFUNDED':
      return { label: 'Reembolso parcial', description: 'Se devolvió parte del importe. Revisa el saldo del pedido.', tone: 'warning', step: -1 };
    case 'REFUNDED':
      return { label: 'Reembolsado', description: 'Se devolvió el importe del pedido.', tone: 'neutral', step: -1 };
    case 'VOIDED':
      return { label: 'Pago anulado', description: 'La autorización del pago fue anulada.', tone: 'danger', step: -1 };
    case 'EXPIRED':
      return { label: 'Pago vencido', description: 'El plazo o la autorización para pagar ha vencido.', tone: 'danger', step: -1 };
    default:
      return { label: 'Sin información de pago', description: 'No hay un estado de pago disponible.', tone: 'neutral', step: -1 };
  }
}

interface OrderProgressSource {
  displayFulfillmentStatus?: string;
  displayFinancialStatus?: string;
  fulfillments?: { displayStatus?: string }[];
}

export function orderProgress(order: OrderProgressSource | null | undefined): OrderProgressStatus {
  const fulfillments = order?.fulfillments;
  if (order?.displayFulfillmentStatus === 'FULFILLED' && Array.isArray(fulfillments) && fulfillments.length > 0) {
    const shipped = ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'ATTEMPTED_DELIVERY'];
    if (fulfillments.every(item => shipped.includes(item.displayStatus ?? ''))) return 'enviado';
  }
  switch (order?.displayFulfillmentStatus) {
    case 'FULFILLED':
    case 'IN_PROGRESS':
    case 'PARTIALLY_FULFILLED': return 'preparacion';
  }
  switch (order?.displayFinancialStatus) {
    case 'PAID': return 'pago_confirmado';
    case 'PARTIALLY_PAID': return 'pago_recibido';
    case 'PENDING':
    case 'AUTHORIZED': return 'registrado';
    case undefined:
      return ['UNFULFILLED', 'SCHEDULED'].includes(order?.displayFulfillmentStatus ?? '')
        ? 'registrado' : 'desconocido';
    default: return 'desconocido';
  }
}

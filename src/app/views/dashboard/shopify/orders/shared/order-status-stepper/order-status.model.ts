export type OrderProgressStatus = 'registrado' | 'pago_recibido' | 'pago_confirmado' | 'preparacion' | 'enviado' | 'desconocido';
export type OrderProgressDates = Partial<Record<Exclude<OrderProgressStatus, 'desconocido'>, string>>;
export interface OrderProgressEvent { action?: string; createdAt?: string; }

interface OrderProgressDateSource {
  createdAt?: string | null;
  created_at?: string | null;
  displayFinancialStatus?: string | null;
  transactions?: { kind?: string; status?: string; processedAt?: string | null; createdAt?: string | null }[];
  fulfillments?: { status?: string; displayStatus?: string; createdAt?: string | null }[];
  events?: OrderProgressEvent[] | { nodes?: OrderProgressEvent[]; edges?: { node: OrderProgressEvent }[] };
}

/** Only recorded timestamps are used; later states never fabricate earlier dates. */
export function orderProgressDates(order: OrderProgressDateSource | null | undefined): OrderProgressDates {
  if (!order) return {};
  const dates: OrderProgressDates = {};
  const ordered = (values: (string | null | undefined)[]) => values
    .filter((value): value is string => !!value && !Number.isNaN(Date.parse(value)))
    .sort((a, b) => Date.parse(a) - Date.parse(b));
  const events = Array.isArray(order.events)
    ? order.events
    : order.events?.nodes ?? order.events?.edges?.map(edge => edge.node) ?? [];
  const eventDates = (actions: string[]) => ordered(events
    .filter(event => actions.includes(event.action ?? ''))
    .map(event => event.createdAt));
  const created = ordered([order.createdAt ?? order.created_at])[0];
  if (created) dates.registrado = created;

  const payments = ordered((order.transactions ?? [])
    .filter(payment => payment.status === 'SUCCESS' && ['SALE', 'CAPTURE'].includes(payment.kind ?? ''))
    .map(payment => payment.processedAt || payment.createdAt));
  const confirmedPayments = eventDates(['sale_success', 'capture_success']);
  const received = payments[0] ?? confirmedPayments[0];
  if (received) dates.pago_recibido = received;
  if (order.displayFinancialStatus === 'PAID') {
    const confirmed = confirmedPayments.at(-1) ?? payments.at(-1);
    if (confirmed) dates.pago_confirmado = confirmed;
  }
  const preparation = eventDates(['fulfillment_pending'])[0];
  if (preparation) dates.preparacion = preparation;
  const shipments = ordered((order.fulfillments ?? [])
    .filter(shipment => shipment.status === 'SUCCESS')
    .map(shipment => shipment.createdAt));
  const sent = shipments.at(-1) ?? eventDates(['fulfillment_success']).at(-1);
  if (sent) dates.enviado = sent;
  return dates;
}

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
  switch (order?.displayFulfillmentStatus) {
    // The order's fulfillment state is authoritative; carrier tracking is optional.
    case 'FULFILLED': return 'enviado';
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

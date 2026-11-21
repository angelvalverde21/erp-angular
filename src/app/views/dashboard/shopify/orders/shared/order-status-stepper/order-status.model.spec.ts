import { orderProgress, orderProgressDates, paymentState } from './order-status.model';

describe('Order status rules', () => {
  it('only confirms fully paid orders', () => {
    expect(paymentState('PAID').step).toBe(1);
    for (const status of ['PENDING', 'AUTHORIZED', 'PARTIALLY_PAID']) {
      expect(paymentState(status).step).toBe(0);
    }
  });
  it('keeps refunds and exceptions outside the normal payment flow', () => {
    for (const status of ['REFUNDED', 'PARTIALLY_REFUNDED', 'EXPIRED', 'VOIDED']) {
      expect(paymentState(status).step).toBe(-1);
    }
    expect(paymentState('EXPIRED').label).toBe('Pago vencido');
  });
  it('does not assume payment or preparation when data is missing', () => {
    expect(paymentState(undefined).step).toBe(-1);
    expect(paymentState('UNKNOWN').step).toBe(-1);
    expect(orderProgress(undefined)).toBe('desconocido');
  });
  it('keeps partial preparations in progress', () => {
    expect(orderProgress({ displayFulfillmentStatus: 'PARTIALLY_FULFILLED' })).toBe('preparacion');
  });
  it('uses the fulfilled order status even when carrier tracking is absent', () => {
    expect(orderProgress({ displayFulfillmentStatus: 'FULFILLED' })).toBe('enviado');
    expect(orderProgress({ displayFulfillmentStatus: 'FULFILLED', fulfillments: [] })).toBe('enviado');
    expect(orderProgress({ displayFulfillmentStatus: 'FULFILLED', fulfillments: [{ displayStatus: 'FULFILLED' }] })).toBe('enviado');
  });
  it('does not let optional carrier statuses override a fulfilled order', () => {
    expect(orderProgress({ displayFulfillmentStatus: 'FULFILLED', fulfillments: [
      { displayStatus: 'IN_TRANSIT' }, { displayStatus: 'CONFIRMED' },
    ] })).toBe('enviado');
    expect(orderProgress({ displayFulfillmentStatus: 'FULFILLED', fulfillments: [
      { displayStatus: 'IN_TRANSIT' }, { displayStatus: 'DELIVERED' },
    ] })).toBe('enviado');
  });
  it('keeps partial and in-progress orders in preparation despite dispatched individual shipments', () => {
    for (const status of ['PARTIALLY_FULFILLED', 'IN_PROGRESS']) {
      expect(orderProgress({ displayFulfillmentStatus: status, fulfillments: [{ displayStatus: 'IN_TRANSIT' }] })).toBe('preparacion');
    }
  });
  it('keeps delivered shipments in the final sent stage', () => {
    expect(orderProgress({ displayFulfillmentStatus: 'FULFILLED', fulfillments: [
      { displayStatus: 'DELIVERED' }, { displayStatus: 'DELIVERED' },
    ] })).toBe('enviado');
  });
  it('distinguishes received payments from confirmed payments', () => {
    expect(orderProgress({ displayFinancialStatus: 'PARTIALLY_PAID' })).toBe('pago_recibido');
    expect(orderProgress({ displayFinancialStatus: 'PAID' })).toBe('pago_confirmado');
  });
  it('does not treat pending or authorized payments as received', () => {
    expect(orderProgress({ displayFinancialStatus: 'PENDING' })).toBe('registrado');
    expect(orderProgress({ displayFinancialStatus: 'AUTHORIZED' })).toBe('registrado');
  });
  it('uses recorded payment and fulfillment dates, excluding failed payments and cancelled shipments', () => {
    const dates = orderProgressDates({ createdAt: '2026-11-14T10:00:00Z', displayFinancialStatus: 'PAID',
      transactions: [
        { kind: 'AUTHORIZATION', status: 'SUCCESS', processedAt: '2026-11-14T09:00:00Z' },
        { kind: 'SALE', status: 'SUCCESS', processedAt: '2026-11-14T10:15:00Z' },
        { kind: 'CAPTURE', status: 'SUCCESS', processedAt: '2026-11-14T11:00:00Z' },
        { kind: 'CAPTURE', status: 'FAILURE', processedAt: '2026-11-14T12:00:00Z' },
      ], events: [{ action: 'capture_success', createdAt: '2026-11-14T11:01:00Z' }, { action: 'fulfillment_pending', createdAt: '2026-11-14T10:30:00Z' }],
      fulfillments: [{ status: 'SUCCESS', createdAt: '2026-11-14T12:30:00Z' }, { status: 'CANCELLED', createdAt: '2026-11-14T13:00:00Z' }],
    });
    expect(dates).toEqual({ registrado: '2026-11-14T10:00:00Z', pago_recibido: '2026-11-14T10:15:00Z', pago_confirmado: '2026-11-14T11:01:00Z', preparacion: '2026-11-14T10:30:00Z', enviado: '2026-11-14T12:30:00Z' });
  });
  it('does not fabricate dates or confuse an order confirmation with a confirmed payment', () => {
    expect(orderProgressDates(undefined)).toEqual({});
    const dates = orderProgressDates({ createdAt: 'invalid', displayFinancialStatus: 'PARTIALLY_PAID', transactions: [{ kind: 'SALE', status: 'SUCCESS', createdAt: '2026-11-14T10:00:00Z' }], events: { edges: [{ node: { action: 'confirmed', createdAt: '2026-11-14T10:00:00Z' } }] } });
    expect(dates).toEqual({ pago_recibido: '2026-11-14T10:00:00Z' });
    expect(orderProgressDates({ events: [{ action: 'fulfillment_success', createdAt: '2026-11-14T12:00:00Z' }] }).enviado).toBe('2026-11-14T12:00:00Z');
  });
});

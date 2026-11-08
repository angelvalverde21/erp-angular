import { orderProgress, paymentState } from './order-status.model';

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
  it('does not infer dispatch from preparation or empty shipments', () => {
    expect(orderProgress({ displayFulfillmentStatus: 'FULFILLED' })).toBe('preparacion');
    expect(orderProgress({ displayFulfillmentStatus: 'FULFILLED', fulfillments: [] })).toBe('preparacion');
  });
  it('requires every shipment to be dispatched', () => {
    expect(orderProgress({ displayFulfillmentStatus: 'FULFILLED', fulfillments: [
      { displayStatus: 'IN_TRANSIT' }, { displayStatus: 'CONFIRMED' },
    ] })).toBe('preparacion');
    expect(orderProgress({ displayFulfillmentStatus: 'FULFILLED', fulfillments: [
      { displayStatus: 'IN_TRANSIT' }, { displayStatus: 'DELIVERED' },
    ] })).toBe('enviado');
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
});

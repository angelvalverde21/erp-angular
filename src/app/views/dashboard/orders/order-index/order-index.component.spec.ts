import { OrderIndexComponent } from './order-index.component';
import { TestBed } from '@angular/core/testing';
import { BaseService } from 'src/app/views/base.service';

describe('OrderIndexComponent', () => {
  let component: OrderIndexComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: BaseService, useValue: { store: 'demo' } }] });
    component = TestBed.runInInjectionContext(() => new OrderIndexComponent());
  });

  it('uses the shipping address rather than a billing address', () => {
    expect(component.address({ addresses: [
      { purpose: 'billing', name: 'Billing' }, { purpose: 'shipping', name: 'Angel' },
    ] }).name).toBe('Angel');
  });

  it('sums the quantities of the native order variants', () => {
    expect(component.units({ variants: [{ quantity: 2 }, { quantity: 3 }] })).toBe(5);
    expect(component.units({})).toBe(0);
  });

  it('derives the delivery method from the address owner', () => {
    expect(component.deliveryLabel({ delivery_type: 'express' })).toBe('Recojo en tienda');
    expect(component.deliveryLabel({ courier_address: { addressable: { delivery_type: 'agency' } } })).toBe('Envío por agencia');
    expect(component.deliveryLabel({ courier_address: { addressable: { delivery_type: 'express' } } })).toBe('Envío express');
  });
});

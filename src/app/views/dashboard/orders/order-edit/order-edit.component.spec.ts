import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { OrderService } from '../order.service';
import { OrderEditComponent } from './order-edit.component';

describe('OrderEditComponent', () => {
  let component: OrderEditComponent;
  let update: jasmine.Spy;
  let response: Subject<any>;

  beforeEach(() => {
    response = new Subject();
    update = jasmine.createSpy('update').and.returnValue(response);
    TestBed.configureTestingModule({
      imports: [OrderEditComponent],
      providers: [{ provide: OrderService, useValue: { update } }, { provide: NgbModal, useValue: {} }],
    }).overrideComponent(OrderEditComponent, { set: { template: '', imports: [] } });
    component = TestBed.createComponent(OrderEditComponent).componentInstance;
    component.order_id = '42';
    component.order = {
      status: 'registrado',
      addresses: [{ purpose: 'billing', name: 'Facturación' },
        { purpose: 'shipping', name: 'Angel', identity_id: 1, document_number: '42412498', phone: '943402809',
          primary: 'Callao', secondary: '', references: '', district_id: 70101 }],
      courier_address_id: 20, delivery_cost: '15.00', is_cod: false, freight_collect: true, igv: '0.00',
      variants: [{ id: 2490, sku: '127126', name: 'Falda', quantity: 2, price: '90.00',
        variant_option_values: [{ option_value: { value: '26' } }] }],
    };
    component.ngOnChanges();
  });

  it('loads saved values and calculates totals without marking changes', () => {
    expect(component.form.valid).toBeTrue();
    expect(component.form.pristine).toBeTrue();
    expect(component.form.controls.name.value).toBe('Angel');
    expect(component.form.controls.district_id.value).toBe(70101);
    expect(component.form.controls.courier_address_id.value).toBe(20);
    expect(component.total).toBe(195);
    expect(component.units).toBe(2);
    expect(component.optionLabel(component.variants.at(0))).toBe('26');
  });

  it('sends grouped changes and blocks another save until completion', () => {
    component.form.controls.name.setValue('Nuevo nombre');
    component.form.markAsDirty();
    component.save();
    component.save();
    expect(update).toHaveBeenCalledTimes(1);
    const [id, payload] = update.calls.mostRecent().args;
    expect(id).toBe(42);
    expect(Object.keys(payload).sort()).toEqual(['address', 'shipping', 'variants']);
    expect(payload.address.name).toBe('Nuevo nombre');
    expect(payload.shipping).toEqual({ courier_address_id: 20, delivery_cost: 15, is_cod: false, freight_collect: true });
    expect(payload.variants).toEqual(component.order.variants);
    expect(component.saving).toBeTrue();
    expect(component.form.disabled).toBeTrue();
    response.next({ data: { id: 42 } });
    response.complete();
    expect(component.saving).toBeFalse();
    expect(component.form.enabled).toBeTrue();
    expect(component.form.pristine).toBeTrue();
    expect(component.saved).toBeTrue();
  });

  it('preserves changes after a failed update', () => {
    component.form.controls.name.setValue('Nuevo nombre');
    component.form.markAsDirty();
    component.save();
    response.error(new Error('Error de red'));
    expect(component.error).toBeTruthy();
    expect(component.form.controls.name.value).toBe('Nuevo nombre');
    expect(component.form.dirty).toBeTrue();
    expect(component.form.enabled).toBeTrue();
    expect(component.saving).toBeFalse();
  });

  it('rejects fractional quantities and orders without products', () => {
    component.variants.at(0).get('quantity')!.setValue(1.5);
    component.save();
    expect(update).not.toHaveBeenCalled();
    component.removeVariant(0);
    component.save();
    expect(update).not.toHaveBeenCalled();
    expect(component.form.invalid).toBeTrue();
  });

  it('handles unknown progress states without asserting payment or shipment', () => {
    component.order.status = 'otro_estado';
    expect(component.progress).toBe('desconocido');
  });

  it('includes the recorded tax and shipping when product amounts change', () => {
    component.order.igv = '10.00';
    component.variants.at(0).get('quantity')!.setValue(3);
    expect(component.total).toBe(295);
  });

  it('does not substitute a billing address when no shipping address exists', () => {
    component.order.addresses = [{ purpose: 'billing', name: 'Facturación' }];
    component.ngOnChanges();
    expect(component.address).toBeNull();
    expect(component.form.controls.name.value).toBeNull();
  });

  it('identifies pickup when the address owner has no delivery type', () => {
    component.order.delivery_type = 'agency';
    component.order.courier_address = { addressable: { delivery_type: null } };
    expect(component.isPickup).toBeTrue();
    expect(component.deliveryLabel).toBe('Recojo en tienda');
    component.order.courier_address.addressable = {};
    expect(component.isPickup).toBeTrue();
    component.order.courier_address = {};
    expect(component.isPickup).toBeTrue();
  });

  it('uses the address owner delivery type for agency and express shipments', () => {
    component.order.delivery_type = null;
    component.order.courier_address = { addressable: { delivery_type: 'agency' } };
    expect(component.isPickup).toBeFalse();
    expect(component.deliveryLabel).toBe('Envío por agencia');
    component.order.courier_address.addressable.delivery_type = 'express';
    expect(component.isPickup).toBeFalse();
    expect(component.deliveryLabel).toBe('Envío express');
  });

  it('only shows product changes after editing products', () => {
    expect(component.hasProductChanges).toBeFalse();
    component.form.controls.name.markAsDirty();
    expect(component.hasProductChanges).toBeFalse();
    component.variants.at(0).get('quantity')!.setValue(3);
    component.variants.at(0).get('quantity')!.markAsDirty();
    expect(component.hasProductChanges).toBeTrue();
    component.save();
    response.next({ data: { id: 42 } });
    response.complete();
    expect(component.hasProductChanges).toBeFalse();
  });

  it('detects added and removed products without flagging duplicate selections', () => {
    component.receiveVariants(component.order.variants);
    expect(component.hasProductChanges).toBeFalse();
    component.receiveVariants([{ id: 2491, name: 'Otra falda', quantity: 1, price: 90 }]);
    expect(component.hasProductChanges).toBeTrue();
    component.form.markAsPristine();
    component.removeVariant(1);
    expect(component.hasProductChanges).toBeTrue();
  });

  it('keeps product changes available to retry when saving fails', () => {
    component.variants.at(0).get('price')!.setValue(100);
    component.variants.at(0).get('price')!.markAsDirty();
    component.save();
    response.error(new Error('Network error'));
    expect(component.hasProductChanges).toBeTrue();
    expect(component.saving).toBeFalse();
    expect(component.error).toBeTruthy();
  });
});

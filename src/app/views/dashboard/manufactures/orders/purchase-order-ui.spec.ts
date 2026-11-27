import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { BaseService } from 'src/app/views/base.service';
import { SupplierService } from '../../users/suppliers/supplier.service';
import { ManufactureVariantService } from '../manufacture.variants.service';
import { ManufactureService } from '../manufacture.service';
import { ManufactureKardexService } from '../manufacture.kardex.service';
import { ManufactureVariantIndexComponent } from '../variants/manufacture-variant-index/manufacture-variant-index.component';
import { ManufactureOrderService } from './manufacture.order.service';
import { ManufactureOrderIndexPageComponent } from './manufacture-order-index-page/manufacture-order-index-page.component';
import { ManufactureOrderCreateComponent } from './manufacture-order-create/manufacture-order-create.component';
import { ManufactureOrderEditComponent } from './manufacture-order-edit-page/manufacture-order-edit/manufacture-order-edit.component';
import { ManufactureOrderKardexIndexComponent } from './manufacture-order-edit-page/manufacture-order-kardex-index/manufacture-order-kardex-index.component';
import { OrderWidgetComponent } from './manufacture-order-edit-page/order-widget/order-widget.component';

registerLocaleData(localeEsPe);

describe('Purchase order screens', () => {
  let listing: Subject<unknown>;
  let saving: Subject<unknown>;
  let variantUpdate: Subject<unknown>;
  let movements: Subject<unknown>;
  let index: jasmine.Spy;
  let store: jasmine.Spy;
  let update: jasmine.Spy;
  let updateVariant: jasmine.Spy;
  let movementIndex: jasmine.Spy;

  beforeEach(async () => {
    listing = new Subject();
    saving = new Subject();
    variantUpdate = new Subject();
    movements = new Subject();
    index = jasmine.createSpy('index').and.returnValue(listing);
    store = jasmine.createSpy('store').and.returnValue(saving);
    update = jasmine.createSpy('update').and.returnValue(saving);
    updateVariant = jasmine.createSpy('updateVariant').and.returnValue(variantUpdate);
    movementIndex = jasmine.createSpy('movementIndex').and.returnValue(movements);
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDenied: false, isDismissed: true });

    await TestBed.configureTestingModule({
      imports: [ManufactureOrderIndexPageComponent, ManufactureOrderCreateComponent, ManufactureOrderEditComponent,
        ManufactureOrderKardexIndexComponent, ManufactureVariantIndexComponent, OrderWidgetComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BaseService, useValue: { store: 'sorelle', storeName: 'sorelle' } },
        { provide: ManufactureOrderService, useValue: { index, store, update } },
        { provide: SupplierService, useValue: { index: () => of({ data: [] }) } },
        { provide: ManufactureVariantService, useValue: { setManufactureId: jasmine.createSpy(), index: () => of({ data: [] }), update: updateVariant } },
        { provide: ManufactureKardexService, useValue: { setManufactureId: jasmine.createSpy(), index: movementIndex } },
      ],
    }).compileComponents();
  });

  it('keeps filters visible and lets the user retry a failed list request', () => {
    const fixture = TestBed.createComponent(ManufactureOrderIndexPageComponent);
    fixture.detectChanges();
    listing.error(new Error('Network error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-manufacture-index-filters')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('No pudimos cargar las órdenes');
    index.and.returnValue(new Subject());
    fixture.nativeElement.querySelector('[role="alert"] button').click();
    expect(index).toHaveBeenCalledTimes(2);
  });

  it('keeps the summary link and displays quantities in aligned columns', () => {
    const fixture = TestBed.createComponent(ManufactureOrderIndexPageComponent);
    fixture.detectChanges();
    listing.next({ data: [{ id: 41, name: 'Pedido de prendas', sum_variants: 30, sum_kardexes: 8, manufacture_end: '2026-11-02', collection: { id: 1, name: 'Verano' } }] });
    listing.complete();
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('thead th').length).toBe(6);
    expect(element.querySelectorAll('tbody tr:first-child td').length).toBe(6);
    expect(element.querySelector('.purchase-order-name')?.getAttribute('href')).toBe('/sorelle/dashboard/manufactures/orders/41');
    expect(element.querySelector('.purchase-order-received')?.textContent?.trim()).toBe('8');
    expect(element.textContent).toContain('02/11/2026');
    expect(element.querySelector('.manufacture-collection-badge')?.textContent).toContain('Verano');
    expect(element.querySelector('.manufacture-collection-badge')?.getAttribute('href')).toBe('/sorelle/dashboard/collections/1?view=processes');
  });

  it('shows three top cards with estimated cost inside Ordered products', async () => {
    const fixture = TestBed.createComponent(OrderWidgetComponent);
    fixture.componentRef.setInput('summary', {});
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Resumen');
    expect(fixture.nativeElement.textContent).not.toContain('undefined');
    fixture.componentRef.setInput('summary', { created_at: '2026-10-29', sum_variants: 30, count_variants: 2, sum_payments: 80, count_payments: 1, sum_kardexes: 8, estimated_order_cost: 50.17 });
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('nav a');
    expect(links.length).toBe(3);
    expect(links[0].getAttribute('aria-current')).toBeNull();
    expect(links[0].getAttribute('href')).toBe('/variants');
    expect(links[0].textContent).toContain('Monto total pedido');
    expect(links[0].querySelector('.purchase-order-product-cost')!.textContent).toContain('50.17');
    expect(links[0].querySelector('.purchase-order-metric-subtitle')!.textContent).toContain('30 unidades pedidas');
    expect(links[0].textContent).toContain('50.17');
    expect(links[1].getAttribute('href')).toBe('/payments');
    expect(links[1].textContent).toContain('80.00');
    expect(links[2].getAttribute('href')).toBe('/kardexes');
  });

  it('counts saved receptions and explains pending stock without duplicating posted units', () => {
    const fixture = TestBed.createComponent(OrderWidgetComponent);
    fixture.componentRef.setInput('summary', { sum_kardexes: 0, pending_reception_units: '124' }); fixture.detectChanges();
    const card = () => fixture.nativeElement.querySelectorAll('nav a')[2] as HTMLElement;
    expect(card().querySelector('strong')!.textContent!.trim()).toBe('124');
    expect(card().textContent).toContain('124 pendientes de ingreso al kardex');
    fixture.componentRef.setInput('summary', { sum_kardexes: '124', pending_reception_units: 0 }); fixture.detectChanges();
    expect(card().querySelector('strong')!.textContent!.trim()).toBe('124');
    expect(card().textContent).toContain('Unidades recibidas');
    expect(card().textContent).not.toContain('pendientes'); fixture.destroy();
  });

  it('refreshes reception totals after saving and retains pending units when the ledger reports its own balance', () => {
    const summary = jasmine.createSpy('summary').and.returnValue(of({ data: { sum_kardexes: 0, pending_reception_units: 124 } }));
    const setSummary = jasmine.createSpy('setSummary');
    TestBed.overrideProvider(ManufactureService, { useValue: { summary, setSummary } });
    const fixture = TestBed.createComponent(ManufactureOrderKardexIndexComponent);
    fixture.componentInstance.manufacture_id = 39;
    fixture.componentInstance.receptionSaved();
    expect(summary).toHaveBeenCalledWith(39);
    expect(setSummary).toHaveBeenCalledWith({ sum_kardexes: 0, pending_reception_units: 124 });
    fixture.componentInstance.receiveKardexSummary({ reception: 0 });
    expect(setSummary.calls.mostRecent().args[0]).toEqual({ sum_kardexes: 0 }); fixture.destroy();
  });

  it('validates creation, prevents duplicate submissions and retains fields after an error', () => {
    const fixture = TestBed.createComponent(ManufactureOrderCreateComponent);
    fixture.detectChanges();
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(store).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Ingresa un nombre');
    fixture.componentInstance.form.patchValue({ name: 'Pedido de verano', supplier_id: null });
    const payload = fixture.componentInstance.form.value;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(store).toHaveBeenCalledOnceWith(payload);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    saving.error(new Error('Network error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeFalse();
    expect(fixture.componentInstance.form.get('name')!.value).toBe('Pedido de verano');
  });

  it('updates the supplied order ID and restores the save button after an error', () => {
    const fixture = TestBed.createComponent(ManufactureOrderEditComponent);
    fixture.componentRef.setInput('manufacture_order', { id: 41, name: 'Pedido', supplier_id: null, manufacture_start: '2026-10-29T12:00:00Z', manufacture_end: '2026-11-02 00:00:00' });
    fixture.detectChanges();
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    const payload = fixture.componentInstance.form.value;
    expect(payload.manufacture_start).toBe('2026-10-29');
    expect(payload.manufacture_end).toBe('2026-11-02');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(update).toHaveBeenCalledOnceWith(41, payload);
    saving.error(new Error('Network error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeFalse();
  });

  it('shows live ordered units and the sum of quantity times unit cost without saving drafts', () => {
    const fixture = TestBed.createComponent(ManufactureVariantIndexComponent);
    fixture.componentRef.setInput('manufacture_variants', [
      { id: 12, quantity: 2, price: '10.10', variant: { id: 4, sku: 'A-S', product: { id: 1, name: 'Blusa' } } },
      { id: 13, quantity: 3, price: '9.99', variant: { id: 5, sku: 'A-M', product: { id: 1, name: 'Blusa' } } },
    ]);
    fixture.detectChanges();
    expect(fixture.componentInstance.orderTotals).toEqual({ units: 5, cost: 50.17, products: 1, variants: 2, zeroCostVariants: 0, valid: true });
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[aria-label="Unidades del pedido"]');
    const emitTotals = spyOn(fixture.componentInstance.emitOrderTotals, 'emit');
    input.value = '4'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(fixture.componentInstance.orderTotals.cost).toBe(70.37);
    expect(fixture.nativeElement.querySelector('.purchase-order-total-units strong').textContent.trim()).toBe('7');
    expect(getComputedStyle(fixture.nativeElement.querySelector('.purchase-order-total-units')).textAlign).toBe('center');
    expect(emitTotals).toHaveBeenCalledWith(jasmine.objectContaining({ cost: 70.37, units: 7, pending: true }));
    expect(fixture.nativeElement.querySelector('.purchase-order-totals')).toBeNull();
    expect(updateVariant).not.toHaveBeenCalled();
    input.value = ''; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(fixture.componentInstance.orderTotals.valid).toBeFalse();
    expect(fixture.nativeElement.querySelector('.purchase-order-footer-cost strong').textContent).toContain('—');
  });

  it('saves changed quantities only when the fixed save button is pressed', () => {
    const fixture = TestBed.createComponent(ManufactureVariantIndexComponent);
    const variant = { id: 12, manufacture_id: 41, quantity: 2, price: '10.00', variant: { id: 4, sku: 'ABC', product: { name: 'Blusa' }, variant_option_values: [{ id: 1, option: { label: 'Talla' }, option_value: { value: 'M' } }] } };
    fixture.componentRef.setInput('manufacture_variants', [variant]);
    fixture.componentRef.setInput('sum_variants', 2);
    fixture.detectChanges();
    const emitTotal = spyOn(fixture.componentInstance.emitSumManufactureVariant, 'emit');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[aria-label="Unidades del pedido"]');
    input.value = '3';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(updateVariant).not.toHaveBeenCalled();
    const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('.purchase-order-save-button');
    expect(saveButton.disabled).toBeFalse();
    saveButton.click();
    expect(updateVariant).toHaveBeenCalledOnceWith(12, { quantity: '3', price: '10.00' });
    variantUpdate.next({ data: { ...variant, quantity: 3 } });
    variantUpdate.complete();
    fixture.detectChanges();
    expect(emitTotal).toHaveBeenCalledWith(3);
    expect(fixture.nativeElement.querySelector('tbody tr').textContent).toContain('M');
    expect(fixture.nativeElement.querySelector('.purchase-order-variant-sku').textContent).toContain('ABC');
    expect(saveButton.disabled).toBeTrue();
    expect(fixture.componentInstance.pendingRows.length).toBe(0);
  });

  it('keeps each variant price editable in its own row', () => {
    const fixture = TestBed.createComponent(ManufactureVariantIndexComponent);
    const rows = ['M', 'S'].map((size, index) => ({
      id: 15 + index, manufacture_id: 41, quantity: index ? 3 : 4, price: index ? '6.00' : '5.00',
      variant: { id: 100 + index, sku: `SKU-${size}`, product: { id: 1, name: 'Blusa' }, option_values: [
        { option: { name: 'color', label: 'Colores' }, value: 'COCO' },
        { option: { name: 'size', label: 'Tallas' }, value: size },
      ] },
    }));
    fixture.componentRef.setInput('manufacture_variants', rows);
    fixture.detectChanges();
    const price: HTMLInputElement = fixture.nativeElement.querySelector('tbody tr[data-variant-id="15"] input[aria-label="Precio unitario en soles"]');
    price.value = '12.50';
    price.dispatchEvent(new Event('input'));
    price.dispatchEvent(new Event('blur'));
    expect(updateVariant).not.toHaveBeenCalled();
    fixture.componentInstance.saveChanges();
    expect(updateVariant).toHaveBeenCalledOnceWith(15, { quantity: 4, price: '12.50' });
    variantUpdate.next({ data: { ...rows[0], price: '12.50' } });
    variantUpdate.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
    expect(fixture.nativeElement.querySelector('tbody tr[data-variant-id="16"] input[aria-label="Precio unitario en soles"]').value).toBe('6.00');
  });

  it('disables saving for unchanged, reverted or invalid drafts, and allows zero', () => {
    const fixture = TestBed.createComponent(ManufactureVariantIndexComponent);
    fixture.componentRef.setInput('manufacture_variants', [{ id: 12, manufacture_id: 41, quantity: 2, price: '10.00' }]);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.purchase-order-save-button');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[aria-label="Unidades del pedido"]');
    expect(button.disabled).toBeTrue();
    for (const value of ['3', '2', '-1', '', '1.5']) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(button.disabled).toBe(value !== '3');
    }
    fixture.componentInstance.saveChanges();
    expect(updateVariant).not.toHaveBeenCalled();
    input.value = '0';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();
  });

  it('saves only pending variants and preserves a failed draft for retry', () => {
    const fixture = TestBed.createComponent(ManufactureVariantIndexComponent);
    const rows = [1, 2, 3].map(id => ({ id, manufacture_id: 41, quantity: 2, price: '10.00', variant: { product: { id, name: `Producto ${id}` } } }));
    fixture.componentRef.setInput('manufacture_variants', rows);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input[aria-label="Unidades del pedido"]');
    for (const input of [inputs[0], inputs[1]]) {
      input.value = '3';
      input.dispatchEvent(new Event('input'));
    }
    updateVariant.and.callFake((id: number) => id === 1
      ? of({ data: { id: 1, quantity: 3 } }) : throwError(() => new Error('Offline')));
    fixture.componentInstance.saveChanges();
    fixture.detectChanges();
    expect(updateVariant.calls.allArgs().map(args => args[0])).toEqual([1, 2]);
    expect(fixture.componentInstance.pendingRows.map(row => row.manufacture_variant.id)).toEqual([2]);
    expect(inputs[1].value).toBe('3');
    expect(fixture.componentInstance.manufacture_variants[0].variant.product.name).toBe('Producto 1');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('No se guardó');
    updateVariant.and.returnValue(of({ data: { id: 2, quantity: 3 } }));
    fixture.componentInstance.saveChanges();
    fixture.detectChanges();
    expect(updateVariant.calls.allArgs().map(args => args[0])).toEqual([1, 2, 2]);
    expect(fixture.componentInstance.pendingRows.length).toBe(0);
    expect(fixture.nativeElement.querySelector('.purchase-order-save-button').disabled).toBeTrue();
  });

  it('prevents duplicate saves and locks inputs while saving', () => {
    const fixture = TestBed.createComponent(ManufactureVariantIndexComponent);
    fixture.componentRef.setInput('manufacture_variants', [{ id: 12, manufacture_id: 41, quantity: 2, price: '10.00' }]);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[aria-label="Unidades del pedido"]');
    input.value = '3';
    input.dispatchEvent(new Event('input'));
    fixture.componentInstance.saveChanges();
    fixture.detectChanges();
    fixture.componentInstance.saveChanges();
    expect(updateVariant).toHaveBeenCalledTimes(1);
    expect(input.readOnly).toBeTrue();
    expect(fixture.nativeElement.querySelector('.purchase-order-save-button').disabled).toBeTrue();
    variantUpdate.next({ data: { id: 12, quantity: 3 } });
    variantUpdate.complete();
    fixture.detectChanges();
    expect(input.readOnly).toBeFalse();
  });

  it('refreshes inventory totals and the ledger revision after a movement is registered', () => {
    const fixture = TestBed.createComponent(ManufactureOrderKardexIndexComponent);
    fixture.componentInstance.manufacture_id = 41;
    fixture.detectChanges();
    const summary = spyOn(TestBed.inject(ManufactureService), 'summary').and.returnValue(of({ data: { sum_kardexes: 5 } } as any));
    const close = jasmine.createSpy('close');
    fixture.componentInstance.modal = { close } as unknown as typeof fixture.componentInstance.modal;
    fixture.componentInstance.receiveKardexes([]);
    expect(close).toHaveBeenCalled();
    expect(summary).toHaveBeenCalledOnceWith(41);
    expect(fixture.componentInstance.kardexRevision).toBe(1);
  });
});

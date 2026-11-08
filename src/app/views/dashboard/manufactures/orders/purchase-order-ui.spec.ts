import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { BaseService } from 'src/app/views/base.service';
import { SupplierService } from '../../users/suppliers/supplier.service';
import { ManufactureVariantService } from '../manufacture.variants.service';
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
    listing.next({ data: [{ id: 41, name: 'Pedido de prendas', sum_variants: 30, sum_kardexes: 8, manufacture_end: '2026-11-02' }] });
    listing.complete();
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('thead th').length).toBe(6);
    expect(element.querySelectorAll('tbody tr:first-child td').length).toBe(6);
    expect(element.querySelector('.purchase-order-name')?.getAttribute('href')).toBe('/sorelle/dashboard/manufactures/orders/41');
    expect(element.querySelector('.purchase-order-received')?.textContent?.trim()).toBe('8');
    expect(element.textContent).toContain('02/11/2026');
  });

  it('links all detail sections and safely displays an order with no date', async () => {
    const fixture = TestBed.createComponent(OrderWidgetComponent);
    fixture.componentRef.setInput('summary', {});
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Sin fecha');
    expect(fixture.nativeElement.textContent).not.toContain('undefined');
    fixture.componentRef.setInput('summary', { created_at: '2026-10-29', sum_variants: 30, count_variants: 2, sum_payments: 80, count_payments: 1, sum_kardexes: 8 });
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('nav a');
    expect(links.length).toBe(4);
    expect(links[0].getAttribute('aria-current')).toBe('page');
    expect(links[1].getAttribute('href')).toBe('/variants');
    expect(links[2].getAttribute('href')).toBe('/payments');
    expect(links[2].textContent).toContain('80.00');
    expect(links[3].getAttribute('href')).toBe('/kardexes');
  });

  it('validates creation, prevents duplicate submissions and retains fields after an error', () => {
    const fixture = TestBed.createComponent(ManufactureOrderCreateComponent);
    fixture.detectChanges();
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(store).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Ingresa un nombre');
    fixture.componentInstance.form.patchValue({ name: 'Pedido de verano', supplier_id: 7 });
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

  it('keeps quantity and price editing connected to the existing variant update', () => {
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
    expect(updateVariant).toHaveBeenCalledOnceWith(12, { quantity: '3', price: '10.00' });
    variantUpdate.next({ data: { ...variant, quantity: 3 } });
    variantUpdate.complete();
    fixture.detectChanges();
    expect(emitTotal).toHaveBeenCalledWith(3);
    expect(fixture.nativeElement.textContent).toContain('Talla: M');
  });

  it('reloads grouped receptions after a movement is registered', () => {
    const fixture = TestBed.createComponent(ManufactureOrderKardexIndexComponent);
    fixture.detectChanges();
    movements.next({ data: [] });
    movements.complete();
    fixture.detectChanges();
    const refreshed = new Subject();
    movementIndex.and.returnValue(refreshed);
    const close = jasmine.createSpy('close');
    fixture.componentInstance.modal = { close };
    fixture.componentInstance.receiveKardexes([]);
    expect(close).toHaveBeenCalled();
    expect(movementIndex).toHaveBeenCalledTimes(2);
    refreshed.next({ data: [{ date: '2026-10-29', groups: [{ direction: 'in', kardexes: [{ id: 99, variant_id: 4, direction: 'in', quantity: 5 }] }] }] });
    refreshed.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.kardex-quantity-badge').textContent.trim()).toBe('+5');
  });
});

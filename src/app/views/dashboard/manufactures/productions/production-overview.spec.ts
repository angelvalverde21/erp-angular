import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ProductionWidgetComponent } from './manufacture-production-edit-page/production-widget/production-widget.component';
import { ManufactureProductionEditComponent } from './manufacture-production-edit-page/manufacture-production-edit/manufacture-production-edit.component';
import { ProductionDeliveryTrackingComponent } from './manufacture-production-edit-page/production-delivery-tracking/production-delivery-tracking.component';
import { ManufactureService } from '../manufacture.service';
import { ManufacturePurchaseService } from '../manufacture.purchase.service';
import { ManufactureProductionService } from './manufacture.production.service';
import { ProductionStageService } from './production-stages/production-stage.service';
import { BaseService } from 'src/app/views/base.service';
import { PurchaseEditPageComponent } from '../../purchases/purchase-edit-page/purchase-edit-page.component';
import { PurchaseEditComponent } from '../../purchases/purchase-edit/purchase-edit.component';
import { PurchaseService } from '../../purchases/purchase.service';
import { SupplierService } from '../../users/suppliers/supplier.service';
import { By } from '@angular/platform-browser';

registerLocaleData(localeEsPe);

describe('Production overview', () => {
  let updates: Subject<any>;
  let update: jasmine.Spy;
  let manufacture: { manufactureSingnalEvent: ReturnType<typeof signal<any>>; setManufacture: jasmine.Spy };
  const purchases = [
    { id: 1, production_stage_id: 1, items: [{ name: 'Tela', quantity: 2, price: 20 }], delivery_tracking: { expected_on: '2026-12-10', received_on: null, status: 'pending' } },
    { id: 2, production_stage_id: 2, items: [{ name: 'Corte', quantity: 1, price: 10 }], delivery_tracking: { expected_on: '2026-11-01', received_on: null, status: 'overdue' } },
    { id: 3, production_stage_id: 1, items: [], delivery_tracking: { expected_on: '2026-11-01', received_on: '2026-11-02', status: 'received' } },
    { id: 4, production_stage_id: 1, items: [{ name: 'Compra sin seguimiento' }] },
  ];

  beforeEach(() => {
    updates = new Subject();
    update = jasmine.createSpy('update').and.returnValue(updates);
    const current = signal<any>({ id: 24, name: 'Blusa Renata' });
    manufacture = { manufactureSingnalEvent: current, setManufacture: jasmine.createSpy('setManufacture').and.callFake(data => current.set(data)) };
    TestBed.configureTestingModule({ providers: [
      provideRouter([]),
      provideHttpClient(), provideHttpClientTesting(),
      { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ production_id: 24 }) } } },
      { provide: ManufactureService, useValue: manufacture },
      { provide: ManufactureProductionService, useValue: { update } },
      { provide: ProductionStageService, useValue: { changes: new Subject<number>(), list: () => of({ data: [
        { id: 1, code: 'materials', slug: 'telas-e-insumos', name: 'Telas e insumos', status: 'completed', show_in_stepper: true, purchases_count: 2 },
        { id: 2, code: 'cutting', slug: 'corte', name: 'Corte', status: 'pending', show_in_stepper: true, purchases_count: 1 },
        { id: 7, code: 'others', slug: 'otros', name: 'Otros', status: null, show_in_stepper: false, purchases_count: 0 },
      ] }) } },
    ] });
    TestBed.overrideComponent(ProductionDeliveryTrackingComponent, { set: { providers: [
      { provide: ManufacturePurchaseService, useValue: { setManufactureId: jasmine.createSpy(), listPurchases: () => of({ data: purchases }) } },
    ] } });
  });

  it('places the production flow first and delivery tracking second without a summary card', () => {
    const fixture = TestBed.createComponent(ProductionWidgetComponent);
    fixture.componentRef.setInput('summary', { sum_purchases: 400, sum_variants: 20, count_variants: 2, sum_kardexes: 8, tracked_purchases_count: 3 });
    fixture.detectChanges();
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('nav a');
    expect(links.length).toBe(4);
    expect(links[0].textContent).toContain('Flujo de producción');
    expect(links[0].textContent).toContain('400.00');
    expect(links[0].textContent).toContain('20.00');
    expect(links[1].textContent).toContain('Seguimiento de entregas');
    expect(links[1].querySelector('strong')?.textContent?.trim()).toBe('3');
    expect(links[2].textContent).toContain('Productos');
    expect(links[3].textContent).toContain('Recepción de mercadería');
    expect(fixture.nativeElement.textContent).not.toContain('Resumen');
    fixture.componentRef.setInput('summary', { sum_purchases: 400, sum_variants: 0 });
    fixture.detectChanges();
    expect(fixture.componentInstance.unitCost).toBe(0);
    expect(links[1].querySelector('strong')?.textContent?.trim()).toBe('0');
  });

  it('shows only tracked purchases including received ones and prioritizes overdue deliveries', () => {
    const fixture = TestBed.createComponent(ProductionDeliveryTrackingComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.visiblePurchases.map(purchase => purchase.id)).toEqual([2, 1, 3]);
    expect(component.count('all')).toBe(3);
    expect(component.count('pending')).toBe(2);
    expect(component.count('overdue')).toBe(1);
    expect(component.count('received')).toBe(1);
    expect(component.purchaseLink(2)).toEqual(['/', 'sorelle', 'dashboard', 'purchases', 2]);
    component.filter = 'received';
    expect(component.visiblePurchases.map(purchase => purchase.id)).toEqual([3]);
    component.filter = 'all';
    component.search = 'Corte';
    expect(component.visiblePurchases.map(purchase => purchase.id)).toEqual([2]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Compromiso vigente');
  });
  it('opens a standalone purchase editor with a return link to the production overview', () => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: { snapshot: {
      paramMap: convertToParamMap({ purchase_id: 93 }), queryParamMap: convertToParamMap({ production: 24, returnTo: 'deliveries' }),
    } } });
    const fixture = TestBed.createComponent(PurchaseEditPageComponent);
    const component = fixture.componentInstance;
    expect(component.purchaseId).toBe(93);
    expect(component.backLink).toEqual(['/', 'sorelle', 'dashboard', 'manufactures', 'productions', 24, 'deliveries']);
    expect(component.loaded).toBeFalse();
    component.purchaseLoaded({ delivery_tracking: null });
    expect(component.loaded).toBeTrue();
    component.saved();
    expect(component.message).toContain('actualizada');
  });

  it('returns to purchases when the editor has no production context', () => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: { snapshot: {
      paramMap: convertToParamMap({ purchase_id: 93 }), queryParamMap: convertToParamMap({}),
    } } });
    const component = TestBed.createComponent(PurchaseEditPageComponent).componentInstance;
    expect(component.fromProduction).toBeFalse();
    expect(component.backLink).toEqual(['/', 'sorelle', 'dashboard', 'purchases']);
  });

  it('shows delivery in a separate card below the purchase without tabs or losing the draft', () => {
    const purchaseResponse = new Subject<any>();
    TestBed.overrideProvider(ActivatedRoute, { useValue: { snapshot: {
      paramMap: convertToParamMap({ purchase_id: 93 }), queryParamMap: convertToParamMap({ production: 24, returnTo: 'deliveries' }),
    } } });
    TestBed.overrideProvider(PurchaseService, { useValue: { get: () => purchaseResponse } });
    TestBed.overrideProvider(SupplierService, { useValue: { index: () => of({ data: [] }) } });
    const fixture = TestBed.createComponent(PurchaseEditPageComponent);
    fixture.detectChanges();
    purchaseResponse.next({ data: {
      id: 93, supplier: { user: { name: 'Proveedor de telas' } }, delivery_tracking: null,
      items: [{ name: 'Tela', quantity: 1, unit_id: 1, price: 20, subtotal: 20 }],
    } });
    purchaseResponse.complete();
    fixture.detectChanges();
    const editor = fixture.debugElement.query(By.directive(PurchaseEditComponent)).componentInstance as PurchaseEditComponent;
    editor.purchase_items.at(0).get('name')?.setValue('Tela editada sin guardar');
    fixture.detectChanges();
    const deliveryCard = fixture.nativeElement.querySelector('.purchase-delivery-panel');
    const purchaseCard = fixture.nativeElement.querySelector('.purchase-edit-panel');
    expect(deliveryCard).not.toBeNull();
    expect(purchaseCard.compareDocumentPosition(deliveryCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[role="tablist"]')).toBeNull();
    const restored = fixture.debugElement.query(By.directive(PurchaseEditComponent)).componentInstance;
    expect(restored).toBe(editor);
    expect(restored.purchase_items.at(0).value.name).toBe('Tela editada sin guardar');
    expect(fixture.nativeElement.textContent).toContain('Proveedor de telas');
  });

  it('preserves name edits after failure and updates the shared header data after retry', () => {
    const fixture = TestBed.createComponent(ManufactureProductionEditComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.form.controls.name.setValue('Nueva producción');
    component.form.markAsDirty();
    component.update();
    component.update();
    expect(update).toHaveBeenCalledOnceWith(24, { name: 'Nueva producción' });
    updates.error({ error: {} });
    expect(component.saving).toBeFalse();
    expect(component.form.value.name).toBe('Nueva producción');
    expect(component.nameError).toContain('No se pudo guardar');
    update.and.returnValue(of({ data: {} }));
    component.update();
    expect(manufacture.manufactureSingnalEvent().name).toBe('Nueva producción');
    expect(component.form.pristine).toBeTrue();
  });
});

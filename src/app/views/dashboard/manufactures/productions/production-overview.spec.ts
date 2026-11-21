import { DeliveryTrackingComponent } from '@shared/components/delivery-tracking/delivery-tracking.component';
import { DeliveryTrackingService } from '@shared/components/delivery-tracking/delivery-tracking.service';
import { KardexHistoryComponent } from '../../kardex/kardex-history/kardex-history.component';
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
import { ManufactureProductionKardexIndexComponent } from './manufacture-production-edit-page/manufacture-production-kardex-index/manufacture-production-kardex-index.component';
import { ManufactureKardexService } from '../manufacture.kardex.service';
import { InventoryReceptionService } from '../../inventory-receptions/inventory-reception.service';
import { ManufactureOrderKardexIndexComponent } from '../orders/manufacture-order-edit-page/manufacture-order-kardex-index/manufacture-order-kardex-index.component';
import { ManufactureVariantService } from '../manufacture.variants.service';
import { InventoryReceptionIndexComponent } from '../../inventory-receptions/inventory-reception-index/inventory-reception-index.component';

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
      { provide: InventoryReceptionService, useValue: { list: () => of({ data: [], current_page: 1, last_page: 1 }) } },
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
    expect(links[0].textContent).toContain('Compras');
    expect(links[0].textContent).toContain('400.00');
    expect(links[0].textContent).toContain('20.00');
    expect(links[1].textContent).toContain('Seguimiento de compras');
    expect(links[1].querySelector('strong')?.textContent?.trim()).toBe('3');
    expect(links[2].textContent).toContain('Productos');
    expect(links[3].textContent).toContain('Recepción de mercadería');
    expect(fixture.nativeElement.textContent).not.toContain('Resumen');
    fixture.componentRef.setInput('summary', { sum_purchases: 400, sum_variants: 0 });
    fixture.detectChanges();
    expect(fixture.componentInstance.unitCost).toBe(0);
    expect(links[1].querySelector('strong')?.textContent?.trim()).toBe('0');
  });

  it('loads production movements only when expanded and refreshes totals without duplicating rows', () => {
    const setSummary = jasmine.createSpy('setSummary');
    TestBed.overrideProvider(ManufactureService, { useValue: { setSummary, summary: () => of({ data: { sum_kardexes: 4 } }) } });
    TestBed.overrideProvider(ActivatedRoute, { useValue: { parent: { paramMap: of(convertToParamMap({ production_id: '24' })) } } });
    const index = jasmine.createSpy('index').and.returnValue(of({ data: [{ date: '2026-11-18', groups: [{ direction: 'in', total_quantity: 4,
      kardexes: [432, 431, 430, 429].map(id => ({ id, direction: 'in', quantity: '1', variant_id: 3131 })),
    }] }] }));
    const fixture = TestBed.createComponent(ManufactureProductionKardexIndexComponent); fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.directive(KardexHistoryComponent)).injector.get(ManufactureKardexService), 'index').and.callFake(index);
    expect(index).not.toHaveBeenCalled(); expect(setSummary).not.toHaveBeenCalled();
    const details = fixture.nativeElement.querySelector('.kardex-history') as HTMLDetailsElement;
    details.open = true; details.dispatchEvent(new Event('toggle')); fixture.detectChanges();
    expect(setSummary).toHaveBeenCalledWith({ sum_kardexes: 4 });
    expect(fixture.nativeElement.querySelectorAll('.kardex-quantity-badge').length).toBe(4);
    const close = jasmine.createSpy('close'); fixture.componentInstance.modal = { close } as any;
    const refresh = spyOn(fixture.componentInstance.receptionIndex!, 'refresh');
    fixture.componentInstance.receptionSaved();
    expect(close).toHaveBeenCalledTimes(1); expect(refresh).toHaveBeenCalledWith(1);
    fixture.componentInstance.receiveKardexes([{ id: 432, quantity: 1, direction: 'in' }]); fixture.detectChanges();
    expect(index).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.querySelectorAll('.kardex-quantity-badge').length).toBe(4);
    details.open = false; details.dispatchEvent(new Event('toggle')); fixture.detectChanges();
    fixture.componentInstance.inventoryChanged(); fixture.detectChanges();
    expect(index).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).not.toContain('NaN'); fixture.destroy();
  });

  it('shows order receptions immediately while deferring movements and variant selection', () => {
    TestBed.overrideProvider(ManufactureService, { useValue: { setSummary: jasmine.createSpy() } });
    TestBed.overrideProvider(ActivatedRoute, { useValue: { parent: { paramMap: of(convertToParamMap({ order_id: '23' })) } } });
    const index = jasmine.createSpy('index').and.returnValue(of({ data: [{ date: '2026-11-18', groups: [
      { direction: 'in', kardexes: [{ id: 1, direction: 'in', quantity: 5 }] }, { direction: 'out', kardexes: [{ id: 2, direction: 'out', quantity: 1 }] },
    ] }] }));
    const selection = jasmine.createSpy('selection').and.returnValue(of({ data: [{ variant: null }] }));
    TestBed.overrideProvider(ManufactureVariantService, { useValue: { setManufactureId: jasmine.createSpy(), selection } });
    const fixture = TestBed.createComponent(ManufactureOrderKardexIndexComponent); fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.directive(KardexHistoryComponent)).injector.get(ManufactureKardexService), 'index').and.callFake(index);
    const history = fixture.debugElement.query(By.directive(InventoryReceptionIndexComponent)).componentInstance;
    expect(history.manufactureId).toBe(23); expect(index).not.toHaveBeenCalled(); expect(selection).not.toHaveBeenCalled();
    const close = jasmine.createSpy('close'); fixture.componentInstance.modal = { close } as any;
    const refresh = spyOn(history, 'refresh'); history.page = 2;
    fixture.componentInstance.editingReception = { id: 10 } as any;
    fixture.componentInstance.receptionSaved();
    expect(close).toHaveBeenCalledTimes(1); expect(refresh).toHaveBeenCalledWith(2);
    const details = fixture.nativeElement.querySelector('.kardex-history') as HTMLDetailsElement;
    details.open = true; details.dispatchEvent(new Event('toggle')); fixture.detectChanges();
    expect(fixture.componentInstance.kardex_summary.reception).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('.kardex-quantity-badge').length).toBe(2);
    fixture.componentInstance.loadVariants(); expect(fixture.componentInstance.variants).toEqual([null]);
    expect(fixture.nativeElement.querySelector('.inventory-action--in').textContent).toContain('Registrar ingreso'); fixture.destroy();
  });

  it('shows only tracked purchases including received ones and prioritizes overdue deliveries', () => {
    const fixture = TestBed.createComponent(ProductionDeliveryTrackingComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.filter).toBe('pending');
    expect(component.visiblePurchases.map(purchase => purchase.id)).toEqual([2, 1]);
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
  it('limits embedded tracking to dated purchases of the selected section and resets filters on switching', () => {
    const fixture = TestBed.createComponent(ProductionDeliveryTrackingComponent);
    fixture.componentRef.setInput('embedded', true);
    fixture.componentRef.setInput('manufactureId', 24);
    fixture.componentRef.setInput('stageId', 1);
    fixture.componentRef.setInput('stageSlug', 'moldes-y-ploteo');
    fixture.componentRef.setInput('purchases', [...purchases, { id: 5, production_stage_id: 1, delivery_tracking: { expected_on: null } }]);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.visiblePurchases.map(purchase => purchase.id)).toEqual([1]);
    expect(component.returnQuery).toEqual({ production: 24, returnTo: 'section-tracking', stage: 'moldes-y-ploteo' });
    expect(fixture.nativeElement.querySelector('.delivery-refresh')).toBeNull();
    component.filter = 'received'; component.search = 'missing';
    fixture.componentRef.setInput('stageId', 2); fixture.detectChanges();
    expect(component.filter).toBe('pending'); expect(component.search).toBe('');
    expect(component.visiblePurchases.map(purchase => purchase.id)).toEqual([2]);
    fixture.componentRef.setInput('stageId', 9); fixture.detectChanges();
    const open = spyOn(component.openPurchases, 'emit');
    (fixture.nativeElement.querySelector('.delivery-empty button') as HTMLButtonElement).click();
    expect(open).toHaveBeenCalled();
  });

  it('receives a purchase from the tracking list and updates pending counts without opening its detail', () => {
    const fixture = TestBed.createComponent(ProductionDeliveryTrackingComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const changed = spyOn(TestBed.inject(ProductionStageService).changes, 'next');
    const received = { ...purchases[0].delivery_tracking, id: 10, revision: 1, received_on: '2026-11-20', status: 'received', received_late: false, reschedules_count: 0 } as any;
    const save = spyOn(TestBed.inject(DeliveryTrackingService), 'updateTracking').and.returnValue(of({ data: received }));
    const cards = fixture.debugElement.queryAll(By.css('.delivery-purchase'));
    const card = cards.find(card => card.nativeElement.textContent.includes('Compra #1'))!;
    expect(card.nativeElement.tagName).toBe('ARTICLE');
    card.query(By.css('.delivery-receive')).nativeElement.click(); fixture.detectChanges();
    const editor = card.query(By.directive(DeliveryTrackingComponent)).componentInstance as DeliveryTrackingComponent;
    expect(editor.mode).toBe('receive');
    editor.form.controls.received_on.setValue('2026-11-20');
    editor.save(); fixture.detectChanges();
    expect(save).toHaveBeenCalled();
    expect(component.count('pending')).toBe(1);
    expect(component.count('received')).toBe(2);
    expect(component.visiblePurchases.map(purchase => purchase.id)).toEqual([2]);
    expect(changed).toHaveBeenCalledWith(24);
  });

  it('shows a rescheduled row and its new delivery date directly in the tracking table', () => {
    const fixture = TestBed.createComponent(ProductionDeliveryTrackingComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.trackingUpdated(1, { ...purchases[0].delivery_tracking, id: 10, revision: 1, expected_on: '2026-12-15', reschedules_count: 2, received_late: false,
      schedule_history: [
        { id: 1, type: 'created', changes: { expected_on: { before: null, after: '2026-12-10' } } },
        { id: 3, type: 'rescheduled', reason: 'Segundo acuerdo', changes: { expected_on: { before: '2026-12-12', after: '2026-12-15' } } },
        { id: 2, type: 'rescheduled', reason: 'Primer acuerdo', changes: { expected_on: { before: '2026-12-10', after: '2026-12-12' } } },
      ] } as any);
    fixture.detectChanges();
    const cards = Array.from(fixture.nativeElement.querySelectorAll('.delivery-purchase')) as HTMLElement[];
    const card = cards.find(card => card.textContent!.includes('Compra #1'))!;
    const row = card.querySelector('tr.date-rescheduled')!;
    expect(row.querySelector('th')!.textContent).toContain('Reprogramado');
    expect(row.querySelector('td')!.textContent).toContain('15');
    expect(row.querySelector('td')!.textContent).toContain('2026');
    const rows = Array.from(card.querySelectorAll('.delivery-dates-table tbody tr'));
    expect(rows.length).toBe(3);
    expect(rows[0].textContent).toContain('Pendiente');
    expect(rows[0].textContent).toContain('Segundo acuerdo');
    expect(rows[1].textContent).toContain('Primer acuerdo');
    expect(rows[1].textContent).toContain('Reemplazado');
    expect(rows[2].textContent).toContain('Compromiso inicial');
  });

  it('returns from a tracked purchase to its original section', () => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: { snapshot: {
      paramMap: convertToParamMap({ purchase_id: 93 }), queryParamMap: convertToParamMap({ production: 24, returnTo: 'section-tracking', stage: 'costura' }),
    } } });
    const fixture = TestBed.createComponent(PurchaseEditPageComponent);
    expect(fixture.componentInstance.backLink).toEqual(['/', 'sorelle', 'dashboard', 'manufactures', 'productions', 24, 'purchases']);
    expect(fixture.componentInstance.backQuery).toEqual({ stage: 'costura', view: 'process' });
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

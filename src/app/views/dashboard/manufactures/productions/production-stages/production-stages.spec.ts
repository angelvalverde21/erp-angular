import { ManufactureProductionVariantIndexComponent } from '../manufacture-production-edit-page/manufacture-production-variant-index/manufacture-production-variant-index.component';
import { ManufactureProductionKardexIndexComponent } from '../manufacture-production-edit-page/manufacture-production-kardex-index/manufacture-production-kardex-index.component';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';
import { BaseService } from '../../../../base.service';
import { ProductionStage, ProductionStageService } from './production-stage.service';
import { ProductionStagesComponent } from './production-stages.component';
import { ProductionStageStepperComponent } from './production-stage-stepper.component';
import { ProductionStageStatusComponent } from './production-stage-status.component';
import { PurchaseIndexComponent } from '../../../purchases/purchase-index/purchase-index.component';
import { PurchaseCreateComponent } from '../../../purchases/purchase-create/purchase-create.component';
import { SupplierService } from '../../../users/suppliers/supplier.service';
import Swal from 'sweetalert2';
import { ProductionSectionPickerComponent } from './production-section-picker.component';
import { ManufactureProductionCreateComponent } from '../manufacture-production-create/manufacture-production-create.component';
import { ManufactureProductionService } from '../manufacture.production.service';
import { ProductionStageHistoryComponent } from './production-stage-history.component';
import { ManufactureProductionEditPageComponent } from '../manufacture-production-edit-page/manufacture-production-edit-page.component';
import { ManufactureService } from '../../manufacture.service';
import { signal } from '@angular/core';
import { RouterTestingHarness } from '@angular/router/testing';
import { ProductionOverviewComponent } from '../production-overview.component';
import { ManufactureProductionPurchaseIndexComponent } from '../manufacture-production-edit-page/manufacture-production-purchase-index/manufacture-production-purchase-index.component';
import { ManufacturePurchaseService } from '../../manufacture.purchase.service';
import { productionSectionLeaveGuard } from '../production-section-leave.guard';
import { ManufactureProductionIndexRowComponent } from '../manufacture-production-index-row/manufacture-production-index-row.component';

registerLocaleData(localeEsPe);

describe('Production stages', () => {
  const stages: ProductionStage[] = ['molds', 'samples', 'materials', 'cutting', 'sewing', 'finishing'].map((code, index) => ({
    id: index + 1, manufacture_id: 24, code, name: code, status: 'pending', responsible: null, expected_end: null,
    completed_at: null, notes: null, revision: 0, sample_quantity: null, sample_details: null,
    sample_photos: [], sample_review: 'pending', review_notes: null, reviewed_at: null,
    slug: ['moldes-y-ploteo', 'muestras', 'telas-e-insumos', 'corte', 'costura', 'acabados'][index],
    show_in_stepper: true, purchases_count: 1,
    delivery_tracking_default: ['samples', 'sewing'].includes(code),
  }));
  stages.push({ ...stages[0], id: 7, code: 'others', name: 'Otros', slug: 'otros', show_in_stepper: false, delivery_tracking_default: false, status: null });
  let service: jasmine.SpyObj<ProductionStageService>;
  let saved: Subject<any>;

  beforeEach(() => {
    saved = new Subject();
    service = jasmine.createSpyObj('ProductionStageService', ['list', 'save', 'assign', 'classify', 'templates', 'configuration', 'configure', 'attachments'], { changes: new Subject<number>() });
    service.list.and.returnValue(of({ data: structuredClone(stages) }));
    service.save.and.returnValue(saved);
    service.attachments.and.returnValue(of({ data: [] }));
    TestBed.configureTestingModule({ providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: ProductionStageService, useValue: service },
      { provide: SupplierService, useValue: { index: () => of({ data: [] }) } },
      { provide: ActivatedRoute, useValue: { queryParamMap: of(convertToParamMap({})), snapshot: { queryParamMap: convertToParamMap({}) } } },
    ] });
  });

  function setup() {
    const fixture = TestBed.createComponent(ProductionStagesComponent);
    fixture.componentRef.setInput('productionId', 24);
    fixture.componentRef.setInput('purchases', [
      { id: 11, production_stage_id: 1, items: [{ id: 1, name: 'Ploteo', quantity: 2, price: 10 }] },
      { id: 12, production_stage_id: 3, items: [{ id: 2, name: 'Tela', quantity: 3, price: 20 }] },
      { id: 13, production_stage_id: null, items: [{ id: 3, name: 'Anterior', quantity: 1, price: 5 }] },
    ]);
    fixture.detectChanges();
    return fixture;
  }

  it('replaces the process tab with purchase tracking and keeps completion fixed without a stage data tab', () => {
    const fixture = setup();
    expect(fixture.nativeElement.querySelector('#section-tab-process').textContent).toContain('Seguimiento');
    expect(fixture.nativeElement.querySelector('#section-panel-process app-production-delivery-tracking')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.section-tabs button').id).toBe('section-tab-purchases');
    expect(fixture.nativeElement.querySelector('#section-tab-details')).toBeNull();
    expect(fixture.nativeElement.querySelector('.workspace-heading > p')).toBeNull();
    const finish = fixture.nativeElement.querySelector('.stage-finish-action') as HTMLButtonElement;
    expect(finish.classList.contains('btn-dark')).toBeTrue();
    expect(getComputedStyle(finish.closest('.stage-finish-footer')!).position).toBe('fixed');
    finish.click();
    expect(fixture.nativeElement.querySelector('.stage-dialog').open).toBeTrue();
    fixture.componentInstance.closeCompletion();
  });

  it('opens the existing production products in a dedicated Cutting tab', async () => {
    const params = convertToParamMap({ stage: 'corte', view: 'products' });
    TestBed.overrideProvider(ActivatedRoute, { useValue: { queryParamMap: of(params), snapshot: { queryParamMap: params } } });
    const fixture = setup();
    expect(fixture.nativeElement.querySelector('#section-panel-products').hidden).toBeFalse();
    expect(fixture.nativeElement.querySelector('#section-panel-details app-manufacture-production-variant-index')).toBeNull();
    const products = fixture.debugElement.query(By.directive(ManufactureProductionVariantIndexComponent)).componentInstance as ManufactureProductionVariantIndexComponent;
    expect(products.manufacture_id).toBe(24);
    expect(fixture.nativeElement.querySelectorAll('app-manufacture-production-variant-index').length).toBe(1);
    fixture.componentInstance.setTab('purchases', false); fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(ManufactureProductionVariantIndexComponent)).componentInstance).toBe(products);
    await fixture.componentInstance.select('costura'); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#section-tab-products')).toBeNull();
    expect(fixture.nativeElement.querySelector('#section-panel-purchases').hidden).toBeFalse();
  });

  it('includes the complete reception workspace with inputs, outputs and ledger in Reception', () => {
    const reception = { ...stages[0], id: 8, code: 'reception', name: 'Recepcion', slug: 'recepcion', manual_status: true };
    const loaded = new Subject<{ data: ProductionStage[] }>();
    service.list.and.returnValue(loaded);
    const params = convertToParamMap({ stage: 'recepcion', view: 'purchases' });
    TestBed.overrideProvider(ActivatedRoute, { useValue: { queryParamMap: of(params), snapshot: { queryParamMap: params } } });
    const fixture = setup();
    loaded.next({ data: [...stages, reception] }); loaded.complete(); fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('#section-panel-receptions');
    expect(panel.hidden).toBeFalse();
    expect(fixture.componentInstance.activeTab).toBe('receptions');
    expect(fixture.nativeElement.querySelector('.section-tabs')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-purchase-index')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-production-delivery-tracking')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-production-stage-history')).toBeNull();
    expect(fixture.componentInstance.purchaseStages.some(stage => stage.code === 'reception')).toBeFalse();
    expect(panel.querySelector('.inventory-action--in').textContent).toContain('Registrar ingreso');
    expect(panel.querySelector('.inventory-action--out').textContent).toContain('Registrar salida');
    expect(panel.querySelector('app-inventory-reception-index')).not.toBeNull();
    expect(panel.querySelector('app-kardex-history')).not.toBeNull();
    const workspace = fixture.debugElement.query(By.directive(ManufactureProductionKardexIndexComponent)).componentInstance as ManufactureProductionKardexIndexComponent;
    expect(workspace.production_id).toBe(24);
    expect(fixture.nativeElement.querySelector('#section-panel-details app-manufacture-production-kardex-index')).toBeNull();
  });

  it('keeps purchase counts as secondary information on every card', () => {
    const fixture = TestBed.createComponent(ProductionStageStepperComponent);
    fixture.componentRef.setInput('stages', stages.map(stage => ({ ...stage, purchases_count: stage.id === 1 ? 3 : 0 })));
    fixture.detectChanges();
    const counts = fixture.nativeElement.querySelectorAll('.step-purchase-count');
    expect(counts.length).toBe(6);
    expect(counts[0].textContent.trim()).toBe('3 compras');
    expect(counts[1].textContent.trim()).toBe('0 compras');
  });

  it('blocks completion without purchases in the stage', () => {
    const fixture = TestBed.createComponent(ProductionStageStatusComponent);
    fixture.componentRef.setInput('stage', { ...stages[0], purchases_count: 0 });
    fixture.componentRef.setInput('productionId', 24);
    fixture.componentRef.setInput('completionAction', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.stage-complete-action').disabled).toBeTrue();
    const menu = jasmine.createSpyObj('menu', ['close', 'open']);
    fixture.componentInstance.complete(menu);
    fixture.componentInstance.save('completed', menu);
    expect(service.save).not.toHaveBeenCalled();
  });

  it('renders all eight navigation cards including reception and others', () => {
    const fixture = TestBed.createComponent(ProductionStageStepperComponent);
    const expanded = [...stages.slice(0, 6),
      { ...stages[0], id: 8, code: 'reception', name: 'Recepción de mercadería', slug: 'recepcion', manual_status: true },
      { ...stages[6], status: 'pending', show_in_stepper: true, manual_status: true },
    ];
    fixture.componentRef.setInput('stages', expanded);
    fixture.componentRef.setInput('selectedId', 7);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.stage-step').length).toBe(8);
    expect(fixture.nativeElement.querySelector('.stage-step.selected').textContent).toContain('Otros');
    expect(fixture.nativeElement.querySelector('.stage-context').textContent).toContain('8 de 8');
    expect(fixture.nativeElement.querySelectorAll('.stage-stepper button').length).toBe(8);
    expect(fixture.nativeElement.querySelector('.step-guidance')).toBeNull();
    for (const [width, columns] of [[390, 4], [1440, 4]]) {
      const frame = document.createElement('iframe');
      frame.style.width = `${width}px`;
      document.body.appendChild(frame);
      try {
        const doc = frame.contentDocument!;
        for (const style of Array.from(document.head.querySelectorAll('style'))) doc.head.appendChild(style.cloneNode(true));
        doc.body.appendChild(fixture.nativeElement.cloneNode(true));
        const grid = doc.querySelector('.stage-stepper')!;
        const tracks = frame.contentWindow!.getComputedStyle(grid).gridTemplateColumns.split(' ');
        expect(tracks.length).withContext(`Columnas a ${width}px`).toBe(columns);
        expect(doc.documentElement.scrollWidth).withContext(`Sin desbordamiento a ${width}px`).toBeLessThanOrEqual(doc.documentElement.clientWidth);
        const card = doc.querySelector('.stage-step')!;
        expect(card.getBoundingClientRect().height).withContext(`Tarjeta legible a ${width}px`).toBeLessThan(width > 1000 ? 180 : 260);
        expect(parseFloat(frame.contentWindow!.getComputedStyle(doc.querySelector('.step-title strong')!).fontSize)).toBeGreaterThanOrEqual(width > 1000 ? 15 : 13);
      } finally { frame.remove(); }
    }
    const choose = spyOn(fixture.componentInstance.choose, 'emit');
    fixture.nativeElement.querySelectorAll('.stage-step-link')[6].click();
    expect(choose).toHaveBeenCalledOnceWith(8);
  });

  it('allows completing sewing without any cutting context', () => {
    const fixture = TestBed.createComponent(ProductionStageStatusComponent);
    fixture.componentRef.setInput('stage', { ...stages[4], locked: false });
    fixture.componentRef.setInput('productionId', 24);
    fixture.detectChanges();
    const menu = jasmine.createSpyObj('menu', ['close', 'open']);
    expect(fixture.nativeElement.querySelector('.stage-status-button').disabled).toBeFalse();
    fixture.componentInstance.select('completed', menu);
    expect(service.save).toHaveBeenCalledOnceWith(24, 'costura', { status: 'completed', revision: 0 });
  });

  it('allows an independent status for others without requiring a purchase', () => {
    const fixture = TestBed.createComponent(ProductionStageStatusComponent);
    fixture.componentRef.setInput('stage', { ...stages[6], status: 'pending', revision: 3, manual_status: true, purchases_count: 0 });
    fixture.componentRef.setInput('productionId', 24);
    fixture.detectChanges();
    const menu = jasmine.createSpyObj('menu', ['close', 'open']);
    fixture.componentInstance.select('completed', menu);
    expect(service.save).toHaveBeenCalledOnceWith(24, 'otros', { status: 'completed', revision: 3 });
  });

  it('saves a stage status with its current revision and blocks duplicate requests', () => {
    const fixture = TestBed.createComponent(ProductionStageStatusComponent);
    fixture.componentRef.setInput('stage', structuredClone(stages[0]));
    fixture.componentRef.setInput('productionId', 24);
    fixture.detectChanges();
    const menu = jasmine.createSpyObj('menu', ['close', 'open']);
    fixture.componentInstance.select('in_progress', menu);
    fixture.componentInstance.select('completed', menu);
    expect(service.save).toHaveBeenCalledOnceWith(24, 'moldes-y-ploteo', { status: 'in_progress', revision: 0 });
    saved.next({ data: { ...stages[0], status: 'in_progress', revision: 1 } });
    saved.complete();
    expect(menu.close).toHaveBeenCalled();
    expect(fixture.componentInstance.saving).toBeFalse();
  });

  it('requires explicit sample approval before completing samples and keeps errors visible', () => {
    const fixture = TestBed.createComponent(ProductionStageStatusComponent);
    fixture.componentRef.setInput('stage', structuredClone(stages[1]));
    fixture.componentRef.setInput('productionId', 24);
    fixture.detectChanges();
    const menu = jasmine.createSpyObj('menu', ['close', 'open']);
    fixture.componentInstance.select('completed', menu);
    expect(fixture.componentInstance.reviewing).toBeTrue();
    fixture.componentInstance.save('completed', menu);
    expect(service.save).not.toHaveBeenCalled();
    fixture.componentInstance.quantity = 2;
    fixture.componentInstance.save('completed', menu);
    expect(service.save).toHaveBeenCalledOnceWith(24, 'muestras', { status: 'completed', revision: 0, sample_quantity: 2, sample_review: 'approved' });
    saved.error({ error: { errors: { revision: ['Recarga la etapa.'] } } });
    expect(fixture.componentInstance.error).toContain('Recarga');
    expect(fixture.componentInstance.saving).toBeFalse();
    expect(menu.close).not.toHaveBeenCalled();
  });

  it('shows expenses only in their selected stage and keeps unclassified purchases visible', async () => {
    const fixture = setup();
    expect(fixture.componentInstance.total).toBe(85);
    expect(fixture.componentInstance.stagePurchases.map(purchase => purchase.id)).toEqual([11]);
    expect(fixture.componentInstance.unclassified.map(purchase => purchase.id)).toEqual([13]);
    await fixture.componentInstance.select(3);
    fixture.detectChanges();
    expect(fixture.componentInstance.stagePurchases.map(purchase => purchase.id)).toEqual([12]);
    const list: PurchaseIndexComponent = fixture.debugElement.query(By.directive(PurchaseIndexComponent)).componentInstance;
    expect(list.productionStageId).toBe(3);
    expect(list.productionSections.map(section => section.code)).toEqual(['molds', 'samples', 'materials', 'cutting', 'sewing', 'finishing', 'others']);
    expect(list.purchaseable_id).toBe(24);
    expect(fixture.componentInstance.selected?.status).toBe('pending');
    list.purchasesChanged.emit([{ id: 14, production_stage_id: 3, items: [{ quantity: 1, price: 7 }] }]);
    expect(fixture.componentInstance.total).toBe(32);
  });

  it('suggests tracking for samples and sewing, while materials remain optional', async () => {
    const fixture = setup();
    await fixture.componentInstance.select(2);
    expect(fixture.componentInstance.deliveryDefault).toBeTrue();
    await fixture.componentInstance.select(5);
    expect(fixture.componentInstance.deliveryDefault).toBeTrue();
    await fixture.componentInstance.select(3);
    expect(fixture.componentInstance.deliveryDefault).toBeFalse();
  });

  it('keeps a newly registered purchase in its corrected section and confirms its destination', async () => {
    const fixture = setup(); await fixture.componentInstance.select(3); fixture.detectChanges();
    const list = fixture.debugElement.query(By.directive(PurchaseIndexComponent)).componentInstance as PurchaseIndexComponent;
    list.modal = { close: jasmine.createSpy('close') };
    list.receivePurchaseCreate({ id: 99, production_stage_id: 7, items: [{ name: 'Estibadores', quantity: 2, price: 15 }] });
    fixture.detectChanges();
    expect(fixture.componentInstance.stagePurchases.map(purchase => purchase.id)).toEqual([12]);
    expect(fixture.componentInstance.purchases.filter(purchase => purchase.id === 99).length).toBe(1);
    expect(fixture.componentInstance.total).toBe(115);
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Compra registrada en Otros gastos');
    await fixture.componentInstance.select(7); fixture.detectChanges();
    expect(fixture.componentInstance.stagePurchases.map(purchase => purchase.id)).toEqual([99]);
  });

  it('keeps the sample draft after rejection and sends sample data separately from the production lot', async () => {
    const fixture = setup();
    await fixture.componentInstance.select(2);
    const form = fixture.componentInstance.form;
    form.patchValue({ status: 'completed', sample_quantity: 3, sample_details: 'S, M, L', sample_review: 'approved' });
    form.markAsDirty();
    fixture.componentInstance.save();
    expect(service.save).toHaveBeenCalledWith(24, 'muestras', jasmine.objectContaining({ sample_quantity: 3, revision: 0, sample_review: 'approved' }));
    saved.error({ error: { errors: { sample_review: ['Revisa las muestras.'] } } });
    fixture.detectChanges();
    expect(form.value.sample_quantity).toBe(3);
    expect(form.dirty).toBeTrue();
    expect(fixture.componentInstance.error).toContain('Revisa las muestras');
    expect(fixture.componentInstance.total).toBe(85);
  });

  it('passes the selected stage into a new purchase form', () => {
    const fixture = TestBed.createComponent(PurchaseCreateComponent);
    fixture.componentRef.setInput('production_stage_id', 5);
    fixture.componentRef.setInput('purchaseable_type', 'manufacture');
    fixture.componentRef.setInput('purchaseable_id', 24);
    fixture.detectChanges();
    expect(fixture.componentInstance.form.value.production_stage_id).toBe(5);
    expect(fixture.componentInstance.form.value.purchaseable_id).toBe(24);
  });

  it('opens sewing directly as an independent section', () => {
    const fixture = TestBed.createComponent(ProductionStageStepperComponent);
    fixture.componentRef.setInput('stages', stages);
    fixture.detectChanges();
    const choose = spyOn(fixture.componentInstance.choose, 'emit');
    const card = fixture.nativeElement.querySelectorAll('.stage-step')[4];
    expect(card.textContent).not.toContain('Bloqueada');
    expect(card.getAttribute('aria-label')).toContain('Pendiente');
    card.click();
    expect(choose).toHaveBeenCalledOnceWith(5);
    expect(card.querySelector('button')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-production-stage-status')).toBeNull();
  });

  it('shows missing sample fields before submitting and offers the next stage after completion', async () => {
    const fixture = setup();
    await fixture.componentInstance.select('muestras'); fixture.detectChanges();
    fixture.componentInstance.save('complete'); fixture.detectChanges();
    expect(service.save).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('#sample-quantity').getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.querySelector('#sample-review-error').textContent).toContain('aprobación');
    fixture.componentInstance.form.patchValue({ sample_quantity: 3, sample_review: 'approved' });
    fixture.componentInstance.form.markAsDirty();
    fixture.componentInstance.save('complete');
    expect(service.save).toHaveBeenCalledOnceWith(24, 'muestras', jasmine.objectContaining({ sample_quantity: 3, sample_review: 'approved', status: 'completed' }));
    fixture.componentInstance.save('complete');
    expect(service.save).toHaveBeenCalledTimes(1);
    saved.next({ data: { ...stages[1], status: 'completed', revision: 1, sample_quantity: 3, sample_review: 'approved' } }); saved.complete();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.pristine).toBeTrue();
    expect(fixture.nativeElement.querySelector('.workspace-success').textContent).toContain('etapa completada');
    expect(fixture.nativeElement.querySelector('.workspace-success button').textContent).toContain('Continuar');
  });

  it('completes a reused mold without requiring a purchase and preserves a rejected draft', () => {
    service.list.and.returnValue(of({ data: stages.map(stage => ({ ...stage, purchases_count: 0 })) }));
    const fixture = setup();
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="reuses_mold"]');
    checkbox.checked = true; checkbox.dispatchEvent(new Event('change')); fixture.detectChanges();
    fixture.componentInstance.save('complete');
    expect(service.save).toHaveBeenCalledOnceWith(24, 'moldes-y-ploteo', jasmine.objectContaining({ reuses_mold: true, status: 'completed' }));
    saved.error({ error: { errors: { revision: ['Otra persona actualizó esta etapa.'] } } }); fixture.detectChanges();
    expect(checkbox.checked).toBeTrue();
    expect(fixture.componentInstance.form.dirty).toBeTrue();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Otra persona');
  });

  it('keeps unsaved stage data when the user cancels navigation', async () => {
    const fixture = setup();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false } as any);
    fixture.componentInstance.form.patchValue({ notes: 'Indicaciones pendientes' });
    fixture.componentInstance.form.markAsDirty();
    await fixture.componentInstance.select('muestras');
    expect(fixture.componentInstance.selected?.code).toBe('molds');
    expect(fixture.componentInstance.form.value.notes).toBe('Indicaciones pendientes');
    expect(navigate).toHaveBeenCalledWith([], jasmine.objectContaining({ queryParams: { stage: 'moldes-y-ploteo', view: 'purchases' }, replaceUrl: true }));
  });

  it('preserves the form draft while a purchase updates the status and revision', () => {
    const fixture = setup();
    fixture.componentInstance.form.patchValue({ notes: 'Mantener estas indicaciones' });
    fixture.componentInstance.form.markAsDirty();
    service.list.and.returnValue(of({ data: stages.map(stage => stage.id === 1 ? { ...stage, status: 'in_progress', revision: 1, purchases_count: 2 } : stage) }));
    service.changes.next(24);
    expect(fixture.componentInstance.form.value.notes).toBe('Mantener estas indicaciones');
    expect(fixture.componentInstance.form.dirty).toBeTrue();
    fixture.componentInstance.save();
    expect(service.save).toHaveBeenCalledWith(24, 'moldes-y-ploteo', jasmine.objectContaining({ notes: 'Mantener estas indicaciones', revision: 1, status: 'in_progress' }));
  });

  it('keeps the stale revision when another person changed editable fields', () => {
    const fixture = setup();
    fixture.componentInstance.form.patchValue({ notes: 'Mi borrador' });
    fixture.componentInstance.form.markAsDirty();
    service.list.and.returnValue(of({ data: stages.map(stage => stage.id === 1 ? { ...stage, notes: 'Cambio de otra persona', revision: 1 } : stage) }));
    service.changes.next(24);
    expect(fixture.componentInstance.form.value.notes).toBe('Mi borrador');
    fixture.componentInstance.save();
    expect(service.save).toHaveBeenCalledWith(24, 'moldes-y-ploteo', jasmine.objectContaining({ notes: 'Mi borrador', revision: 0 }));
  });

  it('starts the review of unclassified expenses through a clear action', async () => {
    service.list.and.returnValue(of({ data: stages.map(stage => stage.code === 'others' ? { ...stage, status: 'pending', manual_status: true, show_in_stepper: true } : stage) }));
    const fixture = setup();
    await fixture.componentInstance.select('otros'); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.stage-finish-action').textContent).toContain('Finalizar este proceso');
    fixture.componentInstance.save('start');
    expect(service.save).toHaveBeenCalledOnceWith(24, 'otros', jasmine.objectContaining({ status: 'in_progress' }));
  });

  it('keeps one back control above the header and advances without requiring completion', async () => {
    const fixture = setup();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const back = fixture.nativeElement.querySelector('.stage-workspace > .production-back') as HTMLButtonElement;
    expect(back.textContent!.trim()).toBe('Retroceder');
    expect(fixture.nativeElement.querySelector('.workspace-config')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.production-back').length).toBe(1);
    back.click();
    expect(navigate).toHaveBeenCalledWith(['../overview'], jasmine.anything());
    await fixture.componentInstance.select('telas-e-insumos'); fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.section-direction button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].getAttribute('aria-label')).toContain('cutting');
    buttons[0].click();
    expect(navigate).toHaveBeenCalledWith([], jasmine.objectContaining({ queryParams: { stage: 'corte', view: 'purchases' } }));
  });

  it('preselects eight sections on creation and preserves the selection if creation fails', () => {
    const options = [...stages, { ...stages[0], id: 8, code: 'reception', name: 'Recepción' }].map(stage => ({ ...stage, purchases_count: 0 }));
    service.templates.and.returnValue(of({ data: options }));
    const store = jasmine.createSpy('store').and.returnValue(saved);
    TestBed.overrideProvider(ManufactureProductionService, { useValue: { store } });
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any);
    const fixture = TestBed.createComponent(ManufactureProductionCreateComponent); fixture.detectChanges();
    expect(fixture.componentInstance.selectedSectionIds.length).toBe(8);
    const picker = fixture.debugElement.query(By.directive(ProductionSectionPickerComponent)).componentInstance as ProductionSectionPickerComponent;
    picker.toggle(options[1], false); fixture.detectChanges();
    fixture.componentInstance.form.patchValue({ name: 'Lote sin muestras' });
    fixture.componentInstance.createProduction();
    expect(store).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Lote sin muestras', stage_ids: [1, 3, 4, 5, 6, 7, 8] }));
    saved.error({ error: { errors: { stage_ids: ['Revisa la selección.'] } } }); fixture.detectChanges();
    expect(fixture.componentInstance.selectedSectionIds).not.toContain(2);
    expect(fixture.componentInstance.form.value.name).toBe('Lote sin muestras');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Revisa la selección');
  });

  it('keeps sewing selected when cutting is removed and only locks sections with purchases', () => {
    const fixture = TestBed.createComponent(ProductionSectionPickerComponent);
    const options = stages.map(stage => ({ ...stage, purchases_count: stage.id === 3 ? 1 : 0 }));
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('selectedIds', options.map(option => option.id)); fixture.detectChanges();
    const emit = spyOn(fixture.componentInstance.selectedIdsChange, 'emit');
    fixture.componentInstance.toggle(options[2], false);
    expect(emit).not.toHaveBeenCalled();
    fixture.componentInstance.toggle(options[3], false);
    expect(emit).toHaveBeenCalledWith([1, 2, 3, 5, 6, 7]);
    fixture.componentRef.setInput('selectedIds', []); fixture.detectChanges();
    expect(fixture.componentInstance.isLocked(options[4])).toBeFalse();
    fixture.componentInstance.toggle(options[4], true);
    expect(emit).toHaveBeenCalledWith([5]);
  });

  it('saves a production-specific selection using its configuration revision', async () => {
    service.configuration.and.returnValue(of({ data: { options: stages.map(stage => ({ ...stage, is_enabled: true, purchases_count: 0 })), revision: 2 } }));
    service.configure.and.returnValue(saved);
    TestBed.overrideProvider(ActivatedRoute, { useValue: { params: of({ production_id: 24 }) } });
    const fixture = TestBed.createComponent(ManufactureProductionEditPageComponent);
    await fixture.componentInstance.manageSections();
    fixture.componentInstance.selectedSectionIds = [1, 3, 4, 5, 6, 7];
    fixture.componentInstance.saveSections();
    fixture.componentInstance.saveSections();
    expect(service.configure).toHaveBeenCalledOnceWith(24, [1, 3, 4, 5, 6, 7], 2);
    saved.error({ error: { errors: { revision: ['Otra persona cambió las secciones.'] } } });
    expect(fixture.componentInstance.sectionError).toContain('Otra persona');
    expect(fixture.componentInstance.selectedSectionIds).not.toContain(2);
    expect(fixture.componentInstance.configuringSections).toBeTrue();
  });

  it('moves to an included section when the current one is removed', async () => {
    const fixture = setup();
    await fixture.componentInstance.select('muestras'); fixture.detectChanges();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    service.list.and.returnValue(of({ data: stages.filter(stage => stage.code !== 'samples') }));
    service.changes.next(24);
    expect(fixture.componentInstance.selected?.code).toBe('molds');
    expect(navigate).toHaveBeenCalledWith([], jasmine.objectContaining({ queryParams: { stage: 'moldes-y-ploteo', view: 'purchases' } }));
  });

  it('shows only the selected subsection and preserves a process draft across tabs', async () => {
    const fixture = setup();
    await fixture.componentInstance.select('muestras'); fixture.detectChanges();
    fixture.componentInstance.form.patchValue({ sample_quantity: 4, sample_details: 'Borrador de muestras' });
    fixture.componentInstance.form.markAsDirty();
    fixture.componentInstance.setTab('history', false); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#section-panel-process').hidden).toBeTrue();
    expect(fixture.nativeElement.querySelector('#section-panel-purchases').hidden).toBeTrue();
    expect(fixture.nativeElement.querySelector('#section-panel-history').hidden).toBeFalse();
    fixture.componentInstance.openCompletion(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#sample-quantity').value).toBe('4');
    expect(fixture.componentInstance.form.value.sample_details).toBe('Borrador de muestras');
    expect(fixture.componentInstance.form.dirty).toBeTrue();
    fixture.componentInstance.closeCompletion();
  });

  it('navigates directly from the section dropdown and keeps its current selection until navigation completes', () => {
    const fixture = setup();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#section-switch');
    expect(select.options.length).toBe(stages.length);
    select.value = '3'; select.dispatchEvent(new Event('change'));
    expect(navigate).toHaveBeenCalledWith([], jasmine.objectContaining({ queryParams: { stage: 'telas-e-insumos', view: 'purchases' } }));
    expect(select.value).toBe('1');
  });

  it('keeps the dropdown synchronized with a directly opened section and aligns readable controls', () => {
    const params = convertToParamMap({ stage: 'telas-e-insumos' });
    TestBed.overrideProvider(ActivatedRoute, { useValue: { queryParamMap: of(params), snapshot: { queryParamMap: params } } });
    const fixture = setup();
    expect(fixture.componentInstance.selected?.code).toBe('materials');
    expect(fixture.nativeElement.querySelector('#section-switch').value).toBe('3');
    service.changes.next(24); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#section-switch').value).toBe('3');
    for (const width of [390, 1440]) {
      const frame = document.createElement('iframe'); frame.style.width = `${width}px`; document.body.appendChild(frame);
      try {
        const doc = frame.contentDocument!;
        for (const style of Array.from(document.head.querySelectorAll('style'))) doc.head.appendChild(style.cloneNode(true));
        doc.body.style.cssText = 'margin:0;padding:16px';
        doc.body.appendChild(fixture.nativeElement.querySelector('.workspace-chrome').cloneNode(true));
        doc.querySelectorAll('.section-tabpanel').forEach(panel => panel.remove());
        const chrome = doc.querySelector('.workspace-chrome')!;
        expect(chrome.querySelector('.production-back')).toBeNull();
        expect(chrome.getBoundingClientRect().height).toBeLessThan(width === 1440 ? 200 : 310);
        const select = doc.querySelector('#section-switch')!;
        const buttons = Array.from(doc.querySelectorAll('.section-direction button'));
        expect(parseFloat(frame.contentWindow!.getComputedStyle(select).fontSize)).toBeGreaterThanOrEqual(14);
        expect(select.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
        for (const button of buttons) {
          expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
          if (width === 1440) expect(Math.abs(button.getBoundingClientRect().bottom - select.getBoundingClientRect().bottom)).toBeLessThan(2);
        }
        expect(doc.documentElement.scrollWidth).withContext(`Sin desbordamiento a ${width}px`).toBeLessThanOrEqual(doc.documentElement.clientWidth);
      } finally { frame.remove(); }
    }
  });

  it('protects a dirty process when leaving the section and blocks leaving during save', async () => {
    const fixture = setup();
    expect(await fixture.componentInstance.canLeaveSection()).toBeTrue();
    const confirm = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false } as any);
    fixture.componentInstance.form.markAsDirty();
    expect(await fixture.componentInstance.canLeaveSection()).toBeFalse();
    fixture.componentInstance.saving = true;
    expect(await fixture.componentInstance.canLeaveSection()).toBeFalse();
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it('renders real stage changes and only purchases associated with that stage in chronological order', () => {
    const fixture = TestBed.createComponent(ProductionStageHistoryComponent);
    fixture.componentRef.setInput('stage', { ...stages[0], events: [
      { id: 1, created_at: '2026-11-20T15:00:00Z', user: { name: 'Ana' }, changes: { responsible: { before: null, after: 'Taller Norte' } } },
      { id: 2, created_at: '2026-11-20T18:00:00Z', user: { name: 'Luis' }, changes: { status: { before: 'in_progress', after: 'completed' }, notes: { before: '', after: '<script>unsafe</script>' } } },
    ] });
    fixture.componentRef.setInput('purchases', [
      { id: 11, production_stage_id: 1, created_at: '2026-11-20T16:00:00Z' },
      { id: 12, production_stage_id: 3, created_at: '2026-11-20T19:00:00Z' },
    ]); fixture.detectChanges();
    const titles = [...fixture.nativeElement.querySelectorAll('.work-timeline h4')].map((element: any) => element.textContent);
    expect(titles).toEqual(['Proceso completado', 'Compra #11 creada', 'Responsable actualizado']);
    expect(fixture.nativeElement.textContent).toContain('Luis');
    expect(fixture.nativeElement.textContent).toContain('En proceso');
    expect(fixture.nativeElement.textContent).toContain('Finalizada');
    expect(fixture.nativeElement.querySelector('script')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Compra #12');
  });

  it('shows an empty history without inventing past activity', () => {
    const fixture = TestBed.createComponent(ProductionStageHistoryComponent);
    fixture.componentRef.setInput('stage', { ...stages[0], status: 'completed', events: [] }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Aún no hay movimientos');
    expect(fixture.nativeElement.querySelector('.work-timeline')).toBeNull();
  });

  it('hides the production header, totals and menu when opening the section workspace', () => {
    const params = convertToParamMap({});
    TestBed.overrideProvider(ActivatedRoute, { useValue: { params: of({ production_id: 24 }), queryParamMap: of(params), snapshot: { queryParamMap: params } } });
    TestBed.overrideProvider(ManufactureService, { useValue: {
      manufactureSingnalEvent: signal(null), summaryEvent: signal(null), setManufacture: jasmine.createSpy(),
      overview: () => of({ data: { id: 24, name: 'Producción de prueba', sum_purchases: 100, sum_variants: 10, sum_kardexes: 0 } }),
    } });
    const router = TestBed.inject(Router);
    let url = '/sorelle/dashboard/manufactures/productions/24/overview';
    spyOnProperty(router, 'url', 'get').and.callFake(() => url);
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);
    const fixture = TestBed.createComponent(ManufactureProductionEditPageComponent); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-production-stage-stepper')).not.toBeNull();
    fixture.componentInstance.openStage(1);
    expect(navigate).toHaveBeenCalledWith(['purchases'], jasmine.objectContaining({ queryParams: { stage: 'moldes-y-ploteo', view: 'purchases' } }));
    url = '/sorelle/dashboard/manufactures/productions/24/purchases?stage=moldes-y-ploteo'; fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.production-header')).toBeNull();
    expect(fixture.nativeElement.querySelector('.production-summary-strip')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-production-stage-stepper')).toBeNull();
    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });

  it('opens the production panel from both the list name and primary action', () => {
    TestBed.overrideProvider(BaseService, { useValue: { store: 'sorelle', storeName: 'sorelle' } });
    const fixture = TestBed.createComponent(ManufactureProductionIndexRowComponent);
    fixture.componentRef.setInput('production', { id: 24, name: 'Lote de prueba' }); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.manufacture-row-open').getAttribute('href')).toBe('/sorelle/dashboard/manufactures/productions/24/overview');
    expect(fixture.nativeElement.querySelector('.production-name').getAttribute('href')).toBe('/sorelle/dashboard/manufactures/productions/24/overview');
  });

  it('keeps the selected stage context and filters pending purchases by all concepts', () => {
    const fixture = setup();
    const list: PurchaseIndexComponent = fixture.debugElement.query(By.directive(PurchaseIndexComponent)).componentInstance;
    expect(list.stageName).toBe('molds');
    expect(list.deliveryDefault).toBeFalse();
    expect(fixture.nativeElement.querySelectorAll('.stage-group-card').length).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('.stage-classify-row').length).toBe(1);
    fixture.componentInstance.showAllPurchases = true;
    fixture.componentInstance.purchaseSearch = 'tela';
    fixture.detectChanges();
    expect(fixture.componentInstance.classificationPurchases.map(purchase => purchase.id)).toEqual([12]);
    expect(fixture.nativeElement.querySelectorAll('.stage-classify-row').length).toBe(1);
  });

  it('moves classified purchases into their group and updates the pending count', () => {
    const fixture = setup();
    const purchases = fixture.componentInstance.purchases.map(purchase => ({
      ...purchase, production_stage_id: purchase.id === 13 ? 1 : purchase.production_stage_id,
    }));
    service.classify.and.returnValue(of({ data: { assigned: 1, remaining: 0, purchases } }));
    fixture.componentInstance.classify();
    fixture.detectChanges();
    expect(service.classify).toHaveBeenCalledOnceWith(24);
    expect(fixture.componentInstance.stagePurchases.map(purchase => purchase.id)).toEqual([11, 13]);
    expect(fixture.componentInstance.unclassified.length).toBe(0);
    expect(fixture.componentInstance.total).toBe(85);
    expect(fixture.nativeElement.querySelector('.stage-classification-callout')).toBeNull();
  });

  it('preserves purchases when automatic classification fails and allows retry', () => {
    const fixture = setup();
    const response = new Subject<any>();
    service.classify.and.returnValue(response);
    fixture.componentInstance.classify();
    expect(fixture.componentInstance.assigning).toBeTrue();
    fixture.componentInstance.classify();
    expect(service.classify).toHaveBeenCalledTimes(1);
    response.error({ status: 500 });
    fixture.detectChanges();
    expect(fixture.componentInstance.assigning).toBeFalse();
    expect(fixture.componentInstance.unclassified.length).toBe(1);
    expect(fixture.nativeElement.querySelector('.stage-classification-message').textContent).toContain('No se pudieron clasificar');
  });

  it('uses text, icons and distinct states without a percentage in the stepper', () => {
    const fixture = TestBed.createComponent(ProductionStageStepperComponent);
    fixture.componentRef.setInput('stages', stages.map((stage, index) => ({ ...stage, status: index === 0 ? 'completed' : index === 1 ? 'in_progress' : 'pending' })));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.stage-step').length).toBe(6);
    expect(fixture.nativeElement.querySelector('.completed .step-status').textContent).toContain('Completado');
    expect(fixture.nativeElement.querySelector('.in_progress').textContent).toContain('En proceso');
    expect(fixture.nativeElement.textContent).not.toContain('%');
    expect(fixture.nativeElement.textContent).not.toContain('Otros');
  });

  it('opens other expenses by slug without stage progress and includes them in the total', async () => {
    const fixture = setup();
    const purchases = [...fixture.componentInstance.purchases, { id: 20, production_stage_id: 7, items: [{ quantity: 2, price: 35, name: 'Estibadores' }] }];
    fixture.componentRef.setInput('purchases', purchases);
    await fixture.componentInstance.select('otros');
    fixture.detectChanges();
    expect(fixture.componentInstance.total).toBe(155);
    expect(fixture.componentInstance.stagePurchases.map(purchase => purchase.id)).toEqual([20]);
    expect(fixture.nativeElement.querySelector('.stage-tracking')).toBeNull();
    expect(fixture.componentInstance.deliveryDefault).toBeFalse();
    fixture.componentInstance.form.markAsDirty();
    fixture.componentInstance.save();
    expect(service.save).not.toHaveBeenCalled();
  });

  it('opens other expenses from the stepper header without selecting a process step', () => {
    const fixture = TestBed.createComponent(ProductionStageStepperComponent);
    fixture.componentRef.setInput('stages', stages);
    fixture.componentRef.setInput('otherExpenses', { id: 7, count: 3 });
    fixture.componentRef.setInput('selectedId', 4);
    fixture.detectChanges();
    const choose = spyOn(fixture.componentInstance.choose, 'emit');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.stage-other-expenses');
    expect(button.textContent).toContain('Otros gastos');
    expect(button.textContent).toContain('3');
    button.click();
    expect(choose).toHaveBeenCalledOnceWith(7);
    fixture.componentRef.setInput('selectedId', 7);
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.querySelector('.stage-step.selected')).toBeNull();
    expect(fixture.nativeElement.querySelector('.stage-context')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.stage-step').length).toBe(6);
  });
});

describe('Production section routing', () => {
  beforeEach(() => {
    const stages = [
      { id: 1, manufacture_id: 24, code: 'molds', slug: 'moldes-y-ploteo', name: 'Moldes y ploteo', status: 'pending', revision: 0, purchases_count: 0, events: [] },
      { id: 2, manufacture_id: 24, code: 'samples', slug: 'muestras', name: 'Muestras', status: 'pending', revision: 0, purchases_count: 0, events: [] },
    ];
    TestBed.configureTestingModule({ providers: [
      provideRouter([{ path: '', pathMatch: 'full', component: ProductionOverviewComponent }, { path: ':production_id', component: ManufactureProductionEditPageComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'overview' },
        { path: 'overview', component: ProductionOverviewComponent },
        { path: 'purchases', component: ManufactureProductionPurchaseIndexComponent, canDeactivate: [productionSectionLeaveGuard] },
        ...['variants', 'kardexes', 'deliveries', 'details'].map(path => ({ path, component: ProductionOverviewComponent })),
      ] }]),
      provideHttpClient(), provideHttpClientTesting(),
      { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: ManufactureService, useValue: {
        manufactureSingnalEvent: signal(null), summaryEvent: signal(null), setManufacture: jasmine.createSpy(), setSummary: jasmine.createSpy(),
        overview: () => of({ data: { id: 24, name: 'Lote de prueba', sum_purchases: 0, sum_variants: 0, sum_kardexes: 0 } }),
      } },
      { provide: ProductionStageService, useValue: { changes: new Subject<number>(), focusRequests: new Subject<number>(), list: () => of({ data: structuredClone(stages) }), configuration: () => of({ data: { options: stages.map(stage => ({ ...stage, is_enabled: true })), revision: 2 } }), configure: jasmine.createSpy().and.returnValue(of({ data: {} })) } },
      { provide: ManufacturePurchaseService, useValue: { setManufactureId: jasmine.createSpy(), index: () => of({ data: [] }) } },
      { provide: SupplierService, useValue: { index: () => of({ data: [] }) } },
    ] });
  });

  it('configures production sections only from their menu', async () => {
    const harness = await RouterTestingHarness.create('/24/overview');
    (harness.routeNativeElement!.querySelector('.stage-configure') as HTMLButtonElement).click();
    await harness.fixture.whenStable(); harness.detectChanges();
    const page = harness.fixture.debugElement.query(By.directive(ManufactureProductionEditPageComponent)).componentInstance as ManufactureProductionEditPageComponent;
    expect(harness.routeNativeElement!.querySelector('.stage-flow .section-configuration')).not.toBeNull();
    page.selectedSectionIds = [1];
    page.saveSections();
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(TestBed.inject(ProductionStageService).configure).toHaveBeenCalledWith(24, [1], 2);
    expect(harness.routeNativeElement!.querySelector('.section-configuration')).toBeNull();
    await harness.navigateByUrl('/24/purchases?stage=muestras');
    expect(harness.routeNativeElement!.querySelector('.stage-configure')).toBeNull();
    expect(harness.routeNativeElement!.querySelector('.workspace-config')).toBeNull();
  });

  it('opens a focused workspace from the menu and supports direct links to its history', async () => {
    const harness = await RouterTestingHarness.create('/24');
    expect(harness.routeNativeElement!.querySelector('.stage-stepper')).not.toBeNull();
    expect(harness.routeNativeElement!.querySelectorAll('.stage-configure').length).toBe(1);
    (harness.routeNativeElement!.querySelectorAll('.stage-step')[1] as HTMLButtonElement).click();
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(TestBed.inject(Router).url).toContain('stage=muestras');
    expect((harness.routeNativeElement!.querySelector('#section-panel-purchases') as HTMLElement).hidden).toBeFalse();
    expect(harness.routeNativeElement!.querySelector('.stage-stepper')).toBeNull();
    expect(harness.routeNativeElement!.querySelector('.production-summary-strip')).toBeNull();
    expect(harness.routeNativeElement!.querySelector('#stage-workspace-heading')!.textContent).toContain('Muestras');
    await harness.navigateByUrl('/24/purchases?stage=muestras&view=history');
    expect((harness.routeNativeElement!.querySelector('#section-panel-history') as HTMLElement).hidden).toBeFalse();
    expect(harness.routeNativeElement!.textContent).toContain('Aún no hay movimientos');
    const switcher = harness.routeNativeElement!.querySelector('#section-switch') as HTMLSelectElement;
    switcher.value = '1'; switcher.dispatchEvent(new Event('change'));
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('#stage-workspace-heading')!.textContent).toContain('Moldes y ploteo');
    expect((harness.routeNativeElement!.querySelector('#section-panel-purchases') as HTMLElement).hidden).toBeFalse();
    (harness.routeNativeElement!.querySelector('.production-back') as HTMLButtonElement).click();
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/24/overview');
    expect(harness.routeNativeElement!.querySelector('.stage-stepper')).not.toBeNull();
  });

  it('keeps the focused route and draft when leaving is cancelled', async () => {
    const harness = await RouterTestingHarness.create('/24/purchases?stage=muestras');
    const workspace = harness.fixture.debugElement.query(By.directive(ProductionStagesComponent)).componentInstance as ProductionStagesComponent;
    workspace.form.patchValue({ sample_details: 'Conservar el borrador' }); workspace.form.markAsDirty();
    const confirm = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false } as any);
    (harness.routeNativeElement!.querySelector('.production-back') as HTMLButtonElement).click();
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(TestBed.inject(Router).url).toContain('/purchases');
    expect(workspace.form.value.sample_details).toBe('Conservar el borrador');
    confirm.and.resolveTo({ isConfirmed: true } as any);
    (harness.routeNativeElement!.querySelector('.production-back') as HTMLButtonElement).click();
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('.stage-stepper')).not.toBeNull();
  });

  it('integrates a single back link in the header of every auxiliary view', async () => {
    const harness = await RouterTestingHarness.create('/24/variants');
    for (const path of ['variants', 'kardexes', 'deliveries', 'details']) {
      await harness.navigateByUrl('/24/' + path);
      const root = harness.routeNativeElement!;
      const back = root.querySelector('.production-header .production-back') as HTMLAnchorElement;
      expect(root.querySelectorAll('.production-back').length).toBe(1);
      expect(root.querySelector('.production-location')).toBeNull();
      expect(root.querySelector('.production-list-link')).toBeNull();
      expect(back.textContent!.trim()).toBe('Retroceder');
      expect(back.getAttribute('href')).toBe('/24/overview');
      back.click();
      await harness.fixture.whenStable(); harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe('/24/overview');
      expect(root.querySelector('.stage-stepper')).not.toBeNull();
      expect(root.querySelector('.production-back')).toBeNull();
    }
  });
});

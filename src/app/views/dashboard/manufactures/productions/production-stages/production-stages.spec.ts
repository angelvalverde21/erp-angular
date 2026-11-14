import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
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
    service = jasmine.createSpyObj('ProductionStageService', ['list', 'save', 'assign', 'classify'], { changes: new Subject<number>() });
    service.list.and.returnValue(of({ data: structuredClone(stages) }));
    service.save.and.returnValue(saved);
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

  it('shows the purchase count above every step icon', () => {
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

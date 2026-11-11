import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';
import { BaseService } from '../../../../base.service';
import { ProductionStageService } from './production-stage.service';
import { ProductionStagesComponent } from './production-stages.component';
import { ProductionStageStepperComponent } from './production-stage-stepper.component';
import { PurchaseIndexComponent } from '../../../purchases/purchase-index/purchase-index.component';
import { PurchaseCreateComponent } from '../../../purchases/purchase-create/purchase-create.component';
import { SupplierService } from '../../../users/suppliers/supplier.service';
import Swal from 'sweetalert2';

registerLocaleData(localeEsPe);

describe('Production stages', () => {
  const stages = ['molds', 'samples', 'materials', 'cutting', 'sewing', 'finishing'].map((code, index) => ({
    id: index + 1, manufacture_id: 24, code, name: code, status: 'pending', responsible: null, expected_end: null,
    completed_at: null, notes: null, revision: 0, sample_quantity: null, sample_details: null,
    sample_photos: [], sample_review: 'pending', review_notes: null, reviewed_at: null,
  }));
  let service: jasmine.SpyObj<ProductionStageService>;
  let saved: Subject<any>;

  beforeEach(() => {
    saved = new Subject();
    service = jasmine.createSpyObj('ProductionStageService', ['list', 'save', 'assign']);
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

  it('keeps the sample draft after rejection and sends sample data separately from the production lot', async () => {
    const fixture = setup();
    await fixture.componentInstance.select(2);
    const form = fixture.componentInstance.form;
    form.patchValue({ status: 'completed', sample_quantity: 3, sample_details: 'S, M, L', sample_review: 'approved' });
    form.markAsDirty();
    fixture.componentInstance.save();
    expect(service.save).toHaveBeenCalledWith(24, 2, jasmine.objectContaining({ sample_quantity: 3, revision: 0, sample_review: 'approved' }));
    saved.error({ error: { errors: { sample_review: ['Revisa las muestras.'] } } });
    fixture.detectChanges();
    expect(form.value.sample_quantity).toBe(3);
    expect(form.dirty).toBeTrue();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Revisa las muestras');
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

  it('uses text, icons and distinct states without a percentage in the stepper', () => {
    const fixture = TestBed.createComponent(ProductionStageStepperComponent);
    fixture.componentRef.setInput('stages', stages.map((stage, index) => ({ ...stage, status: index === 0 ? 'completed' : index === 1 ? 'in_progress' : 'pending' })));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.stage-step').length).toBe(6);
    expect(fixture.nativeElement.querySelector('.completed').textContent).toContain('Finalizada');
    expect(fixture.nativeElement.querySelector('.in_progress').textContent).toContain('En proceso');
    expect(fixture.nativeElement.textContent).not.toContain('%');
  });
});

import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subject, throwError } from 'rxjs';
import { PurchaseEditComponent } from '../purchase-edit/purchase-edit.component';
import { PurchaseCreateComponent } from '../purchase-create/purchase-create.component';
import { PurchaseService } from '../purchase.service';
import { SupplierService } from '../../users/suppliers/supplier.service';
import { BaseService } from 'src/app/views/base.service';
import { ManufactureService } from '../../manufactures/manufacture.service';
import { ManufacturePurchaseService } from '../../manufactures/manufacture.purchase.service';
import { ManufactureProductionPurchaseIndexComponent } from '../../manufactures/productions/manufacture-production-edit-page/manufacture-production-purchase-index/manufacture-production-purchase-index.component';
import { PurchaseIndexHeadComponent } from './purchase-index-head/purchase-index-head.component';
import { PurchaseIndexComponent } from './purchase-index.component';
import { ProductionStageService } from '../../manufactures/productions/production-stages/production-stage.service';

registerLocaleData(localeEsPe);

describe('Purchase editor', () => {
  let service: jasmine.SpyObj<PurchaseService>;
  const purchase = {
    id: 89, purchase_start: '2026-11-01', purchase_end: '2026-11-20', supplier_id: null, observations: '',
    items: [{ name: 'Tela', quantity: 2, unit_id: 1, price: 10, subtotal: 20 }],
  };

  beforeEach(() => {
    service = jasmine.createSpyObj('PurchaseService', ['get', 'update']);
    service.get.and.returnValue(of({ data: structuredClone(purchase) }));
    TestBed.configureTestingModule({ providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: PurchaseService, useValue: service },
      { provide: SupplierService, useValue: { index: () => of({ data: [] }) } },
    ] });
  });

  function setup() {
    const fixture = TestBed.createComponent(PurchaseEditComponent);
    fixture.componentRef.setInput('purchase_id', 89);
    fixture.componentRef.setInput('purchaseable_type', 'manufacture');
    fixture.componentRef.setInput('purchaseable_id', 24);
    fixture.detectChanges();
    return fixture;
  }

  it('loads editable concepts and recalculates the footer total from quantity and price', () => {
    const fixture = setup();
    expect(service.get).toHaveBeenCalledWith(89);
    expect(fixture.componentInstance.totalAmount).toBe(20);
    fixture.componentInstance.purchase_items.at(0).get('quantity')!.setValue(3);
    fixture.detectChanges();
    expect(fixture.componentInstance.purchase_items.at(0).get('subtotal')!.value).toBe(30);
    expect(fixture.componentInstance.totalAmount).toBe(30);
    expect(fixture.nativeElement.querySelector('.purchase-editor-save').disabled).toBeFalse();
  });

  it('keeps errors and the draft in the editor and permits retry after failed saves', () => {
    const fixture = setup();
    const pending = new Subject<any>();
    service.update.and.returnValue(pending);
    const emit = spyOn(fixture.componentInstance.emitPurchaseUpdated, 'emit');
    fixture.componentInstance.update();
    fixture.componentInstance.update();
    expect(service.update).toHaveBeenCalledTimes(1);
    pending.error({ error: { errors: { purchase_items: ['Revisa los conceptos.'] } } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Revisa los conceptos');
    expect(fixture.componentInstance.loadingIcon).toBeFalse();
    expect(fixture.componentInstance.purchase_items.at(0).get('name')!.value).toBe('Tela');
    expect(emit).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.purchase-editor-save').disabled).toBeFalse();
  });

  it('rejects empty concepts and leaves cancel available without submitting', () => {
    const fixture = setup();
    fixture.componentInstance.purchase_items.at(0).get('name')!.setValue('');
    fixture.componentInstance.update();
    expect(service.update).not.toHaveBeenCalled();
    const cancelled = spyOn(fixture.componentInstance.cancelled, 'emit');
    fixture.nativeElement.querySelector('.purchase-editor-cancel').click();
    expect(cancelled).toHaveBeenCalledTimes(1);
  });

  it('offers a reload action when the purchase cannot be loaded', () => {
    service.get.and.returnValue(throwError(() => ({ status: 500 })));
    const fixture = setup();
    expect(fixture.componentInstance.loading).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('No se pudo cargar la compra');
    expect(fixture.nativeElement.querySelector('.purchase-editor-save').disabled).toBeTrue();
    service.get.and.returnValue(of({ data: structuredClone(purchase) }));
    fixture.nativeElement.querySelector('.purchase-editor-error button').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.totalAmount).toBe(20);
  });
});

describe('Production expenses', () => {
  let open: jasmine.Spy;
  let close: jasmine.Spy;
  let setSummary: jasmine.Spy;
  let setManufactureId: jasmine.Spy;
  const purchases = [
    { id: 11, supplier: { user: { name: 'Textiles Norte' } }, items: [
      { id: 1, name: 'Tela', quantity: '2', price: '10.50', subtotal: '999.00', unit: { name: 'Metros' } },
      { id: 2, name: 'Transporte', quantity: 1, price: '5.00' },
    ] },
    { id: 12, items: [{ id: 3, name: 'Hilos', quantity: 3, price: '4.00' }] },
  ];

  beforeEach(async () => {
    close = jasmine.createSpy('close');
    open = jasmine.createSpy('open').and.returnValue({ close });
    setSummary = jasmine.createSpy('setSummary');
    setManufactureId = jasmine.createSpy('setManufactureId');
    await TestBed.configureTestingModule({
      imports: [PurchaseIndexComponent, ManufactureProductionPurchaseIndexComponent],
      providers: [
        provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
        { provide: BaseService, useValue: { store: 'sorelle' } },
        { provide: NgbModal, useValue: { open } },
        { provide: ManufactureService, useValue: { setSummary } },
        { provide: ManufacturePurchaseService, useValue: { setManufactureId, index: () => of({ data: structuredClone(purchases) }) } },
        { provide: ProductionStageService, useValue: { changes: new Subject<number>(), list: () => of({ data: [{ id: 1, code: 'materials', name: 'Telas e insumos', status: 'pending', sample_review: 'pending' }] }) } },
        { provide: ActivatedRoute, useValue: { parent: { paramMap: of(convertToParamMap({ production_id: '41' })) }, queryParamMap: of(convertToParamMap({})), snapshot: { queryParamMap: convertToParamMap({}) } } },
      ],
    }).compileComponents();
  });

  function createList() {
    const fixture = TestBed.createComponent(PurchaseIndexComponent);
    fixture.componentRef.setInput('productionView', true);
    fixture.componentRef.setInput('purchases', structuredClone(purchases));
    fixture.componentRef.setInput('purchaseable_type', 'manufacture');
    fixture.componentRef.setInput('purchaseable_id', 41);
    fixture.detectChanges();
    return fixture;
  }

  it('shows the accumulated expense and computes item amounts from quantity and price', () => {
    const fixture = createList();
    expect(fixture.componentInstance.sum_purchases).toBe(38);
    expect(fixture.componentInstance.conceptCount).toBe(3);
    expect(fixture.nativeElement.querySelector('.production-expenses-total').textContent).toMatch(/38[.,]00/);
    const firstRow = fixture.nativeElement.querySelector('.production-expense-table tbody tr');
    expect(firstRow.lastElementChild.textContent).toMatch(/21[.,]00/);
    expect(fixture.nativeElement.textContent).toContain('Compra sin proveedor');
    const card = fixture.nativeElement.querySelector('.production-expense-card');
    expect(card.querySelector('.production-expense-card-header .production-expense-amount')).toBeNull();
    expect(card.querySelector('.production-expense-delivery .production-expense-amount').textContent).toContain('Importe total');
    expect(card.querySelector('.delivery-card-header.delivery-actions-first .delivery-start-button')).not.toBeNull();
  });

  it('keeps all purchase concepts visible without accordion controls', () => {
    const fixture = createList();
    const detailCards = fixture.nativeElement.querySelectorAll('.production-expense-details');
    expect(detailCards.length).toBe(2);
    expect(fixture.nativeElement.querySelector('details.production-expense-details')).toBeNull();
    expect(detailCards[0].textContent).toContain('Tela');
    expect(detailCards[1].textContent).toContain('Hilos');
    expect(fixture.nativeElement.querySelectorAll('.production-expense-body').length).toBe(2);
  });

  it('preserves editing and receipts actions with unique menu identifiers', () => {
    const fixture = createList();
    const heads = fixture.debugElement.queryAll(By.directive(PurchaseIndexHeadComponent));
    const head: PurchaseIndexHeadComponent = heads[0].componentInstance;
    expect(head.purchaseable_type).toBe('manufacture');
    expect(head.purchaseable_id).toBe(41);
    expect(head.actionsOnly).toBeTrue();
    const buttons = heads[0].nativeElement.querySelectorAll('.dropdown-menu button');
    expect(buttons[0].textContent).toContain('Editar');
    expect(buttons[1].textContent).toContain('Boletas y Facturas');
    expect(buttons[2].textContent).toContain('Eliminar');
    buttons[0].click();
    expect(open).toHaveBeenCalledWith(jasmine.anything(), { centered: true, size: 'xl' });
    expect(heads[0].nativeElement.querySelector('[ngbDropdownToggle]').id).toBe('purchase-actions-11');
    expect(heads[1].nativeElement.querySelector('[ngbDropdownToggle]').id).toBe('purchase-actions-12');
  });

  it('updates totals once after editing, deleting and adding receipts', () => {
    const fixture = createList();
    const emit = spyOn(fixture.componentInstance.emitSumPurchases, 'emit');
    const heads = fixture.debugElement.queryAll(By.directive(PurchaseIndexHeadComponent));
    const edited = structuredClone(purchases[0]);
    edited.items[0].quantity = '3';
    heads[0].componentInstance.emitPurchaseUpdated.emit(edited);
    expect(emit).toHaveBeenCalledOnceWith(48.5);
    emit.calls.reset();
    heads[1].componentInstance.emitRemovePurchase.emit(12);
    expect(emit).toHaveBeenCalledOnceWith(36.5);
    emit.calls.reset();
    fixture.nativeElement.querySelector('.production-expense-primary').click();
    fixture.componentInstance.receivePurchaseCreate({ id: 13, items: [{ id: 4, quantity: 2, price: 7 }] });
    expect(close).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledOnceWith(50.5);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.production-expenses-total').textContent).toMatch(/50[.,]50/);
  });

  it('recalculates when refreshed purchases arrive and offers an action for the empty state', () => {
    const fixture = createList();
    fixture.componentRef.setInput('purchases', []);
    fixture.detectChanges();
    expect(fixture.componentInstance.sum_purchases).toBe(0);
    expect(fixture.componentInstance.conceptCount).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Aún no hay compras ni gastos');
    fixture.nativeElement.querySelector('.production-expenses-empty button').click();
    expect(open).toHaveBeenCalledTimes(1);
  });

  it('keeps the standard purchase layout as the default for other screens', () => {
    const fixture = TestBed.createComponent(PurchaseIndexComponent);
    fixture.componentRef.setInput('purchases', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.production-expenses')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('No hay compras registradas');
  });

  it('loads the production context and keeps its cost summary connected', () => {
    const fixture = TestBed.createComponent(ManufactureProductionPurchaseIndexComponent);
    fixture.detectChanges();
    const list: PurchaseIndexComponent = fixture.debugElement.query(By.directive(PurchaseIndexComponent)).componentInstance;
    expect(setManufactureId).toHaveBeenCalledWith(41);
    expect(list.productionView).toBeTrue();
    expect(list.purchaseable_id).toBe(41);
    expect(setSummary).toHaveBeenCalledWith({ sum_purchases: 38 });
  });
});

describe('Purchase registration', () => {
  let service: jasmine.SpyObj<PurchaseService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('PurchaseService', ['store']);
    TestBed.configureTestingModule({ providers: [
      { provide: PurchaseService, useValue: service },
      { provide: SupplierService, useValue: { index: () => of({ data: [] }) } },
    ] });
  });

  function setup(deliveryDefault = false) {
    const fixture = TestBed.createComponent(PurchaseCreateComponent);
    fixture.componentRef.setInput('purchaseable_type', 'manufacture');
    fixture.componentRef.setInput('purchaseable_id', 24);
    fixture.componentRef.setInput('production_stage_id', 2);
    fixture.componentRef.setInput('deliveryDefault', deliveryDefault);
    fixture.componentInstance.ngOnInit();
    return fixture.componentInstance;
  }

  it('requires a tentative delivery date in sections with delivery enabled by default', () => {
    const component = setup(true);
    component.purchase_items.at(0).patchValue({ name: 'Muestra', quantity: 2, price: 15, subtotal: 30 });
    expect(component.form.invalid).toBeTrue();
    component.form.get('delivery.expected_on')?.setValue('2026-11-20');
    expect(component.form.valid).toBeTrue();
    expect(component.totalAmount).toBe(30);
    component.purchase_items.clear();
    expect(component.form.invalid).toBeTrue();
  });

  it('retains the draft after a failed request and permits retrying', () => {
    const component = setup();
    component.purchase_items.at(0).patchValue({ name: 'Tela', quantity: 3, price: 10, subtotal: 30 });
    service.store.and.returnValue(throwError(() => ({ error: {} })));
    component.create();
    expect(component.error).toContain('Tus datos se mantienen');
    expect(component.loadingIcon).toBeFalse();
    expect(component.purchase_items.at(0).value.name).toBe('Tela');
    service.store.and.returnValue(of({ data: { id: 101 } }));
    spyOn(component.emitPurchaseCreate, 'emit');
    component.create();
    expect(component.emitPurchaseCreate.emit).toHaveBeenCalledWith({ id: 101 });
  });

  it('prevents duplicate requests and preserves the production section', () => {
    const component = setup();
    component.purchase_items.at(0).patchValue({ name: 'Tela', quantity: 3, price: 10, subtotal: 30 });
    const pending = new Subject<any>();
    service.store.and.returnValue(pending);
    component.create();
    component.create();
    expect(service.store).toHaveBeenCalledTimes(1);
    expect(service.store.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ production_stage_id: 2, purchaseable_id: 24 }));
    pending.complete();
    expect(component.loadingIcon).toBeFalse();
  });
});

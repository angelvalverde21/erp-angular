import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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
import { SupplierSelectedComponent } from '../../users/suppliers/supplier-selected/supplier-selected.component';
import { PurchaseFormComponent } from '../purchase-form/purchase-form.component';
import { FormControl, FormGroup } from '@angular/forms';
import { todayInLima } from '@shared/components/delivery-tracking/delivery-tracking.model';

registerLocaleData(localeEsPe);

describe('Purchase suppliers', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [
    provideHttpClient(), provideHttpClientTesting(), { provide: BaseService, useValue: { store: 'sorelle' } },
  ] }));
  it('shows nested and flattened suppliers arriving after initialization and preserves the selected supplier ID', async () => {
    const fixture = TestBed.createComponent(SupplierSelectedComponent);
    fixture.componentInstance.writeValue(12);
    fixture.detectChanges();
    fixture.componentRef.setInput('suppliers', [
      { id: 12, user: { id: 91, name: 'Textiles Norte', document_number: '20123456789' } },
      { id: 13, name: 'Taller Sur', phone: '999888777' },
    ]);
    fixture.detectChanges();
    await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Textiles Norte');
    expect(fixture.componentInstance.supplier_id).toBe(12);
    expect(fixture.componentInstance.options.map(option => option.name)).toEqual(['Textiles Norte', 'Taller Sur']);
    const change = jasmine.createSpy('change');
    fixture.componentInstance.registerOnChange(change);
    fixture.componentInstance.setSupplier(13);
    expect(change).toHaveBeenCalledWith(13);
    fixture.componentInstance.writeValue(null);
    fixture.detectChanges();
    expect(fixture.componentInstance.supplier_id).toBeNull();
    fixture.destroy();
  });

  it('retains a newly created flattened supplier when the parent form renders again', async () => {
    const fixture = TestBed.createComponent(PurchaseFormComponent);
    const form = new FormGroup({ supplier_id: new FormControl<number | null>(null), purchase_start: new FormControl(''), purchase_end: new FormControl(''), observations: new FormControl('') });
    fixture.componentRef.setInput('form', form);
    fixture.componentRef.setInput('suppliers', [{ id: 1, user: { name: 'Proveedor existente' } }]);
    fixture.detectChanges();
    fixture.componentInstance.supplierReceiveCreate({ id: 7, name: 'Nuevo proveedor' });
    fixture.detectChanges();
    await fixture.whenStable(); fixture.detectChanges();
    expect(form.controls.supplier_id.value).toBe(7);
    expect(form.controls.supplier_id.dirty).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Nuevo proveedor');
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    fixture.destroy();
  });
});

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

  it('opens saved purchase details and respects the user closing them while editing', () => {
    const fixture = setup();
    const details = fixture.nativeElement.querySelector('details') as HTMLDetailsElement;
    expect(details.open).toBeTrue();
    details.open = false;
    fixture.componentInstance.form.get('observations')!.setValue('Nueva referencia');
    fixture.detectChanges();
    expect(details.open).toBeFalse();
    fixture.destroy();
  });

  it('keeps the edit accordion closed when no optional purchase data was saved', () => {
    service.get.and.returnValue(of({ data: { ...purchase, purchase_start: null, purchase_end: null, supplier_id: null, supplier_address_id: null, observations: '', delivery_tracking: null } }));
    const fixture = setup();
    expect(fixture.nativeElement.querySelector('details').open).toBeFalse();
    fixture.destroy();
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
    expect(card.querySelector('app-delivery-tracking')).toBeNull();
    expect(card.querySelector('.production-expense-delivery-date')).toBeNull();
  });

  it('shows separate receipt and file counts and updates them without changing purchase totals', () => {
    const fixture = createList();
    fixture.componentRef.setInput('purchases', [{ ...purchases[0], attachments_count: 3, payments: [{ id: 1, images: [{ id: 10 }, { id: 11 }] }, { id: 2, images: [] }] }, purchases[1]]);
    fixture.detectChanges();
    let counters = fixture.nativeElement.querySelectorAll('.production-expense-attachment-counts');
    expect(counters[0].textContent).toContain('2 comprobantes');
    expect(counters[0].textContent).toContain('3 archivos');
    expect(counters[1].textContent).toContain('0 comprobantes');
    expect(counters[1].textContent).toContain('0 archivos');
    const head = fixture.debugElement.queryAll(By.directive(PurchaseIndexHeadComponent))[0].componentInstance as PurchaseIndexHeadComponent;
    head.attachmentsUpdated([{}, {}, {}, {}]);
    head.paymentsUpdated([{ id: 1, images: [{ id: 10 }] }]); fixture.detectChanges();
    counters = fixture.nativeElement.querySelectorAll('.production-expense-attachment-counts');
    expect(counters[0].textContent).toContain('1 comprobante');
    expect(counters[0].textContent).toContain('4 archivos');
    expect(fixture.componentInstance.sum_purchases).toBe(38);
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

  it('shows delivery dates and overdue status in the list without tracking actions', () => {
    const fixture = createList();
    fixture.componentRef.setInput('purchases', [{ ...purchases[0], delivery_tracking: {
      id: 5, expected_on: '2026-12-10', received_on: null, status: 'overdue',
    } }]); fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('.production-expense-delivery');
    expect(footer.textContent).toContain('Entrega prevista');
    expect(footer.textContent).toContain('2026');
    expect(footer.textContent).toContain('Entrega vencida');
    expect(footer.querySelector('.production-expense-delivery-date.overdue')).not.toBeNull();
    expect(footer.querySelector('button')).toBeNull();
    fixture.destroy();
  });

  it('updates the list after changing tracking inside the editor without closing the modal', () => {
    const fixture = createList();
    const head = fixture.debugElement.query(By.directive(PurchaseIndexHeadComponent)).componentInstance as PurchaseIndexHeadComponent;
    head.purchaseLoaded({ ...purchases[0], delivery_tracking: null });
    head.deliveryUpdated({ id: 5, handed_over_on: '2026-11-01', expected_on: '2026-12-10', received_on: '2026-12-09', status: 'received', revision: 1, received_late: false, reschedules_count: 0 });
    fixture.detectChanges();
    expect(head.editorReady).toBeTrue();
    expect(close).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.production-expense-delivery-date.received').textContent).toContain('Recibida');
    expect(fixture.componentInstance.purchases[0].delivery_tracking.received_on).toBe('2026-12-09');
    fixture.destroy();
  });

  it('opens delivery from the date row in the real edit template without duplicate buttons or nested forms', () => {
    const fixture = createList();
    const head = fixture.debugElement.query(By.directive(PurchaseIndexHeadComponent));
    (head.nativeElement.querySelector('.dropdown-menu button') as HTMLButtonElement).click();
    const view = open.calls.mostRecent().args[0].createEmbeddedView({ $implicit: { dismiss: () => {} } });
    const host = document.createElement('div');
    view.rootNodes.forEach((node: Node) => host.appendChild(node)); view.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.match(request => request.url.endsWith('/suppliers')).forEach(request => request.flush({ data: [] }));
    http.expectOne(request => request.url.endsWith('/purchases/11')).flush({ data: {
      ...purchases[0], supplier_id: null, purchase_start: '2026-11-19', purchase_end: null, delivery_tracking: null,
    } });
    view.detectChanges();
    const toggle = host.querySelector('.purchase-delivery-toggle') as HTMLButtonElement;
    expect(toggle.textContent).toContain('Añadir entrega');
    toggle.click(); view.detectChanges();
    expect(host.querySelector('.purchase-edit-delivery-collapse.expanded')).not.toBeNull();
    expect(host.querySelector('.delivery-start-button')).toBeNull();
    const editor = host.querySelector('.delivery-editor')!;
    expect(editor).not.toBeNull();
    expect(editor.tagName).toBe('DIV');
    expect(host.querySelector('form form')).toBeNull();
    const dateRow = host.querySelector('.purchase-date-controls')!;
    const deliveryPanel = host.querySelector('#purchase-edit-delivery')!;
    const observations = host.querySelector('#purchase-observations')!;
    expect(dateRow.parentElement!.contains(deliveryPanel)).toBeTrue();
    expect(deliveryPanel.compareDocumentPosition(observations) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    toggle.click(); view.detectChanges();
    expect(host.querySelector('.purchase-edit-delivery-collapse.expanded')).toBeNull();
    toggle.click(); view.detectChanges();
    const expected = host.querySelector('.delivery-editor input[formControlName="expected_on"]') as HTMLInputElement;
    expected.value = '2026-12-10'; expected.dispatchEvent(new Event('input')); view.detectChanges();
    (host.querySelector('.delivery-primary') as HTMLButtonElement).click();
    const request = http.expectOne(candidate => candidate.url.endsWith('/delivery-trackings') && candidate.method === 'POST');
    expect(request.request.body.expected_on).toBe('2026-12-10');
    expect(request.request.body.trackable_id).toBe(11);
    http.expectNone(candidate => candidate.url.endsWith('/purchases/11') && candidate.method === 'PUT');
    request.flush({ data: { id: 55, handed_over_on: '2026-11-19', expected_on: '2026-12-10', received_on: null, status: 'pending', revision: 0, received_late: false, reschedules_count: 0 } });
    view.detectChanges();
    expect(fixture.componentInstance.purchases[0].delivery_tracking.id).toBe(55);
    view.destroy(); fixture.destroy();
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
    expect(buttons[2].textContent).toContain('Archivos adjuntos');
    expect(buttons[3].textContent).toContain('Eliminar');
    buttons[0].click();
    expect(open).toHaveBeenCalledWith(jasmine.anything(), { centered: true, size: 'xl' });
    buttons[2].click();
    expect(open).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({ size: 'lg', scrollable: true, beforeDismiss: jasmine.any(Function) }));
    const dismiss = open.calls.mostRecent().args[1].beforeDismiss;
    head.attachmentsBusy = true; expect(dismiss()).toBeFalse();
    head.attachmentsBusy = false; expect(dismiss()).toBeTrue();
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
      provideHttpClient(), provideHttpClientTesting(),
      { provide: BaseService, useValue: { store: 'sorelle' } },
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

  function sectionForm(stage: number | null = 3) {
    const fixture = TestBed.createComponent(PurchaseCreateComponent);
    fixture.componentRef.setInput('purchaseable_type', 'manufacture');
    fixture.componentRef.setInput('purchaseable_id', 24);
    fixture.componentRef.setInput('production_stage_id', stage);
    fixture.componentRef.setInput('productionSections', [
      { id: 2, code: 'samples', name: 'Muestras', delivery_tracking_default: true },
      { id: 3, code: 'materials', name: 'Telas e insumos', delivery_tracking_default: false },
      { id: 5, code: 'sewing', name: 'Costura', delivery_tracking_default: true },
      { id: 7, code: 'others', name: 'Otros', delivery_tracking_default: false },
    ]);
    fixture.detectChanges();
    return fixture;
  }

  it('adds delivery dates next to the purchase date, suggests today and preserves changes when collapsed', () => {
    const fixture = sectionForm();
    const component = fixture.componentInstance;
    const delivery = component.form.get('delivery') as FormGroup;
    expect(component.form.get('purchase_end')?.value).toBeNull();
    expect(fixture.nativeElement.querySelector('#purchase-end')).toBeNull();
    expect(delivery.get('handed_over_on')?.value).toBe(todayInLima());
    const button = fixture.nativeElement.querySelector('.purchase-delivery-toggle') as HTMLButtonElement;
    expect(button.textContent).toContain('Añadir entrega');
    button.click(); fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(component.form.invalid).toBeTrue();
    delivery.patchValue({ handed_over_on: '2026-11-17', expected_on: '2026-11-25' });
    button.click(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.delivery-collapse').hasAttribute('inert')).toBeTrue();
    button.click(); fixture.detectChanges();
    expect(delivery.value).toEqual(jasmine.objectContaining({ enabled: true, handed_over_on: '2026-11-17', expected_on: '2026-11-25' }));
    fixture.destroy();
  });

  it('keeps new purchase details closed even when the section suggests tracking by default', () => {
    const fixture = sectionForm(2);
    expect(fixture.nativeElement.querySelector('details').open).toBeFalse();
    expect(fixture.nativeElement.querySelector('summary').textContent).toContain('Completar fecha de entrega');
    expect(fixture.nativeElement.querySelector('.purchase-delivery-toggle').getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelectorAll('app-delivery-setup').length).toBe(1);
    fixture.destroy();
  });

  it('preselects the current section and saves the section corrected in the visible selector', () => {
    const fixture = sectionForm(); const component = fixture.componentInstance;
    const select = fixture.nativeElement.querySelector('#purchase-production-section') as HTMLSelectElement;
    expect(select.selectedOptions[0].textContent).toContain('Telas e insumos');
    const others = Array.from(select.options).find(option => option.textContent?.trim() === 'Otros gastos')!;
    select.value = others.value; select.dispatchEvent(new Event('change')); fixture.detectChanges();
    component.purchase_items.at(0).patchValue({ name: 'Estibadores', quantity: 2, price: 15, subtotal: 30 });
    service.store.and.returnValue(of({ data: { id: 102, production_stage_id: 7 } }));
    component.create();
    expect(service.store).toHaveBeenCalledOnceWith(jasmine.objectContaining({ production_stage_id: 7, purchaseable_id: 24 }));
    fixture.destroy();
  });

  it('requires a section when no current section was supplied and preserves a manual choice after a request fails', () => {
    const fixture = sectionForm(null); const component = fixture.componentInstance;
    component.purchase_items.at(0).patchValue({ name: 'Servicio', quantity: 1, price: 10, subtotal: 10 });
    component.create(); expect(service.store).not.toHaveBeenCalled();
    expect(component.form.get('production_stage_id')?.hasError('required')).toBeTrue();
    component.form.get('production_stage_id')!.setValue(7);
    service.store.and.returnValue(throwError(() => ({ error: {} })));
    component.create();
    expect(component.form.get('production_stage_id')!.value).toBe(7);
    expect(component.purchase_items.at(0).get('name')!.value).toBe('Servicio');
    expect(component.error).toContain('Tus datos se mantienen'); fixture.destroy();
  });

  it('adjusts the delivery suggestion when switching sections and preserves manually entered dates', () => {
    const fixture = sectionForm(); const component = fixture.componentInstance;
    const delivery = component.form.get('delivery')!;
    expect(delivery.get('enabled')!.value).toBeFalse();
    component.form.get('production_stage_id')!.setValue(5);
    expect(delivery.get('enabled')!.value).toBeTrue(); expect(delivery.hasError('expectedDateRequired')).toBeTrue();
    delivery.patchValue({ handed_over_on: '2026-11-18', expected_on: '2026-11-25' }); delivery.markAsDirty();
    component.form.get('production_stage_id')!.setValue(3);
    expect(delivery.value).toEqual(jasmine.objectContaining({ enabled: true, handed_over_on: '2026-11-18', expected_on: '2026-11-25' }));
    delivery.get('enabled')!.setValue(false); component.form.get('production_stage_id')!.setValue(2);
    expect(delivery.get('enabled')!.value).toBeFalse(); fixture.destroy();
  });

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

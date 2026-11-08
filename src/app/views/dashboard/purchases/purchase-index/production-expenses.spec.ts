import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { BaseService } from 'src/app/views/base.service';
import { ManufactureService } from '../../manufactures/manufacture.service';
import { ManufacturePurchaseService } from '../../manufactures/manufacture.purchase.service';
import { ManufactureProductionPurchaseIndexComponent } from '../../manufactures/productions/manufacture-production-edit-page/manufacture-production-purchase-index/manufacture-production-purchase-index.component';
import { PurchaseIndexHeadComponent } from './purchase-index-head/purchase-index-head.component';
import { PurchaseIndexComponent } from './purchase-index.component';

registerLocaleData(localeEsPe);

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
        { provide: ActivatedRoute, useValue: { parent: { paramMap: of(convertToParamMap({ production_id: '41' })) } } },
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
  });

  it('expands the first receipt and leaves later receipts available to unfold', () => {
    const fixture = createList();
    const details: NodeListOf<HTMLDetailsElement> = fixture.nativeElement.querySelectorAll('details');
    expect(details[0].open).toBeTrue();
    expect(details[1].open).toBeFalse();
    details[1].querySelector('summary')!.click();
    expect(details[1].open).toBeTrue();
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

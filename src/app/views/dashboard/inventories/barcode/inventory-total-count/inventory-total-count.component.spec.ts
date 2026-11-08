import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { VariantService } from '../../../products/variants/variant.service';
import { KardexService } from '../../../kardex/kardex.service';
import { InventoryTotalCountComponent } from './inventory-total-count.component';

describe('InventoryTotalCountComponent', () => {
  let fixture: ComponentFixture<InventoryTotalCountComponent>;
  let component: InventoryTotalCountComponent;
  let index: jasmine.Spy;
  let batch: jasmine.Spy;
  let response: Subject<unknown>;
  const first = { id: 1, stock: 4, sku: 'A', product: { id: 10, name: 'Polo' } };
  const second = { id: 2, stock: 2, sku: 'B', product: { id: 11, name: 'Falda' } };

  beforeEach(async () => {
    response = new Subject();
    index = jasmine.createSpy('index').and.callFake((page: number) => of({
      data: [page === 1 ? first : second], meta: { total: 2, last_page: 2 },
    }));
    batch = jasmine.createSpy('batch').and.returnValue(response);
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDenied: false, isDismissed: false });
    await TestBed.configureTestingModule({
      imports: [InventoryTotalCountComponent],
      providers: [{ provide: VariantService, useValue: { index } }, { provide: KardexService, useValue: { batch } }],
    }).compileComponents();
    fixture = TestBed.createComponent(InventoryTotalCountComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
  });

  function confirmAll(): void {
    component.rows.forEach(row => component.markCounted(row));
  }

  it('waits for an explicit start and loads all catalog pages with draft counts at zero', () => {
    expect(index).not.toHaveBeenCalled();
    component.startCount();
    expect(index.calls.allArgs()).toEqual([[1], [2]]);
    expect(component.rows.map(row => row.quantity.value)).toEqual([0, 0]);
    expect(component.rows.map(row => row.initialStock)).toEqual([4, 2]);
    expect(component.counted).toBe(0);
    expect(batch).not.toHaveBeenCalled();
  });

  it('requires every variant to be confirmed, even when filtered out', () => {
    component.startCount();
    component.query = 'Polo';
    component.markCounted(component.rows[0]);
    expect(component.visibleRows.length).toBe(1);
    expect(component.canFinish).toBeFalse();
    component.markCounted(component.rows[1]);
    expect(component.canFinish).toBeTrue();
    component.rows[1].quantity.setValue(1.5);
    expect(component.canFinish).toBeFalse();
  });

  it('applies only the stock differences after confirmation', async () => {
    component.startCount();
    component.rows[1].quantity.setValue(3);
    confirmAll();
    await component.finishCount();
    expect(batch).toHaveBeenCalledOnceWith([
      { variant_id: 1, direction: 'out', quantity: 4, comment: 'Conteo total' },
      { variant_id: 2, direction: 'in', quantity: 1, comment: 'Conteo total' },
    ]);
    response.next({ data: [] });
    response.complete();
    expect(component.finished).toBeTrue();
    expect(component.savedMovements).toBe(2);
  });

  it('keeps the draft when the user cancels final confirmation', async () => {
    component.startCount();
    confirmAll();
    (Swal.fire as jasmine.Spy).and.resolveTo({ isConfirmed: false, isDenied: false, isDismissed: true });
    await component.finishCount();
    expect(batch).not.toHaveBeenCalled();
    expect(component.finished).toBeFalse();
    expect(component.canFinish).toBeTrue();
  });

  it('closes a count with no differences without creating zero-quantity movements', async () => {
    component.startCount();
    component.rows.forEach(row => row.quantity.setValue(row.initialStock));
    confirmAll();
    await component.finishCount();
    expect(batch).not.toHaveBeenCalled();
    expect(component.finished).toBeTrue();
  });

  it('reconciles current stock before retrying an uncertain batch and preserves draft quantities', async () => {
    component.startCount();
    component.rows[1].quantity.setValue(3);
    confirmAll();
    await component.finishCount();
    response.error(new Error('Network error'));
    expect(component.canFinish).toBeFalse();
    expect(component.needsStockReview).toBeTrue();
    index.and.returnValue(of({ data: [{ ...first, stock: 0 }, second], meta: { total: 2, last_page: 1 } }));
    component.startCount(true);
    expect(component.rows.map(row => row.quantity.value)).toEqual([0, 3]);
    expect(component.rows.map(row => row.initialStock)).toEqual([0, 2]);
    expect(component.counted).toBe(0);
    confirmAll();
    batch.and.returnValue(of({ data: [] }));
    await component.finishCount();
    expect(batch.calls.mostRecent().args[0]).toEqual([
      { variant_id: 2, direction: 'in', quantity: 1, comment: 'Conteo total' },
    ]);
  });

  it('rejects an incomplete catalog rather than applying a partial inventory as a total count', () => {
    index.and.returnValue(of({ data: [first], meta: { total: 3, last_page: 1 } }));
    component.startCount();
    expect(component.error).toBeTruthy();
    expect(component.rows.length).toBe(0);
    expect(component.canFinish).toBeFalse();
  });

  it('requires fresh stock when another mode changes inventory during a total count', () => {
    component.startCount();
    confirmAll();
    expect(component.canFinish).toBeTrue();
    component.markStockChanged();
    expect(component.needsStockReview).toBeTrue();
    expect(component.canFinish).toBeFalse();
    expect(component.rows.length).toBe(2);
  });
});

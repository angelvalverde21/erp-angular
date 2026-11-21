import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { InventoryReceptionService } from '../inventory-reception.service';
import { InventoryReceptionIndexComponent } from './inventory-reception-index.component';

describe('Reception documents', () => {
  let service: jasmine.SpyObj<InventoryReceptionService>;
  const receipt = { id: 1, number: 1, received_on: '2026-11-18', notes: 'Entrega parcial', receiver: { name: 'Marina' }, reversed_at: null,
    items: [{ id: 1, product_name: 'Blusa Fresa', sku: 'FRESA-S', quantity: 3, options: [{ name: 'size', value: 'S' }] }] };
  beforeEach(() => {
    service = jasmine.createSpyObj('InventoryReceptionService', ['list', 'reverse', 'post', 'pdf']);
    service.list.and.returnValue(of({ data: [receipt], current_page: 1, last_page: 1 } as any));
    TestBed.configureTestingModule({ providers: [{ provide: InventoryReceptionService, useValue: service }] });
  });
  function setup() {
    const fixture = TestBed.createComponent(InventoryReceptionIndexComponent);
    fixture.componentRef.setInput('manufactureId', 24); fixture.detectChanges(); return fixture;
  }
  it('shows the document, recorded responsible user, partial quantities and immutable item details', () => {
    const fixture = setup(); const text = fixture.nativeElement.textContent;
    expect(service.list).toHaveBeenCalledWith(24, 1);
    for (const value of ['Recepción N.º 1', 'Marina', 'Entrega parcial', 'Blusa Fresa', 'FRESA-S', '3']) expect(text).toContain(value);
    fixture.destroy();
  });
  it('alternates by product and color while keeping all available sizes in the same band', () => {
    const items = ['Coco', 'Coco', 'Coco', 'Fresa', 'Fresa', 'Pistacho'].map((color, index) => ({
      id: index + 1, product_id: 7, product_name: 'Blusa Barquillo', quantity: 1, sku: `BLUSA-${index}`,
      options: [{ name: 'size', value: ['S', 'M', 'L'][index % 3] }, { name: 'color', value: color }],
    }));
    service.list.and.returnValue(of({ data: [{ ...receipt, items }], current_page: 1, last_page: 1 } as any));
    const fixture = setup(); const rows = [...fixture.nativeElement.querySelectorAll('.reception-items > div')] as HTMLElement[];
    expect(rows.map(row => row.classList.contains('reception-item-striped'))).toEqual([false, false, false, true, true, false]);
    expect(rows.map(row => row.classList.contains('reception-item-group-start'))).toEqual([true, false, false, true, false, true]);
    fixture.destroy();
  });
  it('requires a reason, prevents double reversal and notifies the ledger on success', () => {
    const fixture = setup(); const component = fixture.componentInstance;
    const pending = new Subject<any>(); service.reverse.and.returnValue(pending);
    const changed = spyOn(component.changed, 'emit'); component.startReversal(1); component.reverse();
    expect(service.reverse).not.toHaveBeenCalled();
    component.reason = 'Cantidades equivocadas'; component.reverse(); component.reverse();
    expect(service.reverse).toHaveBeenCalledOnceWith(24, 1, 'Cantidades equivocadas');
    pending.next({}); pending.complete(); expect(changed).toHaveBeenCalledTimes(1); expect(component.reversingId).toBeNull(); fixture.destroy();
  });
  it('preserves the correction reason and shows a stock validation failure', () => {
    const fixture = setup(); const component = fixture.componentInstance;
    service.reverse.and.returnValue(throwError(() => ({ error: { errors: { reason: ['Stock insuficiente.'] } } })));
    component.startReversal(1); component.reason = 'Ingreso equivocado'; component.reverse(); fixture.detectChanges();
    expect(component.reason).toBe('Ingreso equivocado'); expect(component.saving).toBeFalse();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Stock insuficiente.'); fixture.destroy();
  });
  it('identifies reconstructed receipts without inventing their original responsible user', () => {
    service.list.and.returnValue(of({ data: [{ ...receipt, receiver: undefined, is_historical: true, stock_applied: false }], current_page: 1, last_page: 1 } as any));
    const fixture = setup();
    expect(fixture.nativeElement.textContent).toContain('Histórica · Desde kardex');
    expect(fixture.nativeElement.textContent).toContain('Responsable: No registrado');
    fixture.componentInstance.startReversal(1); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('conservará ese stock'); fixture.destroy();
  });
  it('keeps a saved receipt pending until its inventory confirmation is explicitly reviewed', () => {
    const draft = { ...receipt, status: 'draft', revision: 2 };
    service.list.and.returnValue(of({ data: [draft], current_page: 1, last_page: 1 } as any));
    const fixture = setup(); const component = fixture.componentInstance;
    expect(fixture.nativeElement.textContent).toContain('Guardada · Pendiente de ingreso');
    expect(fixture.nativeElement.textContent).toContain('Editar recepción');
    expect(fixture.nativeElement.textContent).toContain('Confirmar ingreso al kardex');
    expect(fixture.nativeElement.textContent).not.toContain('Revertir recepción completa');
    component.post(draft as any); expect(service.post).not.toHaveBeenCalled();
    component.requestPost(1); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.reception-posting').textContent).toContain('3 unidades');
    const pending = new Subject<any>(); service.post.and.returnValue(pending);
    const changed = spyOn(component.changed, 'emit'); component.post(draft as any); component.post(draft as any);
    expect(service.post).toHaveBeenCalledOnceWith(24, 1, 2);
    pending.next({}); pending.complete(); expect(changed).toHaveBeenCalledTimes(1); fixture.destroy();
  });
  it('displays the document number instead of the database id and explains why posting is already complete', () => {
    service.list.and.returnValue(of({ data: [{ ...receipt, id: 65, number: 2, status: 'posted' }], current_page: 1, last_page: 1 } as any));
    const fixture = setup();
    expect(fixture.nativeElement.textContent).toContain('Recepción N.º 2');
    expect(fixture.nativeElement.textContent).not.toContain('#65');
    const posted = fixture.nativeElement.querySelector('.reception-posted-info') as HTMLButtonElement;
    expect(posted.disabled).toBeTrue(); expect(posted.textContent).toContain('Ingreso confirmado en kardex');
    expect(service.post).not.toHaveBeenCalled(); fixture.destroy();
  });
});

import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { KardexService } from '../kardex.service';
import { KardexRegisterInComponent } from './kardex-register-in.component';
import { InventoryReceptionService } from '../../inventory-receptions/inventory-reception.service';

describe('Inventory reception registration', () => {
  let service: jasmine.SpyObj<KardexService>;
  let receptions: jasmine.SpyObj<InventoryReceptionService>;
  beforeEach(() => {
    service = jasmine.createSpyObj('KardexService', ['batch']);
    receptions = jasmine.createSpyObj('InventoryReceptionService', ['save', 'updateDraft', 'post', 'pdf']);
    TestBed.configureTestingModule({ providers: [{ provide: KardexService, useValue: service }, { provide: InventoryReceptionService, useValue: receptions }] });
  });
  function setup(reception?: any) {
    const fixture = TestBed.createComponent(KardexRegisterInComponent);
    fixture.componentRef.setInput('kardexable_type', 'manufacture'); fixture.componentRef.setInput('kardexable_id', 24);
    fixture.componentRef.setInput('variants', [{ id: 1, sku: 'BLUSA-S', product: { name: 'Blusa' }, option_values: [] }]);
    if (reception) { fixture.componentRef.setInput('documentReception', true); fixture.componentRef.setInput('reception', reception); }
    fixture.detectChanges();
    return fixture;
  }
  function select(fixture: ReturnType<typeof setup>) {
    const input = fixture.nativeElement.querySelector('.entry-quantity-cell input') as HTMLInputElement;
    input.value = '2'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
  }

  it('registers the selected variants once, locks editing and publishes the resulting movements', () => {
    const fixture = setup(); select(fixture); const component = fixture.componentInstance;
    const pending = new Subject<any>(); service.batch.and.returnValue(pending);
    const emit = spyOn(component.emitKardexes, 'emit'); const saving = spyOn(component.saving, 'emit');
    component.registerIn(); component.registerIn(); fixture.detectChanges();
    expect(service.batch).toHaveBeenCalledOnceWith([{ variant_id: 1, quantity: 2, comment: 'Recepcion', direction: 'in', kardexable_type: 'manufacture', kardexable_id: 24 }]);
    expect((fixture.nativeElement.querySelector('.entry-submit') as HTMLButtonElement).disabled).toBeTrue();
    expect((fixture.nativeElement.querySelector('.entry-quantity-cell input') as HTMLInputElement).readOnly).toBeTrue();
    pending.next({ data: [{ id: 100, quantity: 2, direction: 'in' }] }); pending.complete();
    expect(emit).toHaveBeenCalledWith([{ id: 100, quantity: 2, direction: 'in' }]);
    expect(saving.calls.allArgs()).toEqual([[true], [false]]);
    expect(component.variantsKardex[0].direction).toBeUndefined(); fixture.destroy();
  });

  it('retains entered quantities on failure and permits retrying', () => {
    const fixture = setup(); select(fixture); const component = fixture.componentInstance;
    service.batch.and.returnValue(throwError(() => ({ error: {} })));
    component.registerIn(); fixture.detectChanges();
    expect(component.loading).toBeFalse(); expect(component.totalQuantity).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Las cantidades se mantienen');
    expect((fixture.nativeElement.querySelector('.entry-quantity-cell input') as HTMLInputElement).value).toBe('2');
    service.batch.and.returnValue(of({ data: [{ id: 101 }] })); component.registerIn();
    expect(service.batch).toHaveBeenCalledTimes(2); fixture.destroy();
  });

  it('prevents empty submissions and allows cancelling without registering movements', () => {
    const fixture = setup(); const component = fixture.componentInstance;
    component.registerIn(); expect(service.batch).not.toHaveBeenCalled();
    const cancel = spyOn(component.cancelled, 'emit');
    (fixture.nativeElement.querySelector('.entry-cancel') as HTMLButtonElement).click();
    expect(cancel).toHaveBeenCalled(); expect(service.batch).not.toHaveBeenCalled(); fixture.destroy();
  });

  it('saves a reception document with today, notes and an idempotent retry without posting to kardex', () => {
    const fixture = setup(); fixture.componentRef.setInput('documentReception', true); select(fixture);
    const component = fixture.componentInstance; component.notes = 'Entrega parcial';
    receptions.save.and.returnValue(throwError(() => ({ error: {} })));
    component.registerIn(); component.registerIn();
    expect(service.batch).not.toHaveBeenCalled();
    const first = receptions.save.calls.first().args;
    expect(first[0]).toBe(24); expect(first[1].notes).toBe('Entrega parcial');
    expect(first[1].received_on).toBe(component.maxDate);
    expect(first[1].items).toEqual([{ variant_id: 1, quantity: 2, comment: 'Recepcion' }]);
    expect(receptions.save.calls.mostRecent().args[1].request_id).toBe(first[1].request_id);
    component.notes = 'Entrega corregida'; component.registerIn();
    expect(receptions.save.calls.mostRecent().args[1].request_id).not.toBe(first[1].request_id);
    const emit = spyOn(component.emitKardexes, 'emit');
    const saved = spyOn(component.saved, 'emit');
    receptions.save.and.returnValue(of({ data: { id: 51, number: 1, status: 'draft', revision: 1, received_on: component.maxDate, notes: component.notes, items: [{ variant_id: 1, quantity: 2, comment: 'Recepcion' }] } } as any));
    component.registerIn(); expect(emit).not.toHaveBeenCalled(); expect(saved).toHaveBeenCalled();
    expect(receptions.post).not.toHaveBeenCalled(); fixture.destroy();
  });

  it('requires a reception date and whole units before confirming', () => {
    const fixture = setup(); fixture.componentRef.setInput('documentReception', true); select(fixture);
    const component = fixture.componentInstance; component.receivedOn = ''; component.registerIn();
    expect(receptions.save).not.toHaveBeenCalled();
    component.receivedOn = component.maxDate; component.receiveKardexVariants([{ variant_id: 1, quantity: 1.5 }]); component.registerIn();
    expect(receptions.save).not.toHaveBeenCalled(); fixture.destroy();
  });

  it('only saves the receipt and leaves printing and confirmation to the list', () => {
    const fixture = setup(); fixture.componentRef.setInput('documentReception', true); select(fixture);
    const component = fixture.componentInstance;
    const receipt = { id: 51, number: 1, status: 'draft', revision: 1, received_on: component.maxDate, notes: '', items: [{ variant_id: 1, quantity: 2, comment: 'Recepcion' }] };
    const saved = spyOn(component.saved, 'emit');
    receptions.save.and.returnValue(of({ data: receipt } as any)); component.registerIn(); fixture.detectChanges();
    expect(component.unsavedChanges).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-inventory-reception-print')).toBeNull();
    expect(fixture.nativeElement.querySelector('.entry-post')).toBeNull();
    expect(fixture.nativeElement.querySelector('.reception-post-review')).toBeNull();
    expect(saved).toHaveBeenCalledWith(receipt as any);
    expect(receptions.post).not.toHaveBeenCalled(); fixture.destroy();
  });

  it('reopens saved quantities and requires saving corrections before printing or posting', () => {
    const today = new Date(); const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const receipt = { id: 51, number: 1, status: 'draft', revision: 1, received_on: date, notes: '', items: [{ variant_id: 1, quantity: 2, comment: 'Recepcion' }] };
    const fixture = setup(receipt); const component = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('.entry-quantity-cell input') as HTMLInputElement;
    expect(input.value).toBe('2'); expect(component.totalQuantity).toBe(2); expect(component.unsavedChanges).toBeFalse();
    input.value = '3'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.entry-post')).toBeNull();
    const saved = { ...receipt, revision: 2, items: [{ variant_id: 1, quantity: 3, comment: 'Recepcion' }] };
    receptions.updateDraft.and.returnValue(of({ data: saved } as any)); component.registerIn();
    expect(receptions.updateDraft.calls.mostRecent().args[3]).toBe(1);
    expect(component.savedReceipt?.revision).toBe(2); expect(component.unsavedChanges).toBeFalse();
    expect(receptions.post).not.toHaveBeenCalled(); fixture.destroy();
  });
});

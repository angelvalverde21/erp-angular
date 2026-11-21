import { By } from '@angular/platform-browser';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { BaseService } from 'src/app/views/base.service';
import { GatewayService } from '../gateways/gateway.service';
import { PaymentCreateComponent } from './payment-create/payment-create.component';
import { PaymentEditComponent } from './payment-edit/payment-edit.component';
import { PaymentIndexComponent } from './payment-index/payment-index.component';
import { PaymentIndexRowComponent } from './payment-index-row/payment-index-row.component';
import { PaymentService } from './payment.service';

registerLocaleData(localeEsPe);

describe('Payment interface workflow', () => {
  let service: jasmine.SpyObj<PaymentService>;
  beforeEach(() => {
    service = jasmine.createSpyObj('PaymentService', ['store', 'update', 'destroy']);
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: BaseService, useValue: { store: 'sorelle' } }, { provide: PaymentService, useValue: service },
      { provide: GatewayService, useValue: { index: () => of({ data: [{ id: 2, name: 'yape', title: 'Yape' }] }) } },
    ] });
  });
  function create() {
    const fixture = TestBed.createComponent(PaymentCreateComponent);
    fixture.componentRef.setInput('paymentable_type', 'manufacture'); fixture.componentRef.setInput('paymentable_id', 24); fixture.detectChanges(); return fixture;
  }

  it('publishes persisted receipt changes from the form without submitting or closing the editor', () => {
    const fixture = TestBed.createComponent(PaymentEditComponent);
    fixture.componentRef.setInput('payment', { id: 15, amount: 20, direction: 'out', date: '2026-11-20', images: [] }); fixture.detectChanges();
    const changed = spyOn(fixture.componentInstance.attachmentsChanged, 'emit');
    const saved = spyOn(fixture.componentInstance.emitUpdatePayment, 'emit');
    const form = fixture.debugElement.query(By.directive(PaymentFormComponent)).componentInstance as PaymentFormComponent;
    form.receiveImages([{ id: 1 }, { id: 2 }]);
    expect(changed).toHaveBeenCalledWith(jasmine.objectContaining({ images: [{ id: 1 }, { id: 2 }] }));
    expect(saved).not.toHaveBeenCalled(); expect(service.update).not.toHaveBeenCalled();
  });

  it('validates the amount and submits files and contextual payment fields once', () => {
    const fixture = create(); const component = fixture.componentInstance;
    component.form.patchValue({ amount: 0 }); component.createPayment(); expect(service.store).not.toHaveBeenCalled();
    const file = new File(['voucher'], 'voucher.jpg', { type: 'image/jpeg' });
    component.form.patchValue({ amount: 50.25, comment: 'Adelanto al proveedor', images: [file] });
    const pending = new Subject<any>(); service.store.and.returnValue(pending); const saved = spyOn(component.emitCreatePayment, 'emit');
    component.createPayment(); component.createPayment();
    expect(service.store).toHaveBeenCalledTimes(1); const payload = service.store.calls.first().args[0] as FormData;
    expect(payload.get('amount')).toBe('50.25'); expect(payload.get('paymentable_id')).toBe('24'); expect(payload.get('direction')).toBe('out');
    expect((payload.get('images[]') as File).name).toBe('voucher.jpg'); expect(component.form.disabled).toBeTrue();
    pending.next({ data: { id: 100 } }); pending.complete(); component.createPayment();
    expect(saved).toHaveBeenCalledWith({ id: 100 }); expect(service.store).toHaveBeenCalledTimes(1); fixture.destroy();
  });

  it('keeps entered fields after a server error and allows retrying without a stuck spinner', () => {
    const fixture = create(); const component = fixture.componentInstance;
    component.form.patchValue({ amount: 20, comment: 'Segundo abono' });
    service.store.and.returnValue(throwError(() => ({ error: {} }))); component.createPayment(); fixture.detectChanges();
    expect(component.loading).toBeFalse(); expect(component.form.enabled).toBeTrue(); expect(component.disabledButton).toBeFalse();
    expect(component.form.get('amount')?.value).toBe(20); expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('No se pudo guardar');
    service.store.and.returnValue(of({ data: { id: 101 } })); component.createPayment(); expect(service.store).toHaveBeenCalledTimes(2); fixture.destroy();
  });

  it('cancels from the footer and prevents wheel changes on the payment amount', () => {
    const fixture = create(); const component = fixture.componentInstance; const cancel = spyOn(component.cancelled, 'emit');
    (fixture.nativeElement.querySelector('button[type="button"]') as HTMLButtonElement).click(); expect(cancel).toHaveBeenCalled();
    const input = fixture.nativeElement.querySelector('input[formControlName="amount"]') as HTMLInputElement;
    const wheel = new WheelEvent('wheel', { deltaY: -100, cancelable: true }); input.dispatchEvent(wheel); expect(wheel.defaultPrevented).toBeTrue();
    expect(service.store).not.toHaveBeenCalled(); fixture.destroy();
  });

  it('reopens an existing payment and saves the corrected fields with its actual id', () => {
    const fixture = TestBed.createComponent(PaymentEditComponent);
    fixture.componentRef.setInput('paymentable_type', 'manufacture'); fixture.componentRef.setInput('paymentable_id', 24);
    fixture.componentRef.setInput('payment', { id: 77, amount: '40.50', gateway_id: 2, date: '2026-11-18T00:00:00Z', direction: 'out', images: [] }); fixture.detectChanges();
    const component = fixture.componentInstance; expect(component.form.get('date')?.value).toBe('2026-11-18');
    component.form.patchValue({ amount: 45 }); service.update.and.returnValue(of({ data: { id: 77, amount: 45 } }));
    const saved = spyOn(component.emitUpdatePayment, 'emit'); component.updatePayment();
    expect(service.update.calls.first().args[0]).toBe(77); expect(service.update.calls.first().args[1].amount).toBe(45);
    expect(saved).toHaveBeenCalledWith({ id: 77, amount: 45 }); fixture.destroy();
  });

  it('recalculates the balance after creation, editing and removal without mutating the original array', () => {
    const fixture = TestBed.createComponent(PaymentIndexComponent);
    const initial = [{ id: 1, amount: 100, direction: 'out', date: '2026-11-18' }, { id: 2, amount: 20, direction: 'in', date: '2026-11-18' }];
    fixture.componentRef.setInput('payments', initial); fixture.detectChanges(); const component = fixture.componentInstance;
    expect(component.sum_payments).toBe(-80); const publish = spyOn(component.paymentsChange, 'emit');
    component.receiveCreatePayment({ id: 3, amount: 10, direction: 'out', date: '2026-11-18' }); expect(component.sum_payments).toBe(-90); expect(initial.length).toBe(2);
    component.receiveUpdatePayment({ ...initial[1], amount: 50 }); expect(component.sum_payments).toBe(-60);
    component.receiveRemovePayment(initial[0]); expect(component.sum_payments).toBe(40); expect(publish).toHaveBeenCalledTimes(3); fixture.destroy();
  });

  it('renders absent receipts safely and retains the record when deletion fails', () => {
    const fixture = TestBed.createComponent(PaymentIndexRowComponent);
    fixture.componentRef.setInput('payment', { id: 8, amount: 10, date: '2026-11-18', direction: 'out' }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Sin adjunto');
    const component = fixture.componentInstance; const removed = spyOn(component.emitRemovePayment, 'emit');
    service.destroy.and.returnValue(throwError(() => ({}))); component.removePayment(); fixture.detectChanges();
    expect(component.removeLoading).toBeFalse(); expect(removed).not.toHaveBeenCalled(); expect(component.payment.id).toBe(8);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('No se pudo eliminar'); fixture.destroy();
  });
});

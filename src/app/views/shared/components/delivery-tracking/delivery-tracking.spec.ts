import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DeliveryTrackingComponent } from './delivery-tracking.component';
import { DeliveryTrackingService } from './delivery-tracking.service';
import { DeliveryEvent, DeliveryTracking } from './delivery-tracking.model';
import { createDeliveryForm } from './delivery-setup.component';

describe('Delivery tracking', () => {
  let service: jasmine.SpyObj<DeliveryTrackingService>;
  const tracking: DeliveryTracking = {
    id: 5, handed_over_on: '2026-11-01', expected_on: '2026-12-10', received_on: null,
    revision: 0, status: 'pending', received_late: false, reschedules_count: 0,
  };
  const event: DeliveryEvent = {
    id: 1, type: 'created', actor_name: 'Ana', created_at: '2026-11-01T15:00:00Z', reason: null,
    changes: { expected_on: { before: null, after: '2026-12-10' } },
  };

  beforeEach(() => {
    service = jasmine.createSpyObj('DeliveryTrackingService', ['createForOwner', 'updateTracking', 'history', 'getTracking']);
    service.history.and.returnValue(of({ data: [event], next_page_url: null }));
    TestBed.configureTestingModule({ providers: [{ provide: DeliveryTrackingService, useValue: service }] });
  });

  function setup(value: DeliveryTracking | null = tracking) {
    const fixture = TestBed.createComponent(DeliveryTrackingComponent);
    fixture.componentRef.setInput('ownerId', 32);
    fixture.componentRef.setInput('tracking', value);
    fixture.detectChanges();
    return fixture;
  }

  it('shows the delivery heading only while expanded and keeps the toggle enabled', () => {
    const fixture = setup(null);
    fixture.componentRef.setInput('footer', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.delivery-footer-label')).toBeNull();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.delivery-start-button');
    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.delivery-footer-label').textContent).toContain('Fechas de entrega');
    expect(button.disabled).toBeFalse();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.delivery-footer-label')).toBeNull();
    expect(fixture.nativeElement.querySelector('.delivery-editor')).toBeNull();
  });

  it('loads and keeps history visible automatically in the standalone purchase card', () => {
    const fixture = setup();
    fixture.componentRef.setInput('footer', true);
    fixture.componentRef.setInput('historyAlwaysVisible', true);
    fixture.detectChanges();
    expect(service.history).toHaveBeenCalledOnceWith(5, 1);
    expect(fixture.nativeElement.querySelector('.delivery-history')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Ana');
    expect(fixture.nativeElement.querySelector('.delivery-history-toggle')).toBeNull();
    fixture.componentInstance.toggleHistory();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.delivery-history')).not.toBeNull();
    expect(service.history).toHaveBeenCalledTimes(1);
  });

  it('requires an initial date only when tracking is enabled', () => {
    const form = createDeliveryForm(new FormBuilder(), true);
    expect(form.invalid).toBeTrue();
    form.patchValue({ enabled: false });
    expect(form.valid).toBeTrue();
    form.patchValue({ enabled: true, expected_on: '2026-12-10' });
    expect(form.valid).toBeTrue();
  });

  it('shows the current commitment and loads history only when opened', () => {
    const fixture = setup();
    fixture.componentRef.setInput('footer', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Entrega pendiente');
    expect(fixture.nativeElement.querySelector('.delivery-footer')).not.toBeNull();
    expect(service.history).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('.delivery-history-toggle').click();
    fixture.detectChanges();
    expect(service.history).toHaveBeenCalledOnceWith(5, 1);
    expect(fixture.nativeElement.textContent).toContain('Fecha tentativa de entrega');
    expect(fixture.nativeElement.textContent).toContain('Ana');
  });

  it('requires a reason for rescheduling and sends the current revision', () => {
    const fixture = setup();
    fixture.componentInstance.begin('reschedule');
    fixture.componentInstance.form.patchValue({ expected_on: '2026-12-15' });
    fixture.componentInstance.save();
    expect(service.updateTracking).not.toHaveBeenCalled();
    service.updateTracking.and.returnValue(of({ data: { ...tracking, revision: 1, expected_on: '2026-12-15', reschedules_count: 1 } }));
    fixture.componentInstance.form.patchValue({ reason: 'Retraso del taller' });
    fixture.componentInstance.save();
    expect(service.updateTracking).toHaveBeenCalledWith(5, jasmine.objectContaining({ revision: 0, expected_on: '2026-12-15', reason: 'Retraso del taller' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.tracking?.reschedules_count).toBe(1);
    expect(fixture.componentInstance.mode).toBeNull();
  });

  it('keeps the draft on errors and prevents duplicate saves', () => {
    const fixture = setup();
    const pending = new Subject<{ data: DeliveryTracking }>();
    service.updateTracking.and.returnValue(pending);
    fixture.componentInstance.begin('receive');
    fixture.componentInstance.form.patchValue({ received_on: '2026-11-12' });
    fixture.componentInstance.save();
    fixture.componentInstance.save();
    expect(service.updateTracking).toHaveBeenCalledTimes(1);
    pending.error({ error: { errors: { revision: ['Otra persona actualizó la entrega.'] } } });
    fixture.detectChanges();
    expect(fixture.componentInstance.form.value.received_on).toBe('2026-11-12');
    expect(fixture.componentInstance.saving).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('Otra persona actualizó');
  });

  it('creates optional tracking on existing purchases without recording a payment', () => {
    const fixture = setup(null);
    service.createForOwner.and.returnValue(of({ data: tracking }));
    fixture.componentInstance.begin('create');
    fixture.componentInstance.form.patchValue({ expected_on: '2026-12-10', handed_over_on: '2026-11-01' });
    const emit = spyOn(fixture.componentInstance.trackingChanged, 'emit');
    fixture.componentInstance.save();
    expect(service.createForOwner).toHaveBeenCalledWith('purchase', 32, jasmine.objectContaining({ expected_on: '2026-12-10' }));
    expect(emit).toHaveBeenCalledWith(tracking);
  });

  it('allows retry after history errors without hiding the commitment', () => {
    const fixture = setup();
    service.history.and.returnValue(throwError(() => ({ status: 500 })));
    fixture.componentInstance.toggleHistory();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No se pudo cargar el historial');
    expect(fixture.nativeElement.textContent).toContain('Entrega pendiente');
    service.history.and.returnValue(of({ data: [event], next_page_url: null }));
    fixture.componentInstance.loadHistory();
    expect(fixture.componentInstance.events.length).toBe(1);
  });
});

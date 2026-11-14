import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { AttendanceEditComponent } from './attendance-edit.component';
import { AttendanceService } from '../attendance.service';
import { EmployeeService } from '../../users/employees/employee.service';

describe('Manual remote attendance', () => {
  let service: jasmine.SpyObj<AttendanceService>;
  it('allows custom remote hours and restoring the scheduled day', () => {
    const fixture = TestBed.createComponent(AttendanceEditComponent);
    fixture.componentRef.setInput('attendance', { id: 13, employee_id: 3, date: '2026-11-03', work_type: 'home_office', scheduled_start: '10:00:00', scheduled_end: '19:00:00' });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.toggleRemoteHours();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[formControlName="check_in"]')).not.toBeNull();
    expect(component.form.value.check_in).toBe('10:00:00');
    component.form.patchValue({ check_out: '20:00:00' });
    service.update.and.returnValue(of({ data: {} }));
    component.createOrUpdate();
    expect(service.update).toHaveBeenCalledWith(13, jasmine.objectContaining({ remote_hours_custom: true, check_out: '20:00:00' }));
    component.toggleRemoteHours();
    component.createOrUpdate();
    expect(service.update).toHaveBeenCalledWith(13, jasmine.objectContaining({ remote_hours_custom: false, check_in: null, check_out: null }));
  });
  beforeEach(() => {
    service = jasmine.createSpyObj('AttendanceService', ['store', 'update']);
    TestBed.configureTestingModule({ providers: [
      { provide: AttendanceService, useValue: service },
      { provide: EmployeeService, useValue: { index: () => of({ data: [{ id: 3, name: 'Marina' }] }) } },
    ] });
  });

  it('hides physical punches for remote work and clears them from the request without losing the draft on error', () => {
    const fixture = TestBed.createComponent(AttendanceEditComponent);
    fixture.componentRef.setInput('attendance', { employee_id: 3, date: '2026-11-03', check_in: '09:00', check_out: '18:00' });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.form.controls['work_type'].setValue('home_office');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[formControlName="check_in"]')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('jornada programada');
    const response = new Subject<any>();
    service.store.and.returnValue(response);
    component.createOrUpdate();
    component.createOrUpdate();
    expect(service.store).toHaveBeenCalledOnceWith(jasmine.objectContaining({ employee_id: 3, date: '2026-11-03', work_type: 'home_office', check_in: null, check_out: null }));
    response.error({ error: { errors: { work_type: ['Configura un horario laboral válido.'] } } });
    fixture.detectChanges();
    expect(component.form.value.work_type).toBe('home_office');
    expect(fixture.nativeElement.textContent).toContain('Configura un horario laboral válido');
    expect(component.loading).toBeFalse();
  });

  it('defaults to deducting rest and sends the exception only when selected manually', () => {
    const fixture = TestBed.createComponent(AttendanceEditComponent);
    fixture.componentRef.setInput('attendance', { employee_id: 3, date: '2026-11-03', check_in: '10:00', check_out: '19:00' });
    fixture.detectChanges();
    expect(fixture.componentInstance.form.value.break_skipped).toBeFalse();
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="break_skipped"]');
    checkbox.click();
    service.store.and.returnValue(of({ data: { break_skipped: true, paid_minutes: 540 } }));
    fixture.componentInstance.createOrUpdate();
    expect(service.store).toHaveBeenCalledOnceWith(jasmine.objectContaining({ break_skipped: true }));
  });

  it('loads existing remote attendance and allows changing it back to onsite with actual punches', () => {
    const fixture = TestBed.createComponent(AttendanceEditComponent);
    fixture.componentRef.setInput('attendance', { id: 13, employee_id: 3, date: '2026-11-03', work_type: 'home_office', break_skipped: true });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.form.value.work_type).toBe('home_office');
    expect(component.form.value.break_skipped).toBeTrue();
    component.form.patchValue({ work_type: 'onsite', check_in: '09:00', check_out: '18:00' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[formControlName="check_in"]')).not.toBeNull();
    service.update.and.returnValue(of({ data: { id: 13, work_type: 'onsite' } }));
    component.createOrUpdate();
    expect(service.update).toHaveBeenCalledOnceWith(13, jasmine.objectContaining({ work_type: 'onsite', check_in: '09:00', check_out: '18:00' }));
  });
});

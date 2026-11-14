import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { signal } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { EmployeeService } from './employee.service';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeEditComponent } from './employee-edit-page/employee-edit/employee-edit.component';
import { EmployeeSelectedComponent } from './employee-selected/employee-selected.component';
import { createEmployeeForm } from './employee-form.model';
import { IdentityService } from '../../identities/identity.service';
import { RoleService } from '../../roles/role.service';
import { AttendanceService } from '../../attendances/attendance.service';
import { AttendanceIndexPageComponent } from '../../attendances/attendance-index-page/attendance-index-page.component';
import { AttendanceIndexComponent } from '../../attendances/attendance-index/attendance-index.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { EmployeeIndexComponent } from './employee-index/employee-index.component';
import { EmployeeSalaryIndexComponent } from './employee-edit-page/employee-salary-index/employee-salary-index.component';

const employee = { id: 3, name: 'Empleado independiente', email: 'staff@example.test', user_id: 1, account: { id: 1, email: 'staff@example.test', status: true }, roles: ['sales'], status: true,
  salary: 1500, biometric_code: '1', schedules: [], attendances: [], tolerance_minutes: 15, allow_extra_hours: true };
registerLocaleData(localeEsPe);

describe('Independent employees and attendances', () => {
  let savedUser: string | null;
  let service: any;
  let current: ReturnType<typeof signal<any>>;

  beforeEach(() => {
    savedUser = localStorage.getItem('user');
    localStorage.setItem('user', JSON.stringify({ roles: ['ceo'] }));
    current = signal(employee);
    service = jasmine.createSpyObj('EmployeeService', ['store', 'update', 'index', 'setSignal', 'receiveSignal', 'laborSummary', 'setWorkStatus']);
    service.receiveSignal.and.callFake(() => current());
    service.index.and.returnValue(of({ data: [employee] }));
    TestBed.configureTestingModule({ providers: [
      { provide: EmployeeService, useValue: service },
      { provide: IdentityService, useValue: { index: () => of({ data: [] }) } },
      { provide: RoleService, useValue: { index: () => of({ data: ['sales', 'ceo'] }) } },
    ] });
  });

  afterEach(() => {
    if (savedUser === null) localStorage.removeItem('user');
    else localStorage.setItem('user', savedUser);
  });

  it('toggles employee calculation eligibility once and preserves the state if saving fails', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(EmployeeIndexComponent);
    const row = { ...employee };
    fixture.componentRef.setInput('employees', [row]);
    fixture.detectChanges();
    const pending = new Subject<any>();
    service.setWorkStatus.and.returnValue(pending);
    fixture.componentInstance.toggleStatus(row);
    fixture.componentInstance.toggleStatus(row);
    expect(service.setWorkStatus).toHaveBeenCalledOnceWith(3, false);
    expect(row.status).toBeTrue();
    pending.next({ data: { status: false } });
    pending.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Excluido de cálculos');
    expect(fixture.nativeElement.textContent).toContain('Habilitar');
    service.setWorkStatus.and.returnValue(throwError(() => ({})));
    fixture.componentInstance.toggleStatus(row);
    fixture.detectChanges();
    expect(row.status).toBeFalse();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('requires login credentials and matching passwords while allowing optional contact data', () => {
    const form = createEmployeeForm(new FormBuilder());
    expect(form.valid).toBeFalse();
    form.patchValue({ name: 'Nuevo empleado' });
    expect(form.valid).toBeFalse();
    form.patchValue({ email: 'staff@example.test', password: 'Employee-pass1', password_confirmation: 'Employee-pass1', roles: ['sales'] });
    expect(form.valid).toBeTrue();
    expect(form.contains('user_id')).toBeFalse();
    expect(form.contains('password')).toBeTrue();
    form.patchValue({ password_confirmation: 'Different-pass1' });
    expect(form.hasError('passwordMismatch')).toBeTrue();
  });

  it('creates directly through employees and blocks duplicate submissions', () => {
    const pending = new Subject<any>();
    service.store.and.returnValue(pending);
    const fixture = TestBed.createComponent(EmployeeCreateComponent);
    fixture.detectChanges();
    fixture.componentInstance.form.patchValue({ name: 'Nuevo empleado', biometric_code: '9', email: 'staff@example.test', password: 'Employee-pass1', password_confirmation: 'Employee-pass1', roles: ['sales'] });
    fixture.componentInstance.create();
    fixture.componentInstance.create();
    expect(service.store).toHaveBeenCalledTimes(1);
    expect(service.store.calls.mostRecent().args[0].email).toBe('staff@example.test');
    expect(service.store.calls.mostRecent().args[0].name).toBe('Nuevo empleado');
    pending.next({ data: { ...employee, name: 'Nuevo empleado' } });
    pending.complete();
    expect(fixture.componentInstance.loadingIcon).toBeFalse();
  });

  it('edits the linked employee account without sending an empty password and displays validation errors', () => {
    service.update.and.returnValue(throwError(() => ({ error: { errors: { biometric_code: ['El código ya existe.'] } } })));
    const fixture = TestBed.createComponent(EmployeeEditComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.employee-form-cards > .personnel-section').length).toBe(4);
    expect(fixture.componentInstance.form.get('name')?.value).toBe(employee.name);
    fixture.componentInstance.save();
    fixture.detectChanges();
    expect(service.update).toHaveBeenCalled();
    expect(service.update.calls.mostRecent().args[1].password).toBeUndefined();
    expect(fixture.nativeElement.textContent).toContain('El código ya existe.');
    expect(fixture.componentInstance.loadingIcon).toBeFalse();
  });

  it('selects employees by their own name and supports clearing the value', async () => {
    const fixture = TestBed.createComponent(EmployeeSelectedComponent);
    const changed = jasmine.createSpy('changed');
    fixture.componentInstance.registerOnChange(changed);
    fixture.componentInstance.writeValue(3);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(employee.name);
    fixture.componentInstance.setEmployee(null);
    expect(changed).toHaveBeenCalledWith(null);
  });

  it('loads attendance pages from the server and resets filters on a new search', () => {
    const attendance = jasmine.createSpyObj('AttendanceService', ['list']);
    attendance.list.and.returnValue(of({ data: [], meta: { current_page: 1, last_page: 3, total: 45 } }));
    TestBed.configureTestingModule({ providers: [
      { provide: AttendanceService, useValue: attendance },
      { provide: NgbModal, useValue: { open: jasmine.createSpy('open') } },
    ] });
    const fixture = TestBed.createComponent(AttendanceIndexPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.load(2);
    expect(attendance.list.calls.mostRecent().args[0]).toBe(2);
    fixture.componentInstance.filters.search = 'Empleado';
    fixture.componentInstance.load();
    expect(attendance.list.calls.mostRecent().args[0]).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('20 por página');
  });

  it('counts computed dates as whole days even for short or missing shifts', () => {
    TestBed.configureTestingModule({ providers: [{ provide: NgbModal, useValue: {} }] });
    const fixture = TestBed.createComponent(AttendanceIndexComponent);
    fixture.componentRef.setInput('employee', employee);
    fixture.componentRef.setInput('attendances', [
      { date: '2026-11-03', employee_id: 3, employee_name: employee.name, paid_minutes: 480 },
      { date: '2026-11-04', employee_id: 3, employee_name: employee.name, paid_minutes: 240 },
    ]);
    fixture.detectChanges();
    expect(fixture.componentInstance.computedDays).toBe(2);
    expect(fixture.nativeElement.querySelector('.attendance-days').textContent).toContain('2 días computados');
    expect(fixture.nativeElement.querySelector('.attendance-days').textContent).not.toContain('8 h/día');
    fixture.componentRef.setInput('attendances', [{ date: '2026-11-03', employee_id: 3, missing: true, paid_minutes: 0 }]);
    fixture.detectChanges();
    expect(fixture.componentInstance.computedDays).toBe(1);
  });

  it('shows fortnight net pay from half the monthly salary without deducting absences twice', () => {
    TestBed.configureTestingModule({ providers: [{ provide: NgbModal, useValue: {} }] });
    const fixture = TestBed.createComponent(AttendanceIndexComponent);
    fixture.componentRef.setInput('employee', employee);
    fixture.componentRef.setInput('attendances', [
      { date: '2026-11-03', employee_id: 3, paid_minutes: 467, salary_day: 55, salary_extra: -1.49 },
      { date: '2026-11-04', employee_id: 3, paid_minutes: 0, missing: true, salary_day: 55, salary_extra: -55, salary_neto: -55 },
      { date: '2026-11-05', employee_id: 3, paid_minutes: 484, salary_day: 55, salary_extra: .46 },
    ]);
    fixture.detectChanges();
    expect(fixture.componentInstance.periodPay).toEqual({ base: 750, discounts: 56.49, extras: .46, net: 693.97 });
    expect(fixture.nativeElement.querySelector('.attendance-pay-net strong').textContent).toContain('693.97');
    fixture.componentRef.setInput('attendances', [{ date: '2026-11-03', employee_id: 3, salary_day: null, salary_extra: null }]);
    fixture.detectChanges();
    expect(fixture.componentInstance.periodPay).toBeNull();
    expect(fixture.nativeElement.querySelector('.attendance-pay-unavailable')).not.toBeNull();
    fixture.componentRef.setInput('employee', { ...employee, status: false });
    fixture.componentRef.setInput('attendances', [{ date: '2026-11-03', employee_id: 3, salary_extra: 0 }]);
    fixture.detectChanges();
    expect(fixture.componentInstance.periodPay).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Empleado deshabilitado');
  });

  it('pays the full fortnight without attendance when configured and never pays a disabled employee', () => {
    TestBed.configureTestingModule({ providers: [{ provide: NgbModal, useValue: {} }] });
    const fixture = TestBed.createComponent(AttendanceIndexComponent);
    fixture.componentRef.setInput('employee', { ...employee, salary: 1650, payroll_uses_attendance: false });
    fixture.componentRef.setInput('attendances', []);
    fixture.detectChanges();
    expect(fixture.componentInstance.periodPay).toEqual({ base: 825, discounts: 0, extras: 0, net: 825 });
    expect(fixture.nativeElement.textContent).toContain('No requiere marcaciones para el pago');
    expect(fixture.nativeElement.querySelector('.attendance-pay-net strong').textContent).toContain('825.00');
    fixture.componentRef.setInput('attendances', [{ date: '2026-11-03', salary_extra: -55 }]);
    fixture.detectChanges();
    expect(fixture.componentInstance.periodPay?.net).toBe(825);
    fixture.componentRef.setInput('employee', { ...employee, payroll_uses_attendance: false, status: false });
    fixture.detectChanges();
    expect(fixture.componentInstance.periodPay).toBeNull();
    fixture.componentRef.setInput('employee', { ...employee, payroll_uses_attendance: true });
    fixture.componentRef.setInput('attendances', []);
    fixture.detectChanges();
    expect(fixture.componentInstance.periodPay).toBeNull();
  });

  it('keeps a salary of 1650 at a fortnight base of 825 regardless of the number of computed days', () => {
    TestBed.configureTestingModule({ providers: [{ provide: NgbModal, useValue: {} }] });
    const fixture = TestBed.createComponent(AttendanceIndexComponent);
    fixture.componentRef.setInput('employee', { ...employee, salary: '1650.00' });
    const rows = Array.from({ length: 14 }, (_, index) => ({ date: `2026-11-${String(index + 1).padStart(2, '0')}`,
      employee_id: 3, salary_day: 55, salary_extra: index === 0 ? -117.23 : index === 1 ? 7.45 : 0 }));
    fixture.componentRef.setInput('attendances', rows);
    fixture.detectChanges();
    expect(fixture.componentInstance.periodPay).toEqual({ base: 825, discounts: 117.23, extras: 7.45, net: 715.22 });
    fixture.componentRef.setInput('attendances', rows.slice(0, 13));
    fixture.detectChanges();
    expect(fixture.componentInstance.periodPay?.base).toBe(825);
    expect(fixture.componentInstance.periodPay?.net).toBe(715.22);
  });

  it('distinguishes missing and incomplete punches without inventing exit times', () => {
    TestBed.configureTestingModule({ providers: [{ provide: NgbModal, useValue: {} }] });
    const fixture = TestBed.createComponent(AttendanceIndexComponent);
    fixture.componentInstance.attendances = [{ id: 1, date: '2026-11-03', employee_id: 3,
      employee_name: employee.name, check_in: '09:00:00', check_out: null, incomplete: true, paid_minutes: 0 }];
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Marcación incompleta');
    expect(fixture.nativeElement.textContent).not.toContain('19:00');
    expect(fixture.componentInstance.duration(null)).toBe('—');
  });

  it('shows three fortnight summaries and labels the current one as in progress', () => {
    service.laborSummary.and.returnValue(of({ data: { employee, periods: [
      { id: '2026-11-01', label: 'Primera quincena', start_date: '2026-11-01', end_date: '2026-11-15', computed_through: '2026-11-06', is_current: true, worked_minutes: 480, recorded_days: 1, late_days: 0, missing_days: 0, remote_days: 0, incomplete_days: 0, attendances: [] },
      { id: '2026-10-16', label: 'Segunda quincena', start_date: '2026-10-16', end_date: '2026-10-31', computed_through: '2026-10-31', is_current: false, worked_minutes: 0, recorded_days: 0, late_days: 0, missing_days: 0, remote_days: 0, incomplete_days: 0, attendances: [] },
      { id: '2026-10-01', label: 'Primera quincena', start_date: '2026-10-01', end_date: '2026-10-15', computed_through: '2026-10-15', is_current: false, worked_minutes: 0, recorded_days: 0, late_days: 0, missing_days: 0, remote_days: 0, incomplete_days: 0, attendances: [] },
    ] } }));
    TestBed.configureTestingModule({ providers: [{ provide: ActivatedRoute, useValue: { parent: { params: of({ employee_id: '3' }) } } }] });
    const fixture = TestBed.createComponent(EmployeeSalaryIndexComponent);
    fixture.detectChanges();
    expect(service.laborSummary).toHaveBeenCalledWith(3);
    expect(fixture.nativeElement.querySelectorAll('.fortnight-card').length).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('En curso');
    expect(fixture.nativeElement.textContent).toContain('8 h 00 min');
    expect(fixture.componentInstance.openPeriod).toBe('2026-11-01');
  });
});

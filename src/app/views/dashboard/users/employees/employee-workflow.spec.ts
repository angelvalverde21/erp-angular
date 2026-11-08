import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
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
import { ActivatedRoute } from '@angular/router';
import { EmployeeSalaryIndexComponent } from './employee-edit-page/employee-salary-index/employee-salary-index.component';

const employee = { id: 3, name: 'Empleado independiente', email: 'staff@example.test', user_id: 1, account: { id: 1, email: 'staff@example.test', status: true }, roles: ['sales'], status: true,
  salary: 1500, biometric_code: '1', schedules: [], attendances: [], tolerance_minutes: 15, allow_extra_hours: true };

describe('Independent employees and attendances', () => {
  let savedUser: string | null;
  let service: any;
  let current: ReturnType<typeof signal<any>>;

  beforeEach(() => {
    savedUser = localStorage.getItem('user');
    localStorage.setItem('user', JSON.stringify({ roles: ['ceo'] }));
    current = signal(employee);
    service = jasmine.createSpyObj('EmployeeService', ['store', 'update', 'index', 'setSignal', 'receiveSignal', 'laborSummary']);
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

import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { BaseService } from 'src/app/views/base.service';
import { EmployeeService } from '../../employee.service';
import { EmployeeAttendanceService } from './employee.attendance.service';
import { EmployeeAttendanceIndexComponent } from './employee-attendance-index.component';
import { HeadSearchComponent } from 'src/app/views/shared/components/head-search/head-search.component';

registerLocaleData(localeEsPe);

describe('Employee attendance default period', () => {
  let request: Subject<any>;
  let service: jasmine.SpyObj<EmployeeAttendanceService>;
  const employee = signal<any>({ id: 4, name: 'Marina', attendances: [{ date: '2026-11-14' }] });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-11-14T18:00:00Z'));
    request = new Subject();
    service = jasmine.createSpyObj('EmployeeAttendanceService', ['setId', 'search']);
    service.search.and.returnValue(request);
    TestBed.configureTestingModule({ providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: EmployeeService, useValue: { receiveSignal: () => employee() } },
      { provide: EmployeeAttendanceService, useValue: service },
      { provide: ActivatedRoute, useValue: { parent: { params: of({ employee_id: 4 }) } } },
    ] });
  });
  afterEach(() => jasmine.clock().uninstall());

  it('loads the displayed default dates once and preserves filtered results when the employee profile updates', () => {
    const fixture = TestBed.createComponent(EmployeeAttendanceIndexComponent);
    fixture.detectChanges();
    expect(service.setId).toHaveBeenCalledWith(4);
    expect(service.search).toHaveBeenCalledOnceWith({ search: '', start_date: '2026-10-16', end_date: '2026-10-31' });
    const search = fixture.debugElement.query(By.directive(HeadSearchComponent)).componentInstance as HeadSearchComponent;
    expect(search.form.value.start_date).toBe('2026-10-16');
    const rows = [{ date: '2026-10-20', employee_id: 4, employee_name: 'Marina', paid_minutes: 480 }];
    request.next({ data: rows });
    request.complete();
    fixture.detectChanges();
    employee.set({ id: 4, name: 'Marina actualizada', attendances: [{ date: '2026-11-14' }] });
    fixture.detectChanges();
    expect(fixture.componentInstance.attendances).toEqual(rows);
    expect(fixture.componentInstance.loading).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('martes');
    expect(fixture.nativeElement.textContent).not.toContain('Tuesday');
    service.search.and.returnValue(of({ data: [] }));
    search.showNextFortnight();
    expect(service.search.calls.mostRecent().args[0].start_date).toBe('2026-11-01');
    expect(service.search.calls.mostRecent().args[0].end_date).toBe('2026-11-14');
    expect(service.search).toHaveBeenCalledTimes(2);
    expect(search.nextAttendancePeriod).toBeNull();
    search.earliestAttendanceDate = '2026-10-20';
    fixture.detectChanges();
    const previousButton = fixture.nativeElement.querySelector('button.fortnight-button') as HTMLButtonElement;
    expect(previousButton.classList.contains('btn-light')).toBeTrue();
    expect(previousButton.disabled).toBeFalse();
    previousButton.click();
    fixture.detectChanges();
    expect(service.search.calls.mostRecent().args[0].start_date).toBe('2026-10-16');
    expect(service.search.calls.mostRecent().args[0].end_date).toBe('2026-10-31');
    expect(previousButton.disabled).toBeTrue();
    search.showPreviousFortnight();
    expect(service.search).toHaveBeenCalledTimes(3);
  });
});

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BaseService } from '../../base.service';
import { navDashboards } from '../../../layout/default-layout/navs/_nav.dashboards';
import { filterNavigation } from '../../../layout/default-layout/navs/filter-navigation';
import { AreaDashboardComponent } from './area-dashboard.component';
import { DashboardHubComponent } from './dashboard-hub.component';
import { AreaDashboardService } from './area-dashboard.service';
import { AreaReport, canViewDashboard } from './dashboard.model';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { EmployeePayrollComponent } from './employee-payroll/employee-payroll.component';
registerLocaleData(localeEsPe);

describe('Dashboards by area', () => {
  let previousUser: string | null;
  let service: jasmine.SpyObj<AreaDashboardService>;
  const report: AreaReport = {
    area: 'sales', store: { id: 1, name: 'Sorelle', slug: 'sorelle' },
    range: { days: 30, from: '2026-10-08', to: '2026-11-06', timezone: 'America/Lima' },
    updated_at: '2026-11-06T12:00:00-05:00',
    sections: [{
      key: 'sales', title: 'Ventas', description: 'Actividad comercial', available: false,
      metrics: [{ label: 'Pedidos registrados', value: null, format: 'number' }],
      items_title: 'Pedidos', items: [], actions: [], note: 'Pendiente de configuración.',
    }],
  };

  beforeEach(() => {
    previousUser = localStorage.getItem('user');
    localStorage.setItem('user', JSON.stringify({ roles: ['sales'] }));
    service = jasmine.createSpyObj('AreaDashboardService', ['report']);
    service.report.and.returnValue(of({ data: report }));
    TestBed.configureTestingModule({ providers: [
      provideRouter([]),
      { provide: BaseService, useValue: { store: 'sorelle', storeName: 'Sorelle' } },
      { provide: AreaDashboardService, useValue: service },
      { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ area: 'sales' })) } },
    ] });
  });

  afterEach(() => {
    if (previousUser === null) localStorage.removeItem('user');
    else localStorage.setItem('user', previousUser);
  });

  it('filters dashboard submenu entries by role without mutating their definitions', () => {
    const result = filterNavigation(navDashboards, ['sales']);
    expect(result[0].children?.map(item => item.name)).toEqual(['Vista general', 'Ventas']);
    expect(navDashboards[0].children?.length).toBe(5);
    expect(canViewDashboard('ceo', ['sales'])).toBeFalse();
    expect(canViewDashboard('packing', ['packing'])).toBeTrue();
    expect(canViewDashboard('marketing', ['ceo'])).toBeTrue();
  });

  it('shows the four entry points to the CEO', () => {
    localStorage.setItem('user', JSON.stringify({ roles: ['ceo'] }));
    const fixture = TestBed.createComponent(DashboardHubComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.dash-area-card').length).toBe(4);
    expect(fixture.nativeElement.textContent).toContain('Una vista completa para dirección');
  });

  it('distinguishes calculated employee payments from an incomplete payroll total', () => {
    const fixture = TestBed.createComponent(EmployeePayrollComponent);
    fixture.componentRef.setInput('store', 'sorelle');
    fixture.componentRef.setInput('summary', { available: true, start_date: '2026-11-01', end_date: '2026-11-15', computed_through: '2026-11-14', is_provisional: false,
      employee_count: 2, calculated_count: 1, pending_count: 1, total_net: null,
      totals: { base: 825, discounts: 0, extras: 0, net: 825 },
      items: [{ id: 1, name: 'Marina', payroll_uses_attendance: false, amounts: { base: 825, discounts: 0, extras: 0, net: 825 }, pending_reason: null },
        { id: 2, name: 'Pendiente', payroll_uses_attendance: true, amounts: null, pending_reason: 'Sin sueldo configurado' }] });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Quincena íntegra');
    expect(fixture.nativeElement.textContent).toContain('Sin sueldo configurado');
    expect(fixture.nativeElement.querySelector('.payroll-total').textContent).toContain('Total calculado');
    expect(fixture.nativeElement.querySelector('.payroll-total strong').textContent).toContain('825.00');
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe('/sorelle/dashboard/users/employees/1');
  });

  it('marks unavailable metrics clearly and changes the requested period', () => {
    const fixture = TestBed.createComponent(AreaDashboardComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Por configurar');
    expect(fixture.nativeElement.querySelector('.dash-metric strong').textContent.trim()).toBe('—');
    fixture.componentInstance.changePeriod(7);
    expect(service.report).toHaveBeenCalledWith('sales', 7);
  });

  it('releases loading and offers a retry after a failed request', () => {
    service.report.and.returnValue(throwError(() => ({ status: 500 })));
    const fixture = TestBed.createComponent(AreaDashboardComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.loading).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('Reintentar');
    service.report.and.returnValue(of({ data: report }));
    fixture.componentInstance.refresh();
    fixture.detectChanges();
    expect(fixture.componentInstance.error).toBe('');
    expect(fixture.componentInstance.report?.store.name).toBe('Sorelle');
  });

  it('shows the CEO cost report as a table and opens a production detail modal without steppers', () => {
    localStorage.setItem('user', JSON.stringify({ roles: ['ceo'] }));
    TestBed.overrideProvider(ActivatedRoute, { useValue: { paramMap: of(convertToParamMap({ area: 'ceo' })) } });
    service.report.and.returnValue(of({ data: {
      ...report, area: 'ceo', production_progress: {
        available: true, total_count: 2, active_count: 1, completed_count: 0, unplanned_count: 1,
        planned_units: 20, completed_units: 15, pending_units: 5, progress_percent: 75, visible_count: 2, note: 'Avance por recepción de variantes.',
        items: [
          { total_expense: 400, unit_cost: 20, details_available: true, variants: [{ id: 10, product_name: 'Blusa', variant_name: 'M', sku: 'BL-M', quantity: 20, options: [{ name: 'Talla', value: 'M' }] }], id: 1, name: 'Colección verano', created_at: '2026-11-01', planned_units: 20, received_units: 20, completed_units: 15, pending_units: 5, extra_units: 5, progress_percent: 75, status: 'in_progress', needs_review: false, path: 'manufactures/productions/1' },
          { total_expense: 0, unit_cost: null, variants: [], id: 2, name: 'Producción sin plan', created_at: '2026-11-01', planned_units: 0, received_units: 0, completed_units: 0, pending_units: 0, extra_units: 0, progress_percent: null, status: 'unplanned', needs_review: false, path: 'manufactures/productions/2' },
        ],
      },
    } }));
    const fixture = TestBed.createComponent(AreaDashboardComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Últimas 6 producciones');
    expect(root.textContent).toContain('Sin plan');
    expect(root.querySelectorAll('[role="progressbar"]').length).toBe(0);
    expect(root.querySelector('app-production-stage-stepper')).toBeNull();
    expect(root.querySelectorAll('.monitor-table > tbody > tr').length).toBe(2);
    expect(root.textContent).toContain('Sin calcular');
    (root.querySelector('.monitor-name') as HTMLButtonElement).click(); fixture.detectChanges();
    const dialog = root.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.open).toBeTrue();
    expect(dialog.textContent).toContain('Blusa');
    expect(dialog.textContent).toContain('Talla:');
    expect(dialog.textContent).toContain('BL-M');
    expect(dialog.textContent).toContain('15 de 20');
    expect(dialog.querySelector('a')?.getAttribute('href')).toBe('/sorelle/dashboard/manufactures/productions/1/overview');
    (dialog.querySelector('.report-close') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(dialog.open).toBeFalse();
    const limitSelect = root.querySelector('.monitor-controls select') as HTMLSelectElement;
    expect(Array.from(limitSelect.options).map(option => option.value)).toEqual([...Array.from({ length: 9 }, (_, index) => String(index + 2)), 'all']);
    for (const limit of [2, 5, 10, 6]) {
      limitSelect.value = String(limit); limitSelect.dispatchEvent(new Event('change')); fixture.detectChanges();
      expect(service.report).toHaveBeenCalledWith('ceo', 30, limit);
      expect(fixture.componentInstance.productionLimit).toBe(limit);
    }
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));
    limitSelect.value = 'all'; limitSelect.dispatchEvent(new Event('change')); fixture.detectChanges();
    expect(navigate).toHaveBeenCalledWith(['/', 'sorelle', 'dashboard', 'manufactures', 'productions']);
    expect(fixture.componentInstance.productionLimit).toBe(6);
    service.report.and.returnValue(throwError(() => ({ status: 500 })));
    fixture.componentInstance.refresh();
    fixture.detectChanges();
    expect(root.querySelector('app-production-progress')).not.toBeNull();
    expect(root.querySelector('.dash-refresh-warning')).not.toBeNull();
  });

  it('refreshes the CEO every minute only while visible and releases the timer on destroy', fakeAsync(() => {
    const visibility = spyOnProperty(document, 'visibilityState', 'get').and.returnValue('visible');
    localStorage.setItem('user', JSON.stringify({ roles: ['ceo'] }));
    TestBed.overrideProvider(ActivatedRoute, { useValue: { paramMap: of(convertToParamMap({ area: 'ceo' })) } });
    service.report.and.returnValue(of({ data: { ...report, area: 'ceo' } }));
    const fixture = TestBed.createComponent(AreaDashboardComponent);
    fixture.detectChanges();
    expect(service.report).toHaveBeenCalledTimes(1);
    tick(60000);
    expect(service.report).toHaveBeenCalledTimes(2);
    visibility.and.returnValue('hidden');
    tick(60000);
    expect(service.report).toHaveBeenCalledTimes(2);
    fixture.destroy();
    tick(60000);
    expect(service.report).toHaveBeenCalledTimes(2);
  }));
});

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BaseService } from '../../base.service';
import { navDashboards } from '../../../layout/default-layout/navs/_nav.dashboards';
import { filterNavigation } from '../../../layout/default-layout/navs/filter-navigation';
import { AreaDashboardComponent } from './area-dashboard.component';
import { DashboardHubComponent } from './dashboard-hub.component';
import { AreaDashboardService } from './area-dashboard.service';
import { AreaReport, canViewDashboard } from './dashboard.model';

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

  it('shows received units on the CEO dashboard without stage percentages', () => {
    localStorage.setItem('user', JSON.stringify({ roles: ['ceo'] }));
    TestBed.overrideProvider(ActivatedRoute, { useValue: { paramMap: of(convertToParamMap({ area: 'ceo' })) } });
    service.report.and.returnValue(of({ data: {
      ...report, area: 'ceo', production_progress: {
        available: true, total_count: 2, active_count: 1, completed_count: 0, unplanned_count: 1,
        planned_units: 20, completed_units: 15, pending_units: 5, progress_percent: 75, visible_count: 2, note: 'Avance por recepción de variantes.',
        items: [
          { id: 1, name: 'Colección verano', created_at: '2026-11-01', planned_units: 20, received_units: 20, completed_units: 15, pending_units: 5, extra_units: 5, progress_percent: 75, status: 'in_progress', needs_review: false, path: 'manufactures/productions/1' },
          { id: 2, name: 'Producción sin plan', created_at: '2026-11-01', planned_units: 0, received_units: 0, completed_units: 0, pending_units: 0, extra_units: 0, progress_percent: null, status: 'unplanned', needs_review: false, path: 'manufactures/productions/2' },
        ],
      },
    } }));
    const fixture = TestBed.createComponent(AreaDashboardComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Avance de las producciones');
    expect(root.textContent).toContain('Sin meta');
    expect(root.querySelectorAll('[role="progressbar"]').length).toBe(0);
    expect(root.querySelector('.monitor-row-details')?.textContent).toContain('15 / 20');
    expect(root.querySelector('.monitor-row a')?.getAttribute('href')).toBe('/sorelle/dashboard/manufactures/productions/1');
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

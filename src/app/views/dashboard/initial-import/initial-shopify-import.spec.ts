import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { InitialShopifyImportComponent } from './initial-shopify-import.component';
import { InitialShopifyImportService } from './initial-shopify-import.service';
import { navInitialImport } from '../../../layout/default-layout/navs/_nav.initial-import';
import { filterNavigation } from '../../../layout/default-layout/navs/filter-navigation';

describe('First Shopify import', () => {
  const run = { id: 'run-1', status: 'queued', current_task: 'orders', error_message: null, counts: { orders: 0 }, completed_tasks: 0, total_tasks: 4,
    can_resume: false, current: null, created_at: '2026-11-16T10:00:00Z', updated_at: '2026-11-16T10:00:00Z', completed_at: null };
  let service: jasmine.SpyObj<InitialShopifyImportService>;
  beforeEach(() => {
    service = jasmine.createSpyObj('InitialShopifyImportService', ['state', 'startImport', 'resumeImport']);
    service.state.and.returnValue(of({ data: { checks: [{ label: 'Estructura local', ready: true }], runs: [] } }));
    TestBed.configureTestingModule({ providers: [{ provide: InitialShopifyImportService, useValue: service }] });
  });
  it('restricts the menu to management roles', () => {
    expect(filterNavigation(navInitialImport, ['sales']).length).toBe(0);
    expect(filterNavigation(navInitialImport, ['ceo'])[0].name).toBe('Primera importación');
  });
  it('shows verified attachment progress and incomplete evidence explicitly', () => {
    service.state.and.returnValue(of({ data: { checks: [], runs: [{ ...run, status: 'failed', attachments: { total: 3, downloaded: 2, failed: 1 } } as any] } }));
    const fixture = TestBed.createComponent(InitialShopifyImportComponent); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('2 de 3 respaldados');
    expect(fixture.nativeElement.textContent).toContain('1 adjuntos requieren reintento');
    expect(fixture.nativeElement.textContent).not.toContain('La copia está completa');
    fixture.destroy();
  });
  it('distinguishes copied data from unavailable historical comments', () => {
    service.state.and.returnValue(of({ data: { checks: [], runs: [{ ...run, status: 'completed', timeline_unavailable_orders: 5 } as any] } }));
    const fixture = TestBed.createComponent(InitialShopifyImportComponent); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Historial limitado en 5 pedidos');
    expect(fixture.nativeElement.textContent).not.toContain('La copia está completa');
    fixture.destroy();
  });
  it('queues one import and prevents repeated clicks while starting', () => {
    const pending = new Subject<any>(); service.startImport.and.returnValue(pending);
    const fixture = TestBed.createComponent(InitialShopifyImportComponent); fixture.detectChanges();
    fixture.componentInstance.start(); fixture.componentInstance.start();
    expect(service.startImport).toHaveBeenCalledTimes(1);
    pending.next({ data: run }); pending.complete(); fixture.detectChanges();
    expect(fixture.componentInstance.saving).toBeFalse();
    fixture.destroy();
  });
  it('polls active work and stops polling completed imports', fakeAsync(() => {
    service.state.and.returnValue(of({ data: { checks: [], runs: [run as any] } }));
    const fixture = TestBed.createComponent(InitialShopifyImportComponent); fixture.detectChanges();
    tick(3000); expect(service.state).toHaveBeenCalledTimes(2);
    service.state.and.returnValue(of({ data: { checks: [], runs: [{ ...run, status: 'completed' } as any] } }));
    tick(3000); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('La copia está completa');
    tick(6000); expect(service.state).toHaveBeenCalledTimes(3);
    fixture.destroy();
  }));
  it('keeps the progress visible when refreshing fails and permits resuming a failed run', () => {
    service.state.and.returnValue(of({ data: { checks: [], runs: [{ ...run, status: 'failed', can_resume: true, error_message: 'Pausa de Shopify' } as any] } }));
    const fixture = TestBed.createComponent(InitialShopifyImportComponent); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Reanudar importación');
    service.state.and.returnValue(throwError(() => ({}))); fixture.componentInstance.refresh(); fixture.detectChanges();
    expect(fixture.componentInstance.latest?.id).toBe('run-1');
    service.resumeImport.and.returnValue(of({ data: run as any })); fixture.componentInstance.resume();
    expect(service.resumeImport).toHaveBeenCalledOnceWith('run-1');
    fixture.destroy();
  });
});

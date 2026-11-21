import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { navOrders } from '../../../layout/default-layout/navs/_nav.orders';
import { navInitialImport } from '../../../layout/default-layout/navs/_nav.initial-import';
import { ImportedOrderDetail, ImportedOrderList } from '../initial-import/orders/imported-order.model';
import { ImportedOrdersService } from '../initial-import/orders/imported-orders.service';
import { OrderStatusStepperComponent } from '../shopify/orders/shared/order-status-stepper/order-status-stepper.component';
import { toWorkspaceDetail, toWorkspacePage } from './order-workspace.mapper';
import { OrderWorkspaceListComponent } from './order-workspace-list.component';
import { OrderWorkspaceDetailComponent } from './order-workspace-detail.component';
import { OrderWorkspaceService } from './order-workspace.service';
import { routes } from './routes.order-workspace';

const importedOrder = {
  id: 12, run_id: 'run-1', shopify_id: 'gid://shopify/Order/10956', name: '#10956', created_at: '2026-11-17T16:54:42Z',
  customer: 'Cliente de prueba', email: null, financial_status: 'PAID', fulfillment_status: 'UNFULFILLED', cancelled_at: null,
  total: { amount: '119.80', currencyCode: 'PEN' }, timeline_status: 'available', comment_count: 0, events_count: 0,
  units_count: 2, item_count: 1, packing_items: [{ id: 'line-1', title: 'Blusa Renata', variantTitle: 'Azul / M', quantity: 3, currentQuantity: 2 }],
};
const importedPage: ImportedOrderList = {
  run: { id: 'run-1', status: 'completed', created_at: '2026-11-17T15:00:00Z' }, runs: [], items: [importedOrder],
  summary: { total: 3, with_comments: 0, unavailable: 0, unchecked: 0 }, packing_summary: { total: 3, ready: 1, preparing: 1, shipped: 1 },
  pagination: { page: 1, last_page: 2, total: 3 },
};
const importedDetail: ImportedOrderDetail = {
  run: importedPage.run!, order: { ...importedOrder, fulfillment_status: 'FULFILLED', payload: { note: 'Entregar por la tarde', shippingAddress: { city: 'Lima', address1: 'Dirección de prueba' } } },
  items: [...importedOrder.packing_items, { id: 'removed', title: 'Eliminado', quantity: 1, currentQuantity: 0 }],
  related: { transactions: [{ id: 'payment-1', kind: 'SALE', status: 'SUCCESS', createdAt: '2026-11-17T16:54:42Z' }], fulfillments: [{ id: 'shipment-1', status: 'SUCCESS', displayStatus: 'FULFILLED', createdAt: '2026-11-17T16:54:49Z' }], refunds: [] },
  event_counts: { all: 0, comments: 0, system: 0 }, step_events: [{ action: 'sale_success', createdAt: '2026-11-17T16:54:43Z' }], shopify_url: 'https://example.myshopify.com/admin/orders/10956',
};

describe('Orders new version', () => {
  let query: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let service: jasmine.SpyObj<OrderWorkspaceService>;
  let source: jasmine.SpyObj<ImportedOrdersService>;

  beforeEach(() => {
    query = new BehaviorSubject(convertToParamMap({ work: 'ready', q: '#10956', page: '1' }));
    service = jasmine.createSpyObj('OrderWorkspaceService', ['list', 'detail']);
    service.list.and.returnValue(of(toWorkspacePage(importedPage)));
    service.detail.and.returnValue(of(toWorkspaceDetail(importedDetail)));
    source = jasmine.createSpyObj('ImportedOrdersService', ['list', 'detail', 'events']);
    source.events.and.returnValue(of({ data: { items: [], pagination: { page: 1, last_page: 1, total: 0 } } }));
    TestBed.configureTestingModule({ providers: [
      provideRouter([]), { provide: OrderWorkspaceService, useValue: service }, { provide: ImportedOrdersService, useValue: source },
      { provide: ActivatedRoute, useValue: { queryParamMap: query, paramMap: of(convertToParamMap({ id: '12' })), snapshot: { queryParams: {}, params: { id: '12' }, data: {}, url: [] } } },
    ] });
  });

  it('keeps the new version below orders inside first import and lazy loads its own pages', async () => {
    expect(navOrders.map(item => item.url)).toEqual(['dashboard/orders']);
    expect(navInitialImport[0].children?.map(item => item.url)).toEqual(['dashboard/initial-import/shopify', 'dashboard/initial-import/orders', 'dashboard/orders-next']);
    expect(navOrders[0].children?.[0].url).toBe('dashboard/orders');
    expect(navInitialImport[0].roles).toEqual(['master', 'ceo', 'admin']);
    expect(routes[0].canActivate?.length).toBe(1);
    expect(await routes[0].loadComponent!()).toBe(OrderWorkspaceListComponent);
    expect(await routes[1].loadComponent!()).toBe(OrderWorkspaceDetailComponent);
  });

  it('maps current quantities and real progress dates without changing the import payload', () => {
    const before = JSON.stringify(importedDetail);
    const result = toWorkspaceDetail(importedDetail);
    expect(result.order.products.length).toBe(1);
    expect(result.order.products[0].quantity).toBe(2);
    expect(result.order.units).toBe(2);
    expect(result.order.products[0].variant).toBe('Azul / M');
    expect(result.progress).toBe('enviado');
    expect(result.dates.enviado).toBe('2026-11-17T16:54:49Z');
    expect(result.dates.preparacion).toBeUndefined();
    expect(JSON.stringify(importedDetail)).toBe(before);
    expect(toWorkspacePage({ ...importedPage, items: [{ ...importedOrder, cancelled_at: '2026-11-17T17:00:00Z' }] }).orders[0].preparation).toBe('cancelled');
    expect(toWorkspacePage({ ...importedPage, items: [{ ...importedOrder, financial_status: 'PENDING' }] }).orders[0].preparation).toBe('review');
    expect(toWorkspacePage({ ...importedPage, items: [{ ...importedOrder, fulfillment_status: 'PARTIALLY_FULFILLED' }] }).orders[0].partiallyShipped).toBeTrue();
  });

  it('shows quantities and variants and keeps filtering and navigation within the new version', () => {
    const fixture = TestBed.createComponent(OrderWorkspaceListComponent); fixture.detectChanges();
    expect(service.list).toHaveBeenCalledWith({ work: 'ready', q: '#10956', page: '1' });
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Blusa Renata'); expect(element.textContent).toContain('Azul / M');
    expect(element.querySelector('.quantity.multiple')?.textContent).toContain('2');
    expect(element.textContent).not.toContain('Ver importación');
    expect(fixture.componentInstance.detailQuery).toEqual({ work: 'ready', q: '#10956', page: '1', run_id: 'run-1' });
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture.componentInstance.filter('shipped');
    expect(navigate.calls.mostRecent().args[1]?.queryParams).toEqual({ work: 'shipped', q: '#10956', page: '1' });
    fixture.destroy();
  });

  it('cancels stale list loads and offers retry on failure', () => {
    const pending = new Subject<ReturnType<typeof toWorkspacePage>>(); service.list.and.returnValue(pending);
    const fixture = TestBed.createComponent(OrderWorkspaceListComponent); fixture.detectChanges();
    expect(pending.observed).toBeTrue();
    service.list.and.returnValue(throwError(() => new Error('offline')));
    query.next(convertToParamMap({ work: 'shipped' })); fixture.detectChanges();
    expect(pending.observed).toBeFalse(); expect(fixture.nativeElement.textContent).toContain('No se pudieron cargar');
    service.list.and.returnValue(of(toWorkspacePage(importedPage)));
    fixture.componentInstance.retry(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('#10956');
    fixture.destroy();
  });

  it('opens its own detail using the existing stepper and history with no edit actions', () => {
    const fixture = TestBed.createComponent(OrderWorkspaceDetailComponent); fixture.detectChanges();
    expect(service.detail).toHaveBeenCalledWith(12);
    expect(fixture.nativeElement.textContent).toContain('Entregar por la tarde');
    expect(fixture.nativeElement.textContent).toContain('Cliente y entrega');
    expect(fixture.nativeElement.querySelector('app-imported-order-timeline')).not.toBeNull();
    const stepper = fixture.debugElement.query(By.directive(OrderStatusStepperComponent)).componentInstance as OrderStatusStepperComponent;
    expect(stepper.status).toBe('enviado'); expect(stepper.dates.enviado).toBe('2026-11-17T16:54:49Z');
    expect(fixture.nativeElement.textContent).not.toContain('Guardar cambios');
    fixture.destroy();
  });

  it('uses a read-only adapter so the source can later change to orders', () => {
    source.list.and.returnValue(of({ data: importedPage })); source.detail.and.returnValue(of({ data: importedDetail }));
    const adapter = TestBed.runInInjectionContext(() => new OrderWorkspaceService());
    adapter.list({ work: 'ready' }).subscribe(page => expect(page.orders[0].number).toBe('#10956'));
    adapter.detail(12).subscribe(detail => expect(detail.order.units).toBe(2));
    expect(source.list).toHaveBeenCalledOnceWith({ work: 'ready' }); expect(source.detail).toHaveBeenCalledOnceWith(12);
  });
});

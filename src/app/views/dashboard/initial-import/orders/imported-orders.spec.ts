import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Fancybox } from '@fancyapps/ui';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';
import { OrderStatusStepperComponent } from '../../shopify/orders/shared/order-status-stepper/order-status-stepper.component';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { ImportedOrdersComponent } from './imported-orders.component';
import { ImportedOrderDetailComponent } from './imported-order-detail.component';
import { ImportedOrderTimelineComponent } from './imported-order-timeline.component';
import { ImportedOrderAttachmentComponent } from './imported-order-attachment.component';
import { ImportedOrderSyncComponent } from './imported-order-sync.component';
import { ImportedOrderItemImageComponent } from './imported-order-item-image.component';
import { ImportedOrdersService } from './imported-orders.service';
import { ImportedOrderDetail, ImportedOrderList, ImportedOrderUpdate } from './imported-order.model';
import { navInitialImport } from '../../../../layout/default-layout/navs/_nav.initial-import';

describe('Imported Shopify order browser', () => {
  let service: jasmine.SpyObj<ImportedOrdersService>;
  let query: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  const order = { id: 7, run_id: 'run-1', shopify_id: 'gid://shopify/Order/100', name: '#100', created_at: '2026-11-01T10:00:00Z', customer: 'Cliente de prueba', email: null, financial_status: 'PAID', fulfillment_status: 'FULFILLED', cancelled_at: null, total: { amount: '75.00', currencyCode: 'PEN' }, timeline_status: 'unavailable_comments', comment_count: 0, events_count: 1 };
  const list: ImportedOrderList = { run: { id: 'run-1', created_at: '2026-11-17T10:00:00Z', status: 'completed' }, runs: [], items: [order], summary: { total: 3, unavailable: 1, with_comments: 1, unchecked: 1 }, pagination: { page: 1, last_page: 2, total: 30 } };
  const basic = { id: 1, shopify_id: 'gid://shopify/BasicEvent/1', kind: 'BasicEvent', created_at: '2026-11-01T10:00:00Z', message: 'Pedido creado', edited: false, critical: false, attachments: [], payload: { message: '<img src=x onerror=alert(1)>' } };
  const detail: ImportedOrderDetail = { order: { ...order, payload: { note: 'Nota del pedido' } }, run: list.run!, items: [], related: { transactions: [], fulfillments: [], refunds: [], shipping_lines: [], discounts: [], addresses: [], metafields: [], fulfillment_items: [], fulfillment_events: [], refund_items: [], refund_shipping_lines: [], refund_adjustments: [] }, event_counts: { all: 1, comments: 0, system: 1 }, shopify_url: 'https://example.myshopify.com/admin/orders/100' };
  beforeEach(() => {
    query = new BehaviorSubject(convertToParamMap({ timeline: 'unavailable', q: '#100', page: '1' }));
    service = jasmine.createSpyObj('ImportedOrdersService', ['list', 'detail', 'events', 'attachment', 'findNewOrders', 'orderUpdate']);
    service.list.and.returnValue(of({ data: list })); service.detail.and.returnValue(of({ data: detail }));
    service.events.and.returnValue(of({ data: { items: [basic], pagination: { page: 1, last_page: 1, total: 1 } } }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: ImportedOrdersService, useValue: service }, { provide: ActivatedRoute, useValue: { queryParamMap: query, paramMap: of(convertToParamMap({ id: '7' })), snapshot: { queryParams: {}, params: { id: '7' }, data: {}, url: [] } } }] });
  });
  it('adds the orders submenu and preserves run, filters and search in detail links', () => {
    expect(navInitialImport[0].children?.some(item => item.url === 'dashboard/initial-import/orders')).toBeTrue();
    const fixture = TestBed.createComponent(ImportedOrdersComponent); fixture.detectChanges();
    expect(service.list).toHaveBeenCalledWith({ timeline: 'unavailable', q: '#100', page: '1' });
    expect(fixture.nativeElement.textContent).toContain('Comentarios no recuperados');
    expect(fixture.componentInstance.detailQuery).toEqual({ timeline: 'unavailable', q: '#100', page: '1', run_id: 'run-1' });
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture.componentInstance.page(2);
    expect(navigate.calls.mostRecent().args[1]?.queryParams).toEqual({ timeline: 'unavailable', q: '#100', page: '2' });
    fixture.componentInstance.clear();
    expect(navigate.calls.mostRecent().args[1]?.queryParams).toEqual({ timeline: 'all', q: null, work: 'all', page: '1' });
    fixture.destroy();
  });
  it('prioritizes packing quantities, variants and payment while preserving operational filters', () => {
    query.next(convertToParamMap({ work: 'ready', page: '1' }));
    service.list.and.returnValue(of({ data: { ...list, packing_summary: { total: 3, ready: 1, preparing: 1, shipped: 1 }, items: [{ ...order,
      packing_state: 'ready', fulfillment_status: 'UNFULFILLED', destination: 'Lima', item_count: 1, units_count: 2,
      packing_items: [{ id: 'line-1', title: 'Blusa Renata', variantTitle: 'Azul / M', quantity: 2, display_image: {
        url: 'https://cdn.shopify.com/blusa.jpg', url_thumbnail: 'https://cdn.shopify.com/blusa.jpg?width=128', url_large: 'https://cdn.shopify.com/blusa.jpg', altText: 'Blusa',
      } }],
    }] } }));
    const fixture = TestBed.createComponent(ImportedOrdersComponent); fixture.detectChanges();
    const row: HTMLElement = fixture.nativeElement.querySelector('tbody tr');
    expect(row.textContent).toContain('Por empacar'); expect(row.textContent).toContain('2 unidades');
    expect(row.textContent).toContain('Azul / M'); expect(row.textContent).not.toContain('Sin correo registrado');
    expect(row.querySelector('.item-quantity.multiple')?.textContent).toContain('2');
    expect(row.querySelector('img')?.getAttribute('src')).toContain('?width=128');
    const image = fixture.debugElement.query(By.directive(ImagePreviewComponent)).componentInstance as ImagePreviewComponent;
    expect(image.previewVariant).toBe('large');
    expect(fixture.componentInstance.detailQuery['work']).toBe('ready');
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture.componentInstance.filterWork('shipped');
    expect(navigate.calls.mostRecent().args[1]?.queryParams).toEqual({ work: 'shipped', page: '1' });
    fixture.destroy();
  });
  it('cancels stale list requests when the filter changes and permits retrying failures', () => {
    const pending = new Subject<any>(); service.list.and.returnValue(pending);
    const fixture = TestBed.createComponent(ImportedOrdersComponent); fixture.detectChanges();
    expect(pending.observed).toBeTrue();
    service.list.and.returnValue(throwError(() => new Error('offline')));
    query.next(convertToParamMap({ timeline: 'with_comments' })); fixture.detectChanges();
    expect(pending.observed).toBeFalse(); expect(fixture.nativeElement.textContent).toContain('No se pudieron cargar');
    service.list.and.returnValue(of({ data: list })); fixture.componentInstance.retry(); fixture.detectChanges();
    expect(fixture.componentInstance.error).toBe(''); expect(fixture.nativeElement.textContent).toContain('#100');
    fixture.destroy();
  });
  it('shows the unavailable-comments warning alongside recovered system events without rendering imported HTML', () => {
    const fixture = TestBed.createComponent(ImportedOrderDetailComponent); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Los comentarios de este pedido no se pudieron recuperar');
    expect(fixture.nativeElement.textContent).toContain('Pedido creado');
    expect(fixture.nativeElement.textContent).toContain('Nota del pedido');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.querySelector('script')).toBeNull();
    fixture.destroy();
  });
  it('reuses the order stepper and derives payment, dispatch and cancellation from imported states', () => {
    service.detail.and.returnValue(of({ data: { ...detail, order: { ...detail.order, fulfillment_status: 'UNFULFILLED' } } }));
    const fixture = TestBed.createComponent(ImportedOrderDetailComponent); fixture.detectChanges();
    const stepper = fixture.debugElement.query(By.directive(OrderStatusStepperComponent)).componentInstance as OrderStatusStepperComponent;
    expect(stepper.status).toBe('pago_confirmado');
    expect(fixture.nativeElement.querySelector('li[aria-current="step"]').textContent).toContain('Pago confirmado');
    fixture.componentInstance.data = { ...detail, related: { ...detail.related, fulfillments: [{ id: 'shipment-1', status: 'SUCCESS', displayStatus: 'FULFILLED' }] } }; fixture.detectChanges();
    expect(stepper.status).toBe('enviado');
    expect(fixture.nativeElement.querySelector('li[aria-current="step"]').textContent).toContain('Enviado');
    fixture.componentInstance.data = { ...detail, order: { ...detail.order, fulfillment_status: 'PARTIALLY_FULFILLED' } }; fixture.detectChanges();
    expect(stepper.status).toBe('preparacion');
    fixture.componentInstance.data = { ...detail, order: { ...detail.order, cancelled_at: '2026-11-17T10:00:00Z' } }; fixture.detectChanges();
    expect(stepper.cancelled).toBeTrue(); expect(fixture.nativeElement.querySelector('li[aria-current="step"]')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Pedido cancelado');
    fixture.componentInstance.data = { ...detail, order: { ...detail.order, fulfillment_status: 'ON_HOLD' } }; fixture.detectChanges();
    expect(stepper.onHold).toBeTrue(); expect(fixture.nativeElement.textContent).toContain('La preparación está en espera');
    fixture.destroy();
  });
  it('paginates events and cancels a pending request when changing event type', () => {
    const fixture = TestBed.createComponent(ImportedOrderTimelineComponent);
    fixture.componentRef.setInput('orderId', 7); fixture.componentRef.setInput('counts', { all: 2, comments: 1, system: 1 });
    service.events.and.returnValue(of({ data: { items: [basic], pagination: { page: 1, last_page: 2, total: 2 } } }));
    fixture.detectChanges();
    const pending = new Subject<any>(); service.events.and.returnValue(pending); fixture.componentInstance.load();
    expect(service.events).toHaveBeenCalledWith(7, 'all', 2);
    service.events.and.returnValue(of({ data: { items: [], pagination: { page: 1, last_page: 1, total: 0 } } }));
    fixture.componentInstance.select('comments'); fixture.detectChanges();
    expect(pending.observed).toBeFalse(); expect(fixture.componentInstance.items).toEqual([]);
    expect(service.events).toHaveBeenCalledWith(7, 'comments', 1);
    fixture.destroy();
  });
  it('shows short real step dates instead of completed and leaves unknown preparation dates explicit', () => {
    service.detail.and.returnValue(of({ data: { ...detail, related: { ...detail.related,
      transactions: [{ id: 'pay-1', kind: 'SALE', status: 'SUCCESS', processedAt: '2026-11-14T21:07:00Z' }],
      fulfillments: [{ id: 'ship-1', status: 'SUCCESS', createdAt: '2026-11-15T15:00:00Z' }],
    }, step_events: [{ action: 'sale_success', createdAt: '2026-11-14T21:08:00Z' }] } }));
    const fixture = TestBed.createComponent(ImportedOrderDetailComponent); fixture.detectChanges();
    const stepper: HTMLElement = fixture.nativeElement.querySelector('app-order-status-stepper');
    const paymentDate = stepper.querySelector('time[datetime="2026-11-14T21:07:00Z"]')!;
    expect(paymentDate).not.toBeNull(); expect(paymentDate.textContent).not.toContain('a las');
    expect(stepper.textContent).not.toContain('Completado'); expect(stepper.textContent).toContain('Sin fecha');
    const sent = stepper.querySelector('li[aria-current="step"]')!;
    expect(sent.querySelector('time')?.getAttribute('datetime')).toBe('2026-11-15T15:00:00Z');
    fixture.destroy();
  });
  it('loads a private attachment through the authenticated service and releases its object URL', () => {
    const create = spyOn(URL, 'createObjectURL').and.returnValue('blob:receipt-preview'); const revoke = spyOn(URL, 'revokeObjectURL');
    service.attachment.and.returnValue(of(new Blob(['receipt'], { type: 'image/png' })));
    const fixture = TestBed.createComponent(ImportedOrderAttachmentComponent);
    fixture.componentRef.setInput('orderId', 7); fixture.componentRef.setInput('file', { id: 4, name: 'pago.png', status: 'downloaded', is_image: true, bytes: 7, remote_url: null });
    fixture.detectChanges();
    expect(service.attachment).toHaveBeenCalledOnceWith(7, 4); expect(create).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe('blob:receipt-preview');
    fixture.destroy(); expect(revoke).toHaveBeenCalledWith('blob:receipt-preview');
  });
  const update: ImportedOrderUpdate = { id: 1, run_id: 'run-1', status: 'queued', checked_orders: 0, added_orders: 0, completed_tasks: 0, total_tasks: 0, search_from: '2026-11-16T00:00:00Z', search_until: '2026-11-17T10:00:00Z', created_at: '2026-11-17T10:00:00Z', completed_at: null, error_message: null, can_resume: false };
  it('uses the shared image lightbox with thumbnail-only rendering and a large viewer source', () => {
    const bind = spyOn(Fancybox, 'bind');
    const fixture = TestBed.createComponent(ImportedOrderItemImageComponent);
    const first = 'data:image/png;base64,thumb'; const fallback = 'data:image/png;base64,fallbackthumb';
    const large = 'data:image/png;base64,large'; const fallbackLarge = 'data:image/png;base64,fallbacklarge';
    fixture.componentRef.setInput('title', 'Polo perla'); fixture.componentRef.setInput('image', { url: large, url_thumbnail: first, url_large: large, altText: 'Polo perla', fallback_images: [{ url_thumbnail: fallback, url_large: fallbackLarge }] }); fixture.detectChanges();
    const shared = fixture.debugElement.query(By.directive(ImagePreviewComponent)).componentInstance as ImagePreviewComponent;
    expect(shared.previewVariant).toBe('large'); expect(shared.objectFit).toBe('contain'); expect(bind).toHaveBeenCalled();
    const thumbnail: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(thumbnail.alt).toBe('Polo perla'); expect(thumbnail.src).toBe(first);
    expect(fixture.nativeElement.querySelectorAll('img').length).toBe(1);
    expect(fixture.nativeElement.querySelector('a[data-fancybox]').getAttribute('href')).toBe(large);
    expect(fixture.nativeElement.querySelector('dialog')).toBeNull();
    thumbnail.dispatchEvent(new Event('error')); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img').src).toBe(fallback);
    expect(fixture.nativeElement.querySelector('a[data-fancybox]').getAttribute('href')).toBe(fallbackLarge);
    fixture.nativeElement.querySelector('.thumbnail img').dispatchEvent(new Event('error')); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.thumbnail')).toBeNull(); expect(fixture.nativeElement.textContent).toContain('Sin imagen');
    fixture.destroy();
  });
  it('starts only one search, polls the background import and refreshes the list on completion', fakeAsync(() => {
    const pending = new Subject<any>(); service.findNewOrders.and.returnValue(pending);
    service.orderUpdate.and.returnValues(of({ data: { ...update, status: 'importing', checked_orders: 5, added_orders: 3, total_tasks: 9 } }), of({ data: { ...update, status: 'completed', added_orders: 3, completed_tasks: 9, total_tasks: 9, completed_at: '2026-11-17T10:01:00Z' } }));
    const fixture = TestBed.createComponent(ImportedOrderSyncComponent); fixture.componentRef.setInput('run', list.run); fixture.detectChanges();
    const finished = spyOn(fixture.componentInstance.finished, 'emit');
    fixture.componentInstance.start(); fixture.componentInstance.start(); expect(service.findNewOrders).toHaveBeenCalledOnceWith('run-1');
    pending.next({ data: update }); pending.complete(); tick(0); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Importando pedidos'); expect(fixture.nativeElement.querySelector('button').disabled).toBeTrue();
    tick(3000); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('3 pedidos nuevos importados'); expect(finished).toHaveBeenCalledTimes(1);
    tick(6000); expect(service.orderUpdate).toHaveBeenCalledTimes(2); fixture.destroy();
  }));
  it('recovers progress polling after a connection error and reports a search with no new orders', fakeAsync(() => {
    service.orderUpdate.and.returnValues(throwError(() => new Error('offline')), of({ data: { ...update, status: 'completed', completed_at: '2026-11-17T10:01:00Z' } }));
    const fixture = TestBed.createComponent(ImportedOrderSyncComponent); fixture.componentRef.setInput('run', list.run); fixture.componentRef.setInput('initialUpdate', update); fixture.detectChanges();
    tick(0); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('No se pudo actualizar el progreso');
    tick(3000); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('No hay pedidos nuevos pendientes'); expect(fixture.componentInstance.pollError).toBeFalse(); fixture.destroy();
  }));
  it('cancels the old progress request when changing import executions', fakeAsync(() => {
    const pending = new Subject<any>(); service.orderUpdate.and.returnValue(pending);
    const fixture = TestBed.createComponent(ImportedOrderSyncComponent); fixture.componentRef.setInput('run', list.run); fixture.componentRef.setInput('initialUpdate', update); fixture.detectChanges();
    tick(0); expect(pending.observed).toBeTrue();
    fixture.componentRef.setInput('run', { ...list.run!, id: 'another-run' }); fixture.componentRef.setInput('initialUpdate', null); fixture.detectChanges();
    expect(pending.observed).toBeFalse(); expect(fixture.componentInstance.update).toBeNull(); fixture.destroy();
  }));
});

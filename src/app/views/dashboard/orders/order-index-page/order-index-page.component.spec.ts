import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { OrderListItem, OrderPage } from 'src/app/interfaces/order.interface';
import { OrderService } from '../order.service';
import { OrderIndexPageComponent } from './order-index-page.component';

describe('OrderIndexPageComponent', () => {
  let component: OrderIndexPageComponent;
  let requests: Subject<OrderPage>[];
  let fixture: ComponentFixture<OrderIndexPageComponent>;
  let list: jasmine.Spy;

  beforeEach(() => {
    requests = [];
    list = jasmine.createSpy('list').and.callFake(() => {
      const request = new Subject<OrderPage>();
      requests.push(request);
      return request;
    });
    TestBed.configureTestingModule({
      imports: [OrderIndexPageComponent],
      providers: [{ provide: OrderService, useValue: { list } }],
    }).overrideComponent(OrderIndexPageComponent, { set: { template: '', imports: [] } });
    fixture = TestBed.createComponent(OrderIndexPageComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  function respond(position: number, data: OrderListItem[], hasMore = true): void {
    requests[position].next({ orders: data, total: 3, hasMore });
    requests[position].complete();
  }

  it('loads the first page and displays the total supplied by the service', () => {
    expect(list).toHaveBeenCalledWith(1, undefined);
    expect(component.loading).toBeTrue();
    respond(0, [{ id: 1 }]);
    expect(component.orders).toEqual([{ id: 1 }]);
    expect(component.total).toBe(3);
    expect(component.hasMore).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('appends pages without duplicates and blocks overlapping requests', () => {
    respond(0, [{ id: 1 }, { id: 2 }]);
    component.loadMoreOrders();
    component.loadMoreOrders();
    expect(list).toHaveBeenCalledTimes(2);
    expect(list).toHaveBeenCalledWith(2, undefined);
    respond(1, [{ id: 2 }, { id: 3 }], false);
    expect(component.orders.map(order => order.id)).toEqual([1, 2, 3]);
    expect(component.hasMore).toBeFalse();
    component.loadMoreOrders();
    expect(list).toHaveBeenCalledTimes(2);
  });

  it('preserves loaded orders and retries the failed page', () => {
    respond(0, [{ id: 1 }]);
    component.loadMoreOrders();
    requests[1].error(new Error('Network error'));
    expect(component.loadingMore).toBeFalse();
    expect(component.page).toBe(1);
    expect(component.orders).toEqual([{ id: 1 }]);
    expect(component.error).toBeTruthy();
    component.retry();
    expect(list.calls.mostRecent().args).toEqual([2, undefined]);
    respond(2, [{ id: 2 }]);
    expect(component.error).toBe('');
    expect(component.orders.length).toBe(2);
  });

  it('resets pagination when filtering by status', () => {
    respond(0, [{ id: 1 }]);
    component.changeStatus('registrado');
    expect(component.orders).toEqual([]);
    expect(list.calls.mostRecent().args).toEqual([1, 'registrado']);
    respond(1, [{ id: 3 }], false);
    expect(component.orders).toEqual([{ id: 3 }]);
    expect(component.hasMore).toBeFalse();
  });

  it('stops requesting pages after an empty result', () => {
    requests[0].next({ orders: [], total: null, hasMore: false });
    requests[0].complete();
    expect(component.hasMore).toBeFalse();
    expect(component.total).toBeNull();
  });

  it('ignores invalid and unchanged status filters', () => {
    respond(0, [{ id: 1 }]);
    component.changeStatus('');
    component.changeStatus('invalid');
    expect(list).toHaveBeenCalledTimes(1);
  });

  it('stops automatic loading when a page repeats the same orders', () => {
    respond(0, [{ id: 1 }]);
    component.loadMoreOrders();
    respond(1, [{ id: 1 }]);
    expect(component.orders).toEqual([{ id: 1 }]);
    expect(component.hasMore).toBeFalse();
  });

  it('cancels an active request when the page is destroyed', () => {
    expect(requests[0].observed).toBeTrue();
    fixture.destroy();
    expect(requests[0].observed).toBeFalse();
    expect(component.isLoading).toBeFalse();
  });

  it('searches loaded orders by customer, document, phone and order number', () => {
    respond(0, [{ id: 12, addresses: [{ purpose: 'shipping', name: 'María Torres', phone: '943402809', document_number: '42412498' }] }, { id: 13 }]);
    for (const search of ['maria', '943402809', '42412498', '#12']) {
      component.search = search;
      expect(component.filteredOrders.map(order => order.id)).toEqual([12]);
    }
    expect(list).toHaveBeenCalledTimes(1);
  });

  it('combines search with delivery mode using the address owner', () => {
    respond(0, [
      { id: 1, addresses: [{ purpose: 'shipping', name: 'Angel' }] },
      { id: 2, addresses: [{ purpose: 'shipping', name: 'Angel' }], courier_address: { addressable: { delivery_type: 'agency' } } },
    ]);
    component.search = 'Angel';
    component.delivery = 'agency';
    expect(component.filteredOrders.map(order => order.id)).toEqual([2]);
    component.delivery = 'store_pickup';
    expect(component.filteredOrders.map(order => order.id)).toEqual([1]);
  });

  it('clears local filters without requesting the same server status again', () => {
    respond(0, [{ id: 1 }]);
    component.search = 'missing';
    component.delivery = 'agency';
    component.clearFilters();
    expect(component.filteredOrders).toEqual(component.orders);
    expect(component.hasActiveFilters).toBeFalse();
    expect(list).toHaveBeenCalledTimes(1);
  });
});

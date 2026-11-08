import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { OrderService } from '../order.service';
import { OrderEditPageComponent } from './order-edit-page.component';

describe('OrderEditPageComponent', () => {
  let component: OrderEditPageComponent;
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let requests: Subject<any>[];
  let get: jasmine.Spy;

  beforeEach(() => {
    params = new BehaviorSubject(convertToParamMap({ order_id: '42' }));
    requests = [];
    get = jasmine.createSpy('get').and.callFake(() => {
      const request = new Subject();
      requests.push(request);
      return request;
    });
    TestBed.configureTestingModule({
      imports: [OrderEditPageComponent],
      providers: [{ provide: ActivatedRoute, useValue: { paramMap: params } },
        { provide: OrderService, useValue: { get } }],
    }).overrideComponent(OrderEditPageComponent, { set: { template: '', imports: [] } });
    component = TestBed.createComponent(OrderEditPageComponent).componentInstance;
    component.ngOnInit();
  });

  it('captures order_id and loads the order', () => {
    expect(get).toHaveBeenCalledWith('42');
    expect(component.loading).toBeTrue();
    requests[0].next({ data: { id: 42 } });
    requests[0].complete();
    expect(component.order.id).toBe(42);
    expect(component.loading).toBeFalse();
  });

  it('discards older responses when the route changes', () => {
    params.next(convertToParamMap({ order_id: '43' }));
    requests[0].next({ data: { id: 42 } });
    expect(component.order).toBeNull();
    requests[1].next({ data: { id: 43 } });
    requests[1].complete();
    expect(component.order_id).toBe('43');
    expect(component.order.id).toBe(43);
  });

  it('allows retrying a failed request', () => {
    requests[0].error(new Error('Error de red'));
    expect(component.loading).toBeFalse();
    expect(component.error).toBeTruthy();
    component.loadOrder();
    requests[1].next({ data: { id: 42 } });
    requests[1].complete();
    expect(component.error).toBe('');
    expect(component.order.id).toBe(42);
  });
});

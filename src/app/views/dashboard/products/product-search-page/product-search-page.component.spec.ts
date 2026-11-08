import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProductService } from '../product.service';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { ProductSearchPageComponent } from './product-search-page.component';

describe('Product search results', () => {
  let requests: Subject<any>[];
  let search: jasmine.Spy;
  let queryParams: BehaviorSubject<Record<string, string>>;

  beforeEach(() => {
    requests = [];
    queryParams = new BehaviorSubject<Record<string, string>>({ search: '' });
    search = jasmine.createSpy('search').and.callFake(() => {
      const response = new Subject<any>();
      requests.push(response);
      return response;
    });
    TestBed.configureTestingModule({ providers: [
      { provide: ProductService, useValue: { search } },
      { provide: ActivatedRoute, useValue: { queryParams } },
    ] });
    TestBed.overrideComponent(ProductSearchPageComponent, { set: { imports: [ProductSearchComponent], schemas: [NO_ERRORS_SCHEMA] } });
  });

  it('keeps Oriana results when the browser emits the native search event after submit', () => {
    const fixture = TestBed.createComponent(ProductSearchPageComponent);
    fixture.detectChanges();
    requests[0].next({ data: [] });
    requests[0].complete();
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="search"]');
    input.value = 'oriana';
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    requests[1].next({ data: [{ id: 1, name: 'Oriana' }] });
    requests[1].complete();
    fixture.detectChanges();
    input.dispatchEvent(new Event('search', { bubbles: true }));
    fixture.detectChanges();
    expect(search.calls.count()).toBe(2);
    expect(fixture.componentInstance.params.search).toBe('oriana');
    expect(fixture.componentInstance.products.map(product => product.name)).toEqual(['Oriana']);
    fixture.destroy();
  });

  it('cancels the old unfiltered request so it cannot replace the latest results', () => {
    const fixture = TestBed.createComponent(ProductSearchPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.receiveParams({ search: 'oriana' });
    requests[1].next({ data: [{ id: 1, name: 'Oriana' }] });
    requests[1].complete();
    requests[0].next({ data: [{ id: 2, name: 'Otro producto' }] });
    requests[0].complete();
    expect(fixture.componentInstance.products.map(product => product.name)).toEqual(['Oriana']);
    fixture.destroy();
  });
});
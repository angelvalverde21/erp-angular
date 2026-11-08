import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OrderIndexResponse } from 'src/app/interfaces/order.interface';
import { BaseService } from '../../base.service';
import { OrderService } from './order.service';

describe('OrderService.list', () => {
  let service: OrderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BaseService, useValue: { store: 'demo' } },
      ],
    });
    service = TestBed.inject(OrderService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends the page and selected status as query parameters', () => {
    service.list(2, 'registrado').subscribe();
    const request = http.expectOne(req => req.url === service.baseUrl);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('status')).toBe('registrado');
    request.flush({ data: [] });
  });

  const cases: { name: string; response: OrderIndexResponse; page: number; total: number | null; hasMore: boolean }[] = [
    { name: 'resource metadata', response: { data: [{ id: 1 }], meta: { total: 3, last_page: 2 } }, page: 1, total: 3, hasMore: true },
    { name: 'top-level pagination', response: { data: [{ id: 1 }], total: 3, last_page: 2 }, page: 2, total: 3, hasMore: false },
    { name: 'a next-page link', response: { data: [{ id: 1 }], links: { next: '/orders?page=2' } }, page: 1, total: null, hasMore: true },
    { name: 'the final next-page link', response: { data: [{ id: 1 }], links: { next: null } }, page: 1, total: null, hasMore: false },
    { name: 'a legacy next-page URL', response: { data: [{ id: 1 }], next_page_url: null }, page: 1, total: null, hasMore: false },
    { name: 'a response without pagination', response: { data: [{ id: 1 }] }, page: 1, total: null, hasMore: true },
    { name: 'an empty response', response: { data: [], meta: { total: 0, last_page: 2 } }, page: 1, total: 0, hasMore: false },
  ];

  cases.forEach(({ name, response, page, total, hasMore }) => {
    it(`normalizes ${name}`, () => {
      service.list(page).subscribe(result => {
        expect(result).toEqual({ orders: response.data, total, hasMore });
      });
      const request = http.expectOne(req => req.url === service.baseUrl);
      expect(request.request.params.has('status')).toBeFalse();
      request.flush(response);
    });
  });
});

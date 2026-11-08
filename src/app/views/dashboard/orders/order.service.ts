import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OrderIndexResponse, OrderPage, OrderStatus } from 'src/app/interfaces/order.interface';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseCrudDashboardService {
  constructor(http: HttpClient) {
    super(http, 'orders');
  }

  list(page: number, status?: OrderStatus): Observable<OrderPage> {
    return this.http.get<OrderIndexResponse>(this.baseUrl, {
      params: { page, ...(status && { status }) },
    }).pipe(map(response => this.toOrderPage(response, page)));
  }

  private toOrderPage(response: OrderIndexResponse, page: number): OrderPage {
    const orders = Array.isArray(response.data) ? response.data : [];

    return {
      orders,
      total: response.meta?.total ?? response.total ?? null,
      hasMore: orders.length > 0 && this.hasNextPage(response, page),
    };
  }

  private hasNextPage(response: OrderIndexResponse, page: number): boolean {
    const lastPage = response.meta?.last_page ?? response.last_page;
    if (lastPage != null) return page < lastPage;

    if (response.links && 'next' in response.links) return !!response.links.next;
    if ('next_page_url' in response) return !!response.next_page_url;

    return true;
  }
}


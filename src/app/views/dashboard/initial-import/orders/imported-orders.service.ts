import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { ImportedEventPage, ImportedOrderDetail, ImportedOrderList, ImportedOrderUpdate } from './imported-order.model';

@Injectable({ providedIn: 'root' })
export class ImportedOrdersService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'initial-import/orders'); }
  list(params: Record<string, string>) { return this.http.get<{ data: ImportedOrderList }>(this.baseUrl, { params }); }
  detail(id: number) { return this.http.get<{ data: ImportedOrderDetail }>(`${this.baseUrl}/${id}`); }
  events(id: number, type: string, page: number) { return this.http.get<{ data: ImportedEventPage }>(`${this.baseUrl}/${id}/events`, { params: { type, page } }); }
  attachment(order: number, attachment: number) { return this.http.get(`${this.baseUrl}/${order}/attachments/${attachment}`, { responseType: 'blob' }); }
  findNewOrders(runId: string) { return this.http.post<{ data: ImportedOrderUpdate }>(`${this.baseUrl}/updates`, { run_id: runId }); }
  orderUpdate(id: number) { return this.http.get<{ data: ImportedOrderUpdate }>(`${this.baseUrl}/updates/${id}`); }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { CollectionRecord, CollectionWorkspace, CollectionInventoryReview } from './collection.model';

@Injectable({ providedIn: 'root' })
export class CollectionService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'collections'); }
  list(page: number, q: string, status: string) {
    return this.http.get<{ data: CollectionRecord[]; current_page: number; last_page: number; total: number }>(this.baseUrl, { params: { page, ...(q ? { q } : {}), ...(status ? { status } : {}) } });
  }
  workspace(id: number) { return this.http.get<{ data: CollectionWorkspace }>(`${this.baseUrl}/${id}`); }
  options(kind: string, q = '') { return this.http.get<{ data: any[] }>(`${this.baseUrl}/options`, { params: { kind, q } }); }
  createCollection(data: object) { return this.http.post<{ data: CollectionRecord }>(this.baseUrl, data); }
  saveCollection(id: number, data: object) { return this.http.put(`${this.baseUrl}/${id}`, data); }
  process(id: number, data: object, processId?: number) {
    return processId ? this.http.put(`${this.baseUrl}/${id}/processes/${processId}`, data) : this.http.post(`${this.baseUrl}/${id}/processes`, data);
  }
  detach(id: number, process: number) { return this.http.delete(`${this.baseUrl}/${id}/processes/${process}`); }
  attachProcesses(id: number, data: object) { return this.http.post(`${this.baseUrl}/${id}/processes/bulk`, data); }
  sale(id: number, data: object) { return this.http.post(`${this.baseUrl}/${id}/sales`, data); }
  removeSale(id: number, sale: number) { return this.http.delete(`${this.baseUrl}/${id}/sales/${sale}`); }
  receipt(id: number, sale: number, data: object) { return this.http.post(`${this.baseUrl}/${id}/sales/${sale}/receipts`, data); }
  previewInventory(id: number, variant_ids: number[], percentage: number) { return this.http.post<{ data: CollectionInventoryReview }>(`${this.baseUrl}/${id}/inventory/preview`, { variant_ids, percentage }); }
  sendInventory(id: number, token: string, variant_ids?: number[]) { return this.http.post<{ data: { sent_variants: number; sent_units: number; message: string } }>(`${this.baseUrl}/${id}/inventory/send`, { token, ...(variant_ids ? { variant_ids } : {}) }); }
}

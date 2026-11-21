import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

export interface ReceptionDraft {
  request_id: string;
  received_on: string;
  notes: string;
  items: { variant_id: number; quantity: number; comment?: string }[];
}
export interface InventoryReception {
  id: number;
  number: number;
  status: 'draft' | 'posted' | 'reversed';
  revision: number;
  is_historical?: boolean;
  stock_applied?: boolean;
  received_on: string;
  notes: string | null;
  receiver?: { name: string };
  reversed_at: string | null;
  reversal_reason: string | null;
  reverser?: { name: string };
  items: { id: number; variant_id: number; product_id?: number; comment: string; product_name: string; sku: string | null; options: { name: string; value: string }[]; quantity: number }[];
}

@Injectable({ providedIn: 'root' })
export class InventoryReceptionService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'manufactures'); }
  list(manufactureId: number, page = 1) {
    return this.http.get<{ data: InventoryReception[]; current_page: number; last_page: number }>(`${this.baseUrl}/${manufactureId}/receptions`, { params: { page } });
  }
  save(manufactureId: number, draft: ReceptionDraft) {
    return this.http.post<{ data: InventoryReception }>(`${this.baseUrl}/${manufactureId}/receptions`, draft);
  }
  updateDraft(manufactureId: number, receptionId: number, draft: ReceptionDraft, revision: number) {
    return this.http.put<{ data: InventoryReception }>(`${this.baseUrl}/${manufactureId}/receptions/${receptionId}`, { ...draft, revision });
  }
  post(manufactureId: number, receptionId: number, revision: number) {
    return this.http.post<{ data: InventoryReception & { kardexes: any[] } }>(`${this.baseUrl}/${manufactureId}/receptions/${receptionId}/post`, { revision });
  }
  pdf(manufactureId: number, receptionId: number) {
    return this.http.get(`${this.baseUrl}/${manufactureId}/receptions/${receptionId}/print`, { responseType: 'blob' });
  }
  reverse(manufactureId: number, receptionId: number, reason: string) {
    return this.http.post(`${this.baseUrl}/${manufactureId}/receptions/${receptionId}/reverse`, { reason });
  }
}

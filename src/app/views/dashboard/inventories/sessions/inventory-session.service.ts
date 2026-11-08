import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InventorySession, InventorySessionPayload } from 'src/app/interfaces/inventory-session.interface';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { ListResponse, RecordResponse } from '../../branches/branch-api.model';
@Injectable({ providedIn: 'root' })
export class InventorySessionService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'inventories'); }
  list(inventoryId: number, page = 1) { return this.http.get<ListResponse<InventorySession>>(`${this.baseUrl}/${inventoryId}/sessions`, { params: { page } }); }
  show(inventoryId: number, sessionId: number) { return this.http.get<RecordResponse<InventorySession>>(`${this.baseUrl}/${inventoryId}/sessions/${sessionId}`); }
  create(inventoryId: number, payload: InventorySessionPayload) { return this.http.post<RecordResponse<InventorySession>>(`${this.baseUrl}/${inventoryId}/sessions`, payload); }
  saveChanges(inventoryId: number, sessionId: number, payload: InventorySessionPayload) { return this.http.put<RecordResponse<InventorySession>>(`${this.baseUrl}/${inventoryId}/sessions/${sessionId}`, payload); }
}

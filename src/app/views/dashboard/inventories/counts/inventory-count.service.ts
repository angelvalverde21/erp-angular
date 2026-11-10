import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { ListResponse, RecordResponse } from '../../branches/branch-api.model';
import { InventoryCount, InventoryCountPayload, InventoryRackResponse, InventoryRackSummary, InventoryVariantLocation } from 'src/app/interfaces/inventory-workspace.interface';
@Injectable({ providedIn: 'root' })
export class InventoryCountService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'inventories'); }
  list(inventoryId: number, sessionId: number, page = 1, variantId?: number, locationId?: number, grouped = false) {
    const params: { page: number; variant_id?: number; location_id?: number; grouped?: number } = { page };
    if (grouped) params.grouped = 1;
    if (variantId !== undefined) params.variant_id = variantId;
    if (locationId !== undefined) params.location_id = locationId;
    return this.http.get<ListResponse<InventoryCount> & { variant_counted_quantity?: number; other_locations?: InventoryVariantLocation[] }>(`${this.baseUrl}/${inventoryId}/sessions/${sessionId}/counts`, { params });
  }
  show(inventoryId: number, sessionId: number, id: number) { return this.http.get<RecordResponse<InventoryCount>>(`${this.baseUrl}/${inventoryId}/sessions/${sessionId}/counts/${id}`); }
  rack(inventoryId: number, sessionId: number, locationId: number, page = 1) {
    return this.http.get<InventoryRackResponse>(`${this.baseUrl}/${inventoryId}/sessions/${sessionId}/counts`, {
      params: { view: 'rack', location_id: locationId, page },
    });
  }
  rackSummary(inventoryId: number, sessionId: number) {
    return this.http.get<{ data: InventoryRackSummary[] }>(`${this.baseUrl}/${inventoryId}/sessions/${sessionId}/counts`, {
      params: { view: 'rack-summary' },
    });
  }
  create(inventoryId: number, sessionId: number, payload: InventoryCountPayload) { return this.http.post<RecordResponse<InventoryCount>>(`${this.baseUrl}/${inventoryId}/sessions/${sessionId}/counts`, payload); }
  saveChanges(inventoryId: number, sessionId: number, id: number, payload: InventoryCountPayload) { return this.http.put<RecordResponse<InventoryCount>>(`${this.baseUrl}/${inventoryId}/sessions/${sessionId}/counts/${id}`, payload); }
  deleteCapture(inventoryId: number, sessionId: number, id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${inventoryId}/sessions/${sessionId}/counts/${id}`);
  }
  
}

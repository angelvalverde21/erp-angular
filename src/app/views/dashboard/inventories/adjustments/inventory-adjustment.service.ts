import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { ListResponse, RecordResponse } from '../../branches/branch-api.model';
import { InventoryAdjustment, InventoryAdjustmentPayload, InventoryAdjustmentAction } from 'src/app/interfaces/inventory-workspace.interface';
@Injectable({ providedIn: 'root' })
export class InventoryAdjustmentService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'inventories'); }
  list(inventoryId: number, page = 1) { return this.http.get<ListResponse<InventoryAdjustment>>(`${this.baseUrl}/${inventoryId}/adjustments`, { params: { page } }); }
  show(inventoryId: number, id: number) { return this.http.get<RecordResponse<InventoryAdjustment>>(`${this.baseUrl}/${inventoryId}/adjustments/${id}`); }
  create(inventoryId: number, payload: InventoryAdjustmentPayload) { return this.http.post<RecordResponse<InventoryAdjustment>>(`${this.baseUrl}/${inventoryId}/adjustments`, payload); }
  saveChanges(inventoryId: number, id: number, payload: InventoryAdjustmentPayload) { return this.http.put<RecordResponse<InventoryAdjustment>>(`${this.baseUrl}/${inventoryId}/adjustments/${id}`, payload); }
  transition(inventoryId: number, id: number, action: InventoryAdjustmentAction) { return this.http.post<RecordResponse<InventoryAdjustment>>(`${this.baseUrl}/${inventoryId}/adjustments/${id}/${action}`, {}); }
}

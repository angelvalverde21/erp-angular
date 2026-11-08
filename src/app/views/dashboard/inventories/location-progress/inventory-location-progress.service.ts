import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { ListResponse, RecordResponse } from '../../branches/branch-api.model';
import { InventoryLocationProgress, LocationProgressPayload } from 'src/app/interfaces/inventory-workspace.interface';
@Injectable({ providedIn: 'root' })
export class InventoryLocationProgressService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'inventories'); }
  list(inventoryId: number, page = 1) { return this.http.get<ListResponse<InventoryLocationProgress>>(`${this.baseUrl}/${inventoryId}/location-progress`, { params: { page } }); }
  show(inventoryId: number, id: number) { return this.http.get<RecordResponse<InventoryLocationProgress>>(`${this.baseUrl}/${inventoryId}/location-progress/${id}`); }
  create(inventoryId: number, payload: LocationProgressPayload) { return this.http.post<RecordResponse<InventoryLocationProgress>>(`${this.baseUrl}/${inventoryId}/location-progress`, payload); }
  saveChanges(inventoryId: number, id: number, payload: LocationProgressPayload) { return this.http.put<RecordResponse<InventoryLocationProgress>>(`${this.baseUrl}/${inventoryId}/location-progress/${id}`, payload); }
  
}

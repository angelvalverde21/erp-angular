import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { RecordResponse } from '../branches/branch-api.model';
import { InventoryVariant, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
@Injectable({ providedIn: 'root' })
export class InventoryWorkspaceService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'inventories'); }
  options(inventoryId: number) { return this.http.get<RecordResponse<InventoryWorkspaceOptions>>(`${this.baseUrl}/${inventoryId}/work-options`); }
  variants(inventoryId: number, search: string) { return this.http.get<RecordResponse<InventoryVariant[]>>(`${this.baseUrl}/${inventoryId}/variants`, { params: { search } }); }
}

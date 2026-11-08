import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Warehouse, WarehousePayload } from 'src/app/interfaces/warehouse.interface';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { ListResponse, RecordResponse } from '../branches/branch-api.model';

@Injectable({ providedIn: 'root' })
export class WarehouseService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'warehouses'); }

  list(branchId: number, page = 1) { return this.http.get<ListResponse<Warehouse>>(this.baseUrl, { params: { branch_id: branchId, page } }); }
  show(id: number) { return this.http.get<RecordResponse<Warehouse>>(`${this.baseUrl}/${id}`); }
  saveChanges(id: number, payload: WarehousePayload) { return this.http.put<RecordResponse<Warehouse>>(`${this.baseUrl}/${id}`, payload); }
  create(payload: WarehousePayload) { return this.http.post<RecordResponse<Warehouse>>(this.baseUrl, payload); }
}

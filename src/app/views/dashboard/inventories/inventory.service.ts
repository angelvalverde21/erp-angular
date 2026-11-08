import { Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';

import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { Inventory, InventoryOptions, InventoryPayload } from 'src/app/interfaces/inventory.interface';
import { ListResponse, RecordResponse } from '../branches/branch-api.model';

@Injectable({
  providedIn: 'root',
})

export class InventoryService extends BaseCrudDashboardService {
  catalog(page = 1, search = '', status = '') { return this.http.get<ListResponse<Inventory>>(`${this.baseUrl}/catalog`, { params: { page, search, status } }); }
  details(id: number) { return this.http.get<RecordResponse<Inventory>>(`${this.baseUrl}/${id}/details`); }
  options() { return this.http.get<RecordResponse<InventoryOptions>>(`${this.baseUrl}/options`); }
  create(payload: InventoryPayload) { return this.http.post<RecordResponse<Inventory>>(this.baseUrl, payload); }
  saveChanges(id: number, payload: InventoryPayload) { return this.http.put<RecordResponse<Inventory>>(`${this.baseUrl}/${id}`, payload); }

  constructor(http: HttpClient) {

    super(http, 'inventories');
  }


  // base_path(path: string[] = []){
  //   return ['inventories','manufactures',...path];
  // }


  // estado reactivo
  summaryEvent = signal<any>(null);
  manufactureSingnalEvent = signal<any>(null);

  setSummary(data: any) {
    this.summaryEvent.set(data);
  }

  setManufacture(data: any) {
    console.log(data);
    
    this.manufactureSingnalEvent.set(data);
  }

}


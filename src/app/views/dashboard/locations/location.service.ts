import { Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';

import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { Location, LocationPayload } from 'src/app/interfaces/location.interface';
import { ListResponse, RecordResponse } from '../branches/branch-api.model';

@Injectable({
  providedIn: 'root',
})

export class LocationService extends BaseCrudDashboardService {

  show(id: number) { return this.http.get<RecordResponse<Location>>(`${this.baseUrl}/${id}`); }
  list(warehouseId: number, page = 1) { return this.http.get<ListResponse<Location>>(this.baseUrl, { params: { warehouse_id: warehouseId, page } }); }
  saveChanges(id: number, payload: LocationPayload) { return this.http.put<RecordResponse<Location>>(`${this.baseUrl}/${id}`, payload); }
  create(payload: LocationPayload) { return this.http.post<RecordResponse<Location>>(this.baseUrl, payload); }
  options(warehouseId: number) { return this.http.get<ListResponse<Location>>(this.baseUrl, { params: { warehouse_id: warehouseId, all: 1 } }); }

  constructor(http: HttpClient) {

    super(http, 'locations');
  }


}


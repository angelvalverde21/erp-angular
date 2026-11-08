import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch, BranchAddress, BranchPayload } from 'src/app/interfaces/branch.interface';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { ListResponse, RecordResponse } from './branch-api.model';
import { Store } from 'src/app/interfaces/store.interface';

@Injectable({ providedIn: 'root' })
export class BranchService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'branches'); }

  list(page = 1) { return this.http.get<ListResponse<Branch> & { store?: Pick<Store, 'id' | 'name' | 'slug'> }>(this.baseUrl, { params: { page } }); }
  show(id: number) { return this.http.get<RecordResponse<Branch>>(`${this.baseUrl}/${id}`); }
  saveChanges(id: number, payload: BranchPayload) { return this.http.put<RecordResponse<Branch>>(`${this.baseUrl}/${id}`, payload); }
  create(payload: BranchPayload) { return this.http.post<RecordResponse<Branch>>(this.baseUrl, payload); }
  addresses() { return this.http.get<ListResponse<BranchAddress>>(`${this.baseUrl}/addresses`); }
}

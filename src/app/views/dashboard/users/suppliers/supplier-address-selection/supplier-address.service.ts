import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseCrudDashboardService } from '../../../base-crud-dashboard.service';
export interface SupplierAddress { id: number; name: string; primary: string; secondary?: string; is_default: boolean; district?: { name: string }; }
@Injectable({ providedIn: 'root' })
export class SupplierAddressService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'suppliers'); }
  addresses(id: number) { return this.http.get<{ data: SupplierAddress[] }>(`${this.baseUrl}/${id}/addresses`); }
  makeDefault(supplierId: number, addressId: number) {
    return this.http.post<{ data: SupplierAddress[] }>(`${this.baseUrl}/${supplierId}/addresses/${addressId}/default`, {});
  }
}

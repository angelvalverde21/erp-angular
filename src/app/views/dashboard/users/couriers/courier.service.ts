import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';

import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CourierService extends BaseCrudDashboardService {

  override index(page = 1, status?: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      params: { page, with_addresses: '1', ...(status && { status }) }
    });
  }

  addresses(courierId: number, page = 1, search = ''): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/${courierId}/addresses`,
      { params: { page, search: search.trim() } },
    );
  }

  list(page = 1, search = '', status = '', deliveryType = ''): Observable<any> {
    return this.http.get(this.baseUrl, {
      params: { page, search: search.trim(), status, delivery_type: deliveryType }
    });
  }

  constructor(http: HttpClient) {

    super(http, 'couriers');
    
  }


  express(page: number = 1, status?: string): Observable<any[]> {

    const url = `${this.baseUrl}/express`;

    return this.http.get<any[]>(url, {
      params: {
        page: page > 0 ? page : 1,
        ...(status && { status })
      }
    });

  }

  agency(page: number = 1, status?: string): Observable<any[]> {

    const url = `${this.baseUrl}/agency`;

    return this.http.get<any[]>(url, {
      params: {
        page: page > 0 ? page : 1,
        ...(status && { status })
      }
    });

  }

}


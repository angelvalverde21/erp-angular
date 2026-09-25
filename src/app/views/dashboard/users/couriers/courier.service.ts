import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';

import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CourierService extends BaseCrudDashboardService {

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


import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class EmployeeService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'employees');
  }

  orders(employee_id: number, page: number = 1, status?: string): Observable<any[]> {
    console.log(`${this.baseUrl}/orders`);

    return this.http.get<any[]>(`${this.baseUrl}/${employee_id}/orders`, {
      params: {
        page: page > 0 ? page : 1,
        ...(status && { status })
      }
    });
  }

}


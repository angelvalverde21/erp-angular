import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';

import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ProductionService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'productions');
  }

  purchases(production_id: number, page: number = 1, status?: string): Observable<any[]> {

    const url = `${this.baseUrl}/productions/${production_id}purchases`;

    console.log(this.baseUrl);

    return this.http.get<any[]>(this.baseUrl, {
      params: {
        page: page > 0 ? page : 1,
        ...(status && { status })
      }
    });
  }

}


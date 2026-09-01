import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';
import { Observable } from 'rxjs';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { KardexSummary } from '../../../interfaces/kardexSummary.interface';

@Injectable({
  providedIn: 'root',
})

export class KardexService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'kardexes');
  }

    // Generic method to get a single item by ID
  getVariants(variant_id: number | string | null): Observable<any> {
    const url = `${this.baseUrl}/variants/${variant_id}`;
    console.log(url);
    return this.http.get(`${url}`);
  }

  summary(kardexes: any[]): KardexSummary {

    const reception = kardexes.reduce(
      (acc, k) => acc + k.quantity * (k?.direction === 'in' ? 1 : -1),
      0
    );

    const fallados = kardexes.reduce(
      (acc, k) => acc + (k.comment === 'Fallado' ? k.quantity : 0),
      0
    );

    const reparados = kardexes.reduce(
      (acc, k) => acc + (k.comment === 'Reparado' ? k.quantity : 0),
      0
    );

    return {
      reception,
      fallados,
      reparados,
      saldo: fallados - reparados
    };
  }

}


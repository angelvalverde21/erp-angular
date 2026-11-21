import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';
import { Observable } from 'rxjs';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { KardexSummary } from '../../../interfaces/kardexSummary.interface';
import { flattenKardexes } from './kardex-records';

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
    const totals = { reception: 0, fallados: 0, reparados: 0, saldo: 0 };
    for (const movement of flattenKardexes(kardexes)) {
      const quantity = Number(movement.quantity);
      if (!Number.isFinite(quantity)) continue;
      if (movement.direction === 'in') totals.reception += quantity;
      else if (movement.direction === 'out') totals.reception -= quantity;
      if (movement.comment === 'Fallado') totals.fallados += quantity;
      if (movement.comment === 'Reparado') totals.reparados += quantity;
    }
    totals.saldo = totals.fallados - totals.reparados;
    return totals;
  }

}


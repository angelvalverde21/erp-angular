import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../../base-crud-dashboard.service';

// import { BaseCrudService } from '../base-crud.service';


@Injectable({
  providedIn: 'root',
})


export class ProductionPurchaseService extends BaseCrudDashboardService {

  // this.baseUrl = `${API.private}/${this._base.store}/dashboard/${this.section}`

  constructor(http: HttpClient) {
    super(http, 'productions'); // base inicial limpia
  }

  setProductionId(production_id: number | string) {

    // redefinir completamente el baseUrl (no concatenar sobre el anterior)
    this.extraPath = `/${production_id}/purchases`;
  }


}


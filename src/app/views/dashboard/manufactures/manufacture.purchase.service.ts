import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})


export class ManufacturePurchaseService extends BaseCrudDashboardService {

  // this.baseUrl = `${API.private}/${this._base.store}/dashboard/${this.section}`

  constructor(http: HttpClient) {
    super(http, 'manufactures'); // base inicial limpia
  }

  setManufactureId(manufacture_id: number | string) {

    // redefinir completamente el baseUrl (no concatenar sobre el anterior)
    this.extraPath = `/${manufacture_id}/purchases`;
  }


}


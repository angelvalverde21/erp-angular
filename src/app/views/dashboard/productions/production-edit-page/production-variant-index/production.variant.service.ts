import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../../base-crud-dashboard.service';

// import { BaseCrudService } from '../base-crud.service';


@Injectable({
  providedIn: 'root',
})


export class ProductionVariantService extends BaseCrudDashboardService {


  section_id: number | string | null = null;

  constructor(http: HttpClient) {
    super(http, 'variants'); // base inicial limpia
  }

  setProductionId(production_id: number | string) {
    this.section_id = production_id;

    // redefinir completamente el baseUrl (no concatenar sobre el anterior)
    this.extraPath = `/${production_id}/variants`;
  }
}


import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

// import { BaseCrudService } from '../base-crud.service';


@Injectable({
  providedIn: 'root',
})


export class ManufactureVariantService extends BaseCrudDashboardService {


  section_id: number | string | null = null;

  constructor(http: HttpClient) {
    super(http, 'manufactures'); // base inicial limpia
  }

  setManufactureId(manufacture_id: number | string) {

    // redefinir completamente el baseUrl (no concatenar sobre el anterior)
    this.extraPath = `/${manufacture_id}/variants`;
  }

}

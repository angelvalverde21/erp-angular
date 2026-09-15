import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

// import { BaseCrudService } from '../base-crud.service';


@Injectable({
  providedIn: 'root',
})


export class AcquireVariantService extends BaseCrudDashboardService {


  section_id: number | string | null = null;

  constructor(http: HttpClient) {
    super(http, 'acquires'); // base inicial limpia
  }

  setAcquireId(acquire_id: number | string) {

    // redefinir completamente el baseUrl (no concatenar sobre el anterior)
    this.extraPath = `/${acquire_id}/variants`;
  }

}

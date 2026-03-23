import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';

// import { BaseCrudService } from '../base-crud.service';

@Injectable({
  providedIn: 'root',
})

export class DistrictService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'districts');
  }

}

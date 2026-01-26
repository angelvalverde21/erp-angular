import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';

import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})

export class CourierService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'couriers');
  }


}


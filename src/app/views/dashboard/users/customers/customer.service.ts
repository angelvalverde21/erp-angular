import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})

export class CustomerService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'users/customers');
  }

}




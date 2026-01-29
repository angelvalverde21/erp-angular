import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';


@Injectable({
  providedIn: 'root'
})

export class AddressService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'addresses');

  }


}


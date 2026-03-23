import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';


@Injectable({
  providedIn: 'root'
})

export class IdentityService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'identities');

  }

  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

}
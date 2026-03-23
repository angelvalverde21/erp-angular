import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends BaseCrudDashboardService {


  constructor(http: HttpClient) {

    super(http, 'units'); //units es la url que se le pasa a la base service

  }

  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

}

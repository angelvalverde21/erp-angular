import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';

import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})

export class ProductionService extends BaseCrudDashboardService{

  constructor(http: HttpClient) {

    super(http, 'productions');
  }


  // base_path(path: string[] = []){
  //   return ['inventories','manufactures',...path];
  // }

}


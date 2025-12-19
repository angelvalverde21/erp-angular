import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';
import { Observable } from 'rxjs';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})

export class ProductService extends BaseCrudDashboardService{

  constructor(http: HttpClient) {

    super(http, 'products');
  }

  setup(): Observable<any[]> {
      const url = `${this.baseUrl}`;
      console.log(url);
      return this.http.get<any[]>(`${url}/setup`);
  }

  base_path(path: string[] = []){
    return ['inventories','products',...path];
  }

}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CrudService } from '../crud.service';
import { Observable } from 'rxjs';
import { BaseCrudDashboardService } from '../dashboard/base-crud-dashboard.service';


@Injectable({
  providedIn: 'root',
})
export class StoreService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'stores');
    
  }

  current(): Observable<any> {

    const url = `${this.baseUrl}/current`;
    console.log("hola");
    console.log(url);
    return this.http.get(`${url}`);
  }

}

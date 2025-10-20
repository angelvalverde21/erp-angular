import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { BaseCrudService } from '../../base-crud.service';


@Injectable({
  providedIn: 'root',
})

export class ReportService extends BaseCrudService{

  constructor(http: HttpClient) {

    super(http, 'reports');

  }


  // Generic method to get all items
  daily(days: number = 10): Observable<any[]> {
    const url = `${this.baseUrl}/daily/${days}`;
    console.log(url);
    return this.http.get<any[]>(`${url}`);
  }

    // Generic method to get all items
  topProducts(count: number = 10): Observable<any[]> {
    const url = `${this.baseUrl}/top`;
    console.log(url);
    return this.http.get<any[]>(`${url}`);
  }

  base_path(path: string[] = []){
    return ['reports',...path];
  }

}


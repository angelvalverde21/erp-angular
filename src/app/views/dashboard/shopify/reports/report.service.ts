import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../base.service';

@Injectable({
  providedIn: 'root',
})

export class ReportService{

  baseUrl: string;

  constructor(protected http: HttpClient, _base: BaseService) {

    this.baseUrl = `${environment.apiShopify}/${_base.store}/reports`

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

  monthAll(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}/month-all`);
  }

}


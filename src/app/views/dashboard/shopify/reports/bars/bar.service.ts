import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudDashboardService } from '../../../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})

export class BarService  extends BaseCrudDashboardService{

  constructor(http: HttpClient) {

    super(http, 'shopify/reports/bars');

  }

  // Generic method to get all items
  daily(days: number = 7): Observable<any[]> {
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

  base_path(path: string[] = []) {
    return ['reports', ...path];
  }

  monthAll(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}/month-all`);
  }

}


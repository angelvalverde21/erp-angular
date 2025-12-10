import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ShopifyProductService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'shopify/products');
  }

  syncProducts() {
    return this.http.get(`${this.baseUrl}/sync`);
  }


  // Generic method to update an existing item
  updatePrices(data: any): Observable<any> {
    console.log(data);

    const url = `${this.baseUrl}/prices`;
    console.log(url);
    return this.http.put(`${url}`, data);
  }

  // Generic method to update an existing item
  updatePrice(data: any): Observable<any> {
    console.log(data);

    const url = `${this.baseUrl}/price`;
    console.log(url);
    return this.http.put(`${url}`, data);
  }

  // Generic method to get all items
  draft(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}/draft`);
  }
  // Generic method to get all items
  archived(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}/archived`);
  }
  // Generic method to get all items
  active(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}/active`);
  }

  syncPrice(data: any): Observable<any> {

    console.log(data);
    const url = `${this.baseUrl}/sync/price`;
    console.log(url);
    return this.http.put(`${url}`, data);

  }


}


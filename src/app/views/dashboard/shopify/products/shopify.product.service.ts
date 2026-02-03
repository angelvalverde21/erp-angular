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

  updateProductPrice(product_id: number, data: any): Observable<any> {

    console.log(data);

    const url = `${this.baseUrl}/${product_id}/prices`;
    console.log(url);
    return this.http.put(`${url}`, data);

  }

  updateProductSyncStatus(product_id: number, sync_status: boolean): Observable<any> {

    const url = `${this.baseUrl}/${product_id}/sync-status`;
    return this.http.put(`${url}`, { sync_status });

  } 

  //sincroniza los productos del erp con shopify pero solo por cada producto

  syncPrice(data: any): Observable<any> {

    console.log(data);
    const url = `${this.baseUrl}/sync/price`;
    console.log(url);
    return this.http.put(`${url}`, data);

  }

  syncPrices(type: string): Observable<any> {

    console.log(type);
    const url = `${this.baseUrl}/sync/prices`;
    console.log(url);
    return this.http.put(`${url}`, { type });

  }


}


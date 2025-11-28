import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';

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

}


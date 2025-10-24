import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ShopifyBaseCrudService } from '../shopify-base-crud.service';

@Injectable({
  providedIn: 'root',
})

export class ShopifyOrderService extends ShopifyBaseCrudService{

  constructor(http: HttpClient) {
    super(http, 'orders');
  }

}


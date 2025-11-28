import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root',
})

export class ShopifyOrderService extends BaseCrudDashboardService {

  constructor(http: HttpClient) {

    super(http, 'shopify/orders');
  }

  downloadVoucher(order_id: number){

    const url = `${this.baseUrl}/${order_id}/pdf/voucher`;
    // console.log(url);

    return this.http.get(url, {
      responseType: 'blob', // Importante para descargar el archivo como blob

    });
  }



}


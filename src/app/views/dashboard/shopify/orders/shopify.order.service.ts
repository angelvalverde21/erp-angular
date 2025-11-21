import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CrudService } from '../../../crud.service';
import { BaseService } from '../../../base.service';

import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ShopifyOrderService extends CrudService {

  constructor(http: HttpClient, private _base: BaseService) {
    const url = `${environment.apiShopify}/${_base.store}/orders`;
    super(http, url);
  }


  downloadVoucher(order_id: number){

    const url = `${environment.apiShopify}/${this._base.store}/orders/${order_id}/pdf/voucher`;
    // console.log(url);

    return this.http.get(url, {
      responseType: 'blob', // Importante para descargar el archivo como blob

    });
  }



}


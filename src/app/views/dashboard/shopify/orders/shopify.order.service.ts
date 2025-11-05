import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CrudService } from '../../../crud.service';
import { BaseService } from '../../../base.service';
import { environment } from 'src/app/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ShopifyOrderService extends CrudService {

  constructor(http: HttpClient, _base: BaseService) {
    const url = `${environment.apiShopify}/${_base.store}/orders`;
    super(http, url);
  }



}


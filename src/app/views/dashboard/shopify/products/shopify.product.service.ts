import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CrudService } from '../../../crud.service';
import { BaseService } from '../../../base.service';

import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ShopifyProductService extends CrudService {

  constructor(http: HttpClient, private _base: BaseService) {
    const url = `${environment.apiShopify}/${_base.store}/products`;
    super(http, url);
  }


}


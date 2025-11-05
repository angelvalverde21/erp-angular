import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../../crud.service';
import { BaseService } from '../../base.service';
import { environment } from '../../../environments/environment';


// import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class ShopifyCrudService extends CrudService{

  constructor(http: HttpClient, _base: BaseService) {

    super(http, `${environment.apiShopify}/${_base.store}`);

  }

}

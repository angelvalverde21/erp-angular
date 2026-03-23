import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';
import { BaseService } from '../../../base.service';
import { Observable } from 'rxjs';
import { API, environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AttributeService {

  // private _base = inject(BaseService);
  baseUrl: string;

  constructor(
    protected http: HttpClient,
    private _base: BaseService
  ) {

    this.baseUrl = `${API.private}/${this._base.store}/dashboard/products`
    // console.log(this.baseUrl);

  }

  // Generic method to create a new item
  store(product_id: number, data: any): Observable<any> {

    const url = `${this.baseUrl}/${product_id}/attributes`;
    // console.log("imprimiendo url de store");
    // console.log(url);
    return this.http.post(`${url}`, data);

  }

  // Generic method to delete an item by ID
  destroy(attribute_id: number, product_id: number = 0): Observable<any> {
    const url = `${this.baseUrl}/${product_id}/attributes/${attribute_id}`;
    console.log(url);
    return this.http.delete(`${url}`);
  }

}


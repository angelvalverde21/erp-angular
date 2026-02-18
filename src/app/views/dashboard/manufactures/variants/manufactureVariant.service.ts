import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../base.service';
import { API } from '../../../../environments/environment';
import { Observable } from 'rxjs';

// import { BaseCrudService } from '../base-crud.service';

@Injectable({
  providedIn: 'root',
})

export class ManufactureVariantService{

  // private _base = inject(BaseService);
  baseUrl: string;

  constructor(
    protected http: HttpClient,
    private _base: BaseService
  ) {

    this.baseUrl = `${API.private}/${this._base.store}/dashboard/manufactures`;
    // console.log(this.baseUrl);

  }

  // Generic method to create a new item
  store(manufacture_id: number, data: any): Observable<any> {

    const url = `${this.baseUrl}/${manufacture_id}/variants`;
    // console.log("imprimiendo url de store");
    // console.log(url);
    return this.http.post(`${url}`, data);

  }
  // Generic method to create a new item
  
  batch(manufacture_id: number, data: any): Observable<any> {

    const url = `${this.baseUrl}/${manufacture_id}/variants/batch`;
    // console.log("imprimiendo url de store");
    // console.log(url);
    return this.http.post(`${url}`, data);

  }

  update(manufacture_id: number, manufacture_variant_id: number, data: any): Observable<any> {

    const url = `${this.baseUrl}/${manufacture_id}/variants/${manufacture_variant_id}`;
    // console.log("imprimiendo url de store");
    // console.log(url);
    return this.http.put(`${url}`, data);

  }

  // Generic method to delete an item by ID
  destroy(variant_id: number, manufacture_id: number = 0): Observable<any> {
    const url = `${this.baseUrl}/${manufacture_id}/variants/${variant_id}`;
    console.log(url);
    return this.http.delete(`${url}`);
  }

  // base_path(path: string[] = []){
  //   return ['inventories','manufactures',...path];
  // }

}

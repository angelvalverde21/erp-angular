import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../base.service';


@Injectable({
  providedIn: 'root'
})

export class MercadoPagoService {


  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

  baseUrl: string = "";

  constructor(protected http: HttpClient, private _base: BaseService) {

    this.baseUrl = `${environment.apiShopify}/${this._base.store}/pasarelas/mercadopago`;


  }

  // Generic method to create a new item
  createLink(data: any): Observable<any> {
    const url = `${this.baseUrl}/create-link`;
    console.log(url);
    return this.http.post(`${url}`, data);
  }

  // Generic method to create a new item
  transactions(): Observable<any> {
    const url = `${this.baseUrl}/transactions`;
    console.log(url);
    return this.http.get(`${url}`);
  }

}


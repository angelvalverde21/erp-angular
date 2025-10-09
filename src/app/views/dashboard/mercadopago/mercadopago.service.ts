import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class MercadoPagoService {


  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

  baseUrl: string = "";

  constructor(protected http: HttpClient) {

    this.baseUrl = `${environment.apiShopify}/pasarelas/mercadopago`;

  }

  // Generic method to create a new item
  createLink(data: any): Observable<any> {
    const url = `${this.baseUrl}/create-link`;
    console.log(url);
    return this.http.post(`${url}`, data);
  }

}


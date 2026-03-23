import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root'
})

export class MercadoPagoService extends BaseCrudDashboardService {


  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

  constructor(http: HttpClient) {
    super(http, 'shopify/pasarelas/mercadopago');
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


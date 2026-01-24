import { Injectable } from '@angular/core';
import { API, environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AppShopifyService {

  constructor(protected http: HttpClient, private _base: BaseService) {
  }

  //construir la url cuando se usa, no en el constructor
  private get baseUrl(): string {
    return `${API.public}/${this._base.store}/app-shopify`;
  }

  // Generic method to create a new item
  tracking(data: any): Observable<any> {
    const url = `${this.baseUrl}/tracking`;
    return this.http.post(`${url}`, data);
  }
}

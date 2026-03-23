import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../base.service';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class ColorService {

  baseUrl: string;

  private _base = inject(BaseService);

  constructor(protected http: HttpClient) {

      this.baseUrl = `${environment.apiDashboard}/${this._base.store}`;
  }

  // Generic method to get all items
  index(product_id: number): Observable<any[]> {
    const url = `${this.baseUrl}/products/${product_id}/colors`;
    console.log(url);
    return this.http.get<any[]>(`${url}`);
  }

  // Generic method to get a single item by ID
  get(size_id: number): Observable<any> {
    const url = `${this.baseUrl}/${size_id}`;
    console.log(url);
    return this.http.get(`${url}`);
  }

  // Generic method to create a new item
  store(product_id: number, data: any): Observable<any> {
    const url = `${this.baseUrl}/products/${product_id}/colors`;
    console.log(url);
    return this.http.post(`${url}`, data);
  }

  // Generic method to update an existing item
  update(id: number, data: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    console.log(url);
    return this.http.put(`${url}`, data);
  }

  // Generic method to delete an item by ID
  destroy(product_id: number, size_id: number): Observable<any> {
    const url = `${this.baseUrl}/products/${product_id}/colors/${size_id}`;
    console.log(url);
    return this.http.delete(`${url}`);
  }

  search(search: string = ''): Observable<any[]> {
    const url = `${this.baseUrl}/search/${search}`;
    console.log(url);
    return this.http.get<any[]>(`${url}`);
  }
  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super


  // Generic method to update an existing item
  sort(product_id: number = 0, data: any): Observable<any> {
    const url = `${this.baseUrl}/products/${product_id}/colors/sort`;
    console.log(url);
    return this.http.put(`${url}`, data);
  }

}
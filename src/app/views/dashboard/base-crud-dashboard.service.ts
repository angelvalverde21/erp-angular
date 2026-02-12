import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { API, environment } from '../../environments/environment';


export abstract class BaseCrudDashboardService {

  private _base = inject(BaseService);
  baseUrl: string;

  constructor(protected http: HttpClient, public section: string) {

    this.baseUrl = `${API.private}/${this._base.store}/dashboard/${this.section}`
    console.log(this.baseUrl);

  }


  // Generic method to get all items
  // index(): Observable<any[]> {
  //   const url = `${this.baseUrl}`;
  //   console.log(url);
  //   return this.http.get<any[]>(`${url}`);
  // }

  index(page: number = 1, status?: string): Observable<any[]> {
    console.log(this.baseUrl);

    return this.http.get<any[]>(this.baseUrl, {
      params: {
        page: page > 0 ? page : 1,
        ...(status && { status })
      }
    });
  }

  indexShopify(cursor?: string) {
    return this.http.get<any[]>(this.baseUrl, {
      params: {
        ...(cursor && { cursor })
      }
    });
  }

  // Generic method to get all items
  blocked(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}`);
  }

  // Generic method to get all items
  draft(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}/draft`);
  }
  // Generic method to get all items
  archived(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}/archived`);
  }

  // Generic method to get all items
  active(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}/active`);
  }

  // Generic method to get a single item by ID
  get(id: number | string | null): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    console.log(url);
    return this.http.get(`${url}`);
  }

  // Generic method to create a new item
  store(data: any): Observable<any> {
    const url = `${this.baseUrl}`;
    console.log("imprimiendo url de store");
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
  destroy(id: number, data: any = null): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    console.log(url);
    return this.http.delete(`${url}`, { body: data });
  }

  search(search: string = ''): Observable<any[]> {

    // Si viene vacío, NO agregamos barra al final
    const clean = search.trim();

    const url = clean === ''
      ? `${this.baseUrl}/search`          // ← sin barra final
      : `${this.baseUrl}/search/${clean}` // ← con término

    console.log(url);

    return this.http.get<any[]>(url);
  }

  batch(data: any): Observable<any> {

    const url = `${this.baseUrl}/batch`;
    // console.log("imprimiendo url de store");
    // console.log(url);
    return this.http.post(`${url}`, data);

  }

}

import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { API, environment } from '../../environments/environment';


export abstract class BaseCrudDashboardService {

  private _base = inject(BaseService);
  baseUrl: string;

  constructor(protected http: HttpClient, public section: string) {

    this.baseUrl = `${API.private}/${this._base.store}/dashboard/${this.section}`

  }


  // Generic method to get all items
  index(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}`);
  }

    // Generic method to get all items
  blocked(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}`);
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
  destroy(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    console.log(url);
    return this.http.delete(`${url}`);
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

}

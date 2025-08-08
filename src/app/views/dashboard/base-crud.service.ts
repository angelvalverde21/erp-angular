import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../core/environments/environment';

// import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseCrudService {

  baseUrl: string;

  constructor(protected http: HttpClient, url_name: string) {
      this.baseUrl = `${environment.apiDashboard}/${environment.storeName}/${url_name}`;
  }
  // Generic method to get all items
  index(): Observable<any[]> {
    const url = `${this.baseUrl}`;
    console.log(url);
    return this.http.get<any[]>(`${url}`);
  }

  // Generic method to get a single item by ID
  get(id: number): Observable<any> {
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
    const url = `${this.baseUrl}/search/${search}`;
    console.log(url);
    return this.http.get<any[]>(`${url}`);
  }
}

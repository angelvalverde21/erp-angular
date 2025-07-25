import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  name: string | null = null;
  url: string = '';
  url_base: string = environment.apiDashboard;

  constructor(private http: HttpClient) {
    this.name = environment.storeName;
    this.url = `${this.url_base}/${this.name}/categories`;
    console.log(this.url);
  }

  index(): Observable<any> {
    const url = `${this.url}`;
    return this.http.get(url);
  }

  show(id: number | null): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.get(url);
  }

  store(data: []): Observable<any> {
    console.log(data);
    
    const url = `${this.url}`;
    return this.http.post(url, data);
  }

  update(data: [], id: number | null): Observable<any> {
    const url = `${this.url}/${id}/update`;
    return this.http.post(url, data);
  }

  
  showProductBySlug(slug: string | null): Observable<any> {
    const url = `${this.url}/slug/${slug}`;
    return this.http.get(url);
  }

}


import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ProductService {

  /************ El Servicio ***************************/

  baseUrl: string = '';

  constructor(private http: HttpClient) {

    this.baseUrl = `${environment.apiPrivate}/${environment.storeName}/products`;

  }

  // Obtiene la lista de todos los productos (equivalente a index() en Laravel)
  index(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // Obtiene los datos de un solo producto por su ID (equivalente a show($id) en Laravel)
  get(id: number | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Envía datos para crear un nuevo producto (equivalente a store() en Laravel)
  store(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Envía datos actualizados de un producto existente (equivalente a update($id) en Laravel)
    update(id: number | null, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // Elimina un producto por su ID (equivalente a destroy($id) en Laravel)
  destroy(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  search(search: string = ""): Observable<any[]> {
    console.log(`${this.baseUrl}/search/${search}`);
    
    return this.http.get<any[]>(`${this.baseUrl}/search/${search}`);
  }


}


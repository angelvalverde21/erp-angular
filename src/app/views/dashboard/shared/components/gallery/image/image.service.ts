import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../core/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ImageService {

  /************ El Servicio ***************************/

  baseUrl: string = '';

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiDashboard}/${environment.storeName}/images`;
  }

  // setProductAndColorId(productId: number, colorId: number): void {
    
  // }

  // Obtiene la lista de todos los Coloros (equivalente a index() en Laravel)
  index(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // Obtiene los datos de un solo Coloro por su ID (equivalente a show($id) en Laravel)
  get(id: number | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Envía datos para crear un nuevo Coloro (equivalente a store() en Laravel)
  store(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Envía datos actualizados de un Coloro existente (equivalente a update($id) en Laravel)
    update(id: number | null, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // Elimina un Color por su ID (equivalente a destroy($id) en Laravel)
  destroy(id: number): Observable<any> {
    console.log(`Deleting image with ID: ${id} from ${this.baseUrl}`);
    
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  search(search: string = ""): Observable<any[]> {
    console.log(`${this.baseUrl}/search/${search}`);
    
    return this.http.get<any[]>(`${this.baseUrl}/search/${search}`);
  }


}
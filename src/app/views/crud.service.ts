import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// import { environment } from '@env/environment';

export abstract class CrudService {

  // protected _store = inject(StoreService);

  constructor(protected http: HttpClient, public baseUrl: string) {
  }

  // Generic method to get all items
  index(): Observable<any[]> {
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
    const url = `${this.baseUrl}/search/${search}`;
    console.log(url);
    return this.http.get<any[]>(`${url}`);
  }
  
}

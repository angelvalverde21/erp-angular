import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseCrudService } from '../base-crud.service';


@Injectable({
  providedIn: 'root'
})

export class CategoryService extends BaseCrudService {

  constructor(http: HttpClient) {

    super(http, 'categories');

  }

  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

  showProductBySlug(slug: string | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/slug/${slug}`);
  }

}


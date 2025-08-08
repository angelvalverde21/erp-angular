import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseCrudService } from '../base-crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarouselService extends BaseCrudService {


  constructor(http: HttpClient) {

    super(http, 'carousels');

  }

  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

  showProductBySlug(slug: string | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/slug/${slug}`);
  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseCrudService } from '../base-crud.service';
import { Brand } from 'src/app/interfaces/brand.interface';


@Injectable({
  providedIn: 'root'
})

export class BrandService extends BaseCrudService {

  constructor(http: HttpClient) {

    super(http, 'brands');

  }

  //la variable this.baseUrl esta dentro de BaseCrudService que se llama con super

  showProductBySlug(slug: string | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/slug/${slug}`);
  }

  setAllLocal(brands:Brand[]){
    localStorage.setItem('brands', JSON.stringify(brands));
  }

  addLocal(Brand: Brand){
    const brands = localStorage.getItem('brands');

    return this.setAllLocal([...JSON.parse(brands!), Brand]);
  }

  getAllLocal(){
    return JSON.parse(localStorage.getItem('brands')!);
  }

}


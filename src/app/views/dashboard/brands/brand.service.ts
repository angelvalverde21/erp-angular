import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { Brand } from '../../../interfaces/brand.interface';
import { BaseService } from '../../base.service'
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

@Injectable({
  providedIn: 'root'
})

export class BrandService extends BaseCrudDashboardService {

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


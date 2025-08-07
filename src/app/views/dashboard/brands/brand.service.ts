import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/environments/environment';
import { BaseCrudService } from '../base-crud.service';


@Injectable({
  providedIn: 'root'
})

export class BrandService extends BaseCrudService {

  protected baseUrl = `${environment.apiDashboard}/${environment.storeName}/brands`; 

  constructor(http: HttpClient) {

    super(http);

  }

  showProductBySlug(slug: string | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/slug/${slug}`);
  }

}


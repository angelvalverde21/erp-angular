import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import { BaseCrudService } from '../base-crud.service';
import { Observable } from 'rxjs';
import { ProductListResponse, ProductSort, ProductSortDirection } from 'src/app/interfaces/product-list.interface';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { PriceLabel, ProductPrice } from '../../../interfaces/product-price.interface';
import { Product } from '../../../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})

export class ProductService extends BaseCrudDashboardService{

  constructor(http: HttpClient) {

    super(http, 'products');
  }

  setup(): Observable<any[]> {
      const url = `${this.baseUrl}`;
      console.log(url);
      return this.http.get<any[]>(`${url}/setup`);
  }

  getCatalog(
    page: number = 1,
    sortBy: ProductSort = 'created_at',
    direction: ProductSortDirection = 'desc',
  ): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(this.baseUrl, {
      params: {
        page,
        sort_by: sortBy,
        sort_direction: direction,
      },
    });
  }

  base_path(path: string[] = []){
    return ['inventories','products',...path];
  }

  getPrices(productId: number): Observable<{ data: ProductPrice[] }> {
    return this.http.get<{ data: ProductPrice[] }>(`${this.baseUrl}/${productId}/prices`);
  }

  getPriceLabels(search = ''): Observable<{ data: PriceLabel[] }> {
    return this.http.get<{ data: PriceLabel[] }>(`${this.baseUrl}/price-labels`, { params: { search } });
  }

  duplicate(productId: number, name: string): Observable<{ data: Product }> {
    return this.http.post<{ data: Product }>(`${this.baseUrl}/${productId}/duplicate`, { name });
  }

  savePrice(productId: number, data: Omit<ProductPrice, 'id'>, priceId?: number): Observable<{ data: ProductPrice }> {
    const url = `${this.baseUrl}/${productId}/prices`;
    return priceId
      ? this.http.put<{ data: ProductPrice }>(`${url}/${priceId}`, data)
      : this.http.post<{ data: ProductPrice }>(url, data);
  }

  deletePrice(productId: number, priceId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}/prices/${priceId}`);
  }

}


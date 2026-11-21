import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

export interface CatalogPreviewItem {
  id: number; name: string; status: 'ready' | 'linked' | 'invalid'; issues: string[]; token: string | null;
  variants: { id: number; sku: string; optionValues: { optionName: string; name: string }[] }[];
}
export interface CatalogPreview {
  connection: { ready: boolean; domain: string | null; issues: string[] };
  target_status: string; mode: string; items: CatalogPreviewItem[];
}
export interface CatalogPublishResult { product_id: number; status: 'synced' | 'failed'; message: string; remote_product_id?: string; remote_status?: string; }

@Injectable({ providedIn: 'root' })
export class ShopifyCatalogService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'products'); }
  preview(productIds: number[]) { return this.http.post<{ data: CatalogPreview }>(`${this.baseUrl}/shopify/preview`, { product_ids: productIds, target_status: 'DRAFT', mode: 'catalog' }); }
  publish(productId: number, token: string) { return this.http.post<{ data: CatalogPublishResult }>(`${this.baseUrl}/${productId}/shopify-publish`, { token }); }
}

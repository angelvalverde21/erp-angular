import { Product } from './product.interface';

export type ProductSort = 'id' | 'name' | 'category' | 'created_at' | 'stock_total' | 'price';
export type ProductSortDirection = 'asc' | 'desc';

export interface ProductListResponse {
  data: Product[];
  meta?: { last_page?: number; total?: number };
  links?: { next?: string | null };
  last_page?: number;
  next_page_url?: string | null;
  total?: number;
}

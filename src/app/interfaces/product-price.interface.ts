export interface PriceLabel {
  id: number;
  name: string;
  code: string;
}

export interface ProductPrice {
  id: number;
  name: string;
  quantity: number | string;
  price: number | string;
  total: number | string;
  price_label_id?: number | null;
  label?: PriceLabel | null;
}

export interface Option {
  id: number;
  name: string;
  label?: string | null;
  product_id?: number | null;
  sort_order?: number;
  created_at?: string | null;
  updated_at?: string | null;
  option_values?: OptionValue[];
}

export interface OptionValue {
  id: number;
  option_id: number;
  value: string;
  sort_order?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

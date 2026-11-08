export interface Location {
  id: number;
  warehouse_id: number;
  parent_id: number | null;
  name: string;
  code: string | null;
  is_active: boolean;
  parent?: Location | null;
  children?: Location[];
}

export interface LocationPayload {
  warehouse_id: number;
  parent_id: number | null;
  name: string;
  code: string | null;
  is_active: boolean;
}

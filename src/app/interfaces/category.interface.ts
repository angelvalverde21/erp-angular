export interface Category {
  id: number;               // id de la categoría
  name: string;             // nombre de la categoría
  slug: string;             // slug para URLs

  parent_id?: number | null; // categoría padre (nullable)
  sort_order: number;       // orden de aparición

  status: boolean;          // true: activo, false: archivado
  is_color: boolean;        // habilita variantes por color
  is_size: boolean;         // habilita variantes por talla

  user_id: number;          // usuario creador
  store_id: number;         // tienda asociada

  created_at?: string;      // timestamps opcionales (si usas Laravel timestamps)
  updated_at?: string;
  children? : Category[];
}
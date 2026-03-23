export interface WidgetManufacture {

  cost: number;
  purchase_total: number;
  quantity_total: number; // si es un documento tipo DNI/RUC
  quantity_received: number;
  progress: number;       // si puede tener ceros iniciales o símbolos

  
}
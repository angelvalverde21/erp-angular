export interface SummaryPurchase {

    created_at?: string;     // Fecha de creación del pedido
    cost?: number;             // Costo por unidad
    sum_variants?: number;   // Cantidad total de productos
    count_variants?: number;   // Cantidad total de productos
    count_payments?: number;   // Cantidad total de productos
    sum_purchases?: number;   // Costo total de las compras
    sum_kardexes?: number;        // Costo total de las recepciones
    pending_reception_units?: number;
    sum_payments?: number;        // Costo total de las recepciones
    tracked_purchases_count?: number;
    estimated_order_cost?: number;
    estimated_order_cost_valid?: boolean;
    zero_cost_variants?: number;
    has_pending_cost?: boolean;

}

import { InventoryStatus } from 'src/app/interfaces/inventory.interface';
export const INVENTORY_STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador', in_progress: 'En progreso', completed: 'Finalizado', cancelled: 'Cancelado', open: 'Abierta', closed: 'Cerrada',
  pending: 'Pendiente', counted: 'Contada', verified: 'Verificada', valid: 'Vigente', replaced: 'Reemplazado', approved: 'Aprobado', applied: 'Aplicado', rejected: 'Rechazado',
};
export function inventoryTransitions(status: InventoryStatus): InventoryStatus[] {
  switch (status) {
    case 'draft': return ['draft', 'in_progress', 'cancelled'];
    case 'in_progress': return ['in_progress', 'completed', 'cancelled'];
    default: return [status];
  }
}

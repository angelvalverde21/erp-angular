export type DeliveryStatus = 'pending' | 'overdue' | 'received';

export interface DeliveryTracking {
  id: number;
  handed_over_on: string | null;
  expected_on: string;
  received_on: string | null;
  revision: number;
  status: DeliveryStatus;
  received_late: boolean;
  reschedules_count: number;
  schedule_history?: DeliveryEvent[];
}

export interface DeliveryEvent {
  id: number;
  type: 'created' | 'rescheduled' | 'received' | 'corrected';
  actor_name: string;
  created_at: string;
  reason: string | null;
  changes: Record<string, { before: string | null; after: string | null }>;
}

export interface DeliveryDates {
  handed_over_on?: string | null;
  expected_on?: string;
  received_on?: string | null;
  reason?: string;
  revision?: number;
}

export const DELIVERY_LABELS: Record<DeliveryStatus, string> = {
  pending: 'Entrega pendiente', overdue: 'Entrega vencida', received: 'Recibida',
};

export function todayInLima(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

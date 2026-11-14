import { DeliveryEvent, DeliveryStatus } from '@shared/components/delivery-tracking/delivery-tracking.model';

export interface DeliveryOverviewItem {
  id: number;
  purchase_id: number;
  title: string;
  production: string | null;
  stage: string | null;
  stage_id: number | null;
  stage_slug?: string | null;
  expected_on: string;
  status: DeliveryStatus;
  path: string | null;
  reschedules_count: number;
  last_change?: DeliveryEvent;
}

export interface DeliveryOverview {
  pending: number;
  overdue: number;
  today: number;
  items: DeliveryOverviewItem[];
  recent_changes: DeliveryOverviewItem[];
}

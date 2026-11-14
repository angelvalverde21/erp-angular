import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../../dashboard/base-crud-dashboard.service';
import { DeliveryDates, DeliveryEvent, DeliveryTracking } from './delivery-tracking.model';

@Injectable({ providedIn: 'root' })
export class DeliveryTrackingService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'delivery-trackings'); }

  createForOwner(ownerType: string, ownerId: number, dates: DeliveryDates) {
    return this.http.post<{ data: DeliveryTracking }>(this.baseUrl, {
      trackable_type: ownerType, trackable_id: ownerId, ...dates,
    });
  }

  updateTracking(id: number, dates: DeliveryDates) {
    return this.http.put<{ data: DeliveryTracking }>(`${this.baseUrl}/${id}`, dates);
  }

  getTracking(id: number) {
    return this.http.get<{ data: DeliveryTracking }>(`${this.baseUrl}/${id}`);
  }

  history(id: number, page = 1) {
    return this.http.get<{ data: DeliveryEvent[]; next_page_url: string | null }>(`${this.baseUrl}/${id}/events`, { params: { page } });
  }
}

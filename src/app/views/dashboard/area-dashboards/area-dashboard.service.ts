import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';
import { AreaReport, DashboardArea } from './dashboard.model';
@Injectable({ providedIn: 'root' })
export class AreaDashboardService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'panels'); }
  report(area: DashboardArea, days: number) {
    return this.http.get<{ data: AreaReport }>(`${this.baseUrl}/${area}`, { params: { days } });
  }
}
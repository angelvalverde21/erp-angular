import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../../base-crud-dashboard.service';
import { PhotoExpense, PhotoExpenseContext, PhotoExpenseTarget } from './photo-expense.model';

@Injectable({ providedIn: 'root' })
export class PhotoExpenseService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'photo-sessions'); }
  context(session: number, target: PhotoExpenseTarget) { return this.http.get<{ data: PhotoExpenseContext }>(`${this.baseUrl}/${session}/item-purchases`, { params: { source_kind: target.kind, source_id: target.id } }); }
}

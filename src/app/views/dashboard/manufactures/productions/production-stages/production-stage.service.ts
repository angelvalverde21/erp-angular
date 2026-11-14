import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, tap } from 'rxjs';
import { BaseCrudDashboardService } from '../../../base-crud-dashboard.service';

export interface ProductionStage {
  id: number;
  manufacture_id: number;
  code: string;
  name: string;
  slug?: string;
  show_in_stepper?: boolean;
  delivery_tracking_default?: boolean;
  progress_id?: number | null;
  purchases_count?: number;
  status: string | null;
  responsible: string | null;
  expected_end: string | null;
  completed_at: string | null;
  notes: string | null;
  revision: number;
  sample_quantity: number | null;
  sample_details: string | null;
  sample_photos: string[] | null;
  sample_review: string;
  review_notes: string | null;
  reviewer?: { name: string };
  reviewed_at: string | null;
  events?: { id: number; created_at: string; user?: { name: string }; changes: Record<string, { before: any; after: any }> }[];
}

export const STAGE_STATUS: Record<string, string> = {
  pending: 'Pendiente', in_progress: 'En proceso', completed: 'Finalizada', not_applicable: 'No aplica',
};

export function isProcessStage<T extends { code?: string; show_in_stepper?: boolean; status: string | null }>(stage: T): stage is T & { status: string } {
  return stage.show_in_stepper !== false && stage.code !== 'others' && stage.status !== null;
}

@Injectable({ providedIn: 'root' })
export class ProductionStageService extends BaseCrudDashboardService {
  readonly changes = new Subject<number>();

  constructor(http: HttpClient) { super(http, 'manufactures/productions'); }

  list(productionId: number) {
    return this.http.get<{ data: ProductionStage[] }>(`${this.baseUrl}/${productionId}/stages`);
  }

  save(productionId: number, stageId: number | string, data: object) {
    return this.http.put<{ data: ProductionStage }>(`${this.baseUrl}/${productionId}/stages/${stageId}`, data)
      .pipe(tap(() => this.changes.next(productionId)));
  }

  assign(productionId: number, stageId: number, purchaseId: number) {
    return this.http.put<{ data: any }>(`${this.baseUrl}/${productionId}/stages/${stageId}/purchases/${purchaseId}`, {})
      .pipe(tap(() => this.changes.next(productionId)));
  }

  classify(productionId: number) {
    return this.http.post<{ data: { assigned: number; remaining: number; purchases: any[] } }>(
      `${this.baseUrl}/${productionId}/stages/classify-purchases`, {},
    ).pipe(tap(() => this.changes.next(productionId)));
  }
}

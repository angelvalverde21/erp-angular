import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

export interface InitialImportRun {
  id: string; status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  current_task: string | null; error_message: string | null; counts: Record<string, number>;
  completed_tasks: number; total_tasks: number; can_resume: boolean;
  timeline_version?: number;
  timeline_unavailable_orders?: number;
  attachments?: { total: number; downloaded: number; failed: number };
  created_at: string; updated_at: string; completed_at: string | null;
  current: { kind: string; status: string; processed_rows: number; expected_rows: number | null } | null;
}
export interface InitialImportState { checks: { label: string; ready: boolean }[]; runs: InitialImportRun[]; }

@Injectable({ providedIn: 'root' })
export class InitialShopifyImportService extends BaseCrudDashboardService {
  constructor(http: HttpClient) { super(http, 'initial-import/shopify'); }
  state() { return this.http.get<{ data: InitialImportState }>(this.baseUrl); }
  startImport() { return this.http.post<{ data: InitialImportRun }>(this.baseUrl, {}); }
  resumeImport(id: string) { return this.http.post<{ data: InitialImportRun }>(`${this.baseUrl}/${id}/resume`, {}); }
}

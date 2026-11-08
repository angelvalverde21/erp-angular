import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { BaseCrudDashboardService } from '../base-crud-dashboard.service';

interface ImportRun {
  id: string;
  status: string;
  imported_orders: number;
  skipped_orders: number;
  unmatched_variants: number;
  unresolved_addresses: number;
  error_code: string | null;
  created_at: string;
  completed_at: string | null;
}

interface ImportPreparation {
  store: { id: number; name: string; slug: string };
  enabled: boolean;
  schema_ready: boolean;
  checks: { label: string; ready: boolean }[];
  history_permission: string;
  command: string;
  runs: ImportRun[];
}

@Injectable({ providedIn: 'root' })
export class ShopifyOrderMigrationService extends BaseCrudDashboardService {
  constructor(http: HttpClient) {
    super(http, 'migrations/shopify/orders');
  }

  preparation() {
    return this.http.get<{ data: ImportPreparation }>(this.baseUrl);
  }
}

@Component({
  selector: 'app-shopify-order-migration',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './shopify-order-migration.component.html',
  styleUrl: './shopify-order-migration.component.scss',
})
export class ShopifyOrderMigrationComponent implements OnInit, OnDestroy {
  preparation: ImportPreparation | null = null;
  loading = false;
  error = '';
  readonly statuses: Record<string, string> = {
    exporting: 'Exportando',
    staging: 'Preparando archivo',
    importing: 'Importando',
    completed: 'Completada',
    failed: 'Detenida',
    cancelled: 'Cancelada',
  };
  private readonly destroy$ = new Subject<void>();

  constructor(private service: ShopifyOrderMigrationService) {}

  get latestStatus(): string {
    const latest = this.preparation?.runs[0];
    return latest ? this.statuses[latest.status] || latest.status : 'Sin ejecutar';
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    if (this.loading) return;
    this.loading = true;
    this.error = '';
    this.service.preparation().pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false),
    ).subscribe({
      next: response => this.preparation = response.data,
      error: error => {
        this.preparation = null;
        this.error = error.status === 403
          ? 'No tienes permiso para gestionar migraciones de esta tienda.'
          : 'No se pudo revisar la preparación. Inténtalo nuevamente.';
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
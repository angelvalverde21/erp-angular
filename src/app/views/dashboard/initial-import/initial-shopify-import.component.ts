import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { filter, finalize, interval, Subject, takeUntil } from 'rxjs';
import { InitialImportRun, InitialImportState, InitialShopifyImportService } from './initial-shopify-import.service';

@Component({ selector: 'app-initial-shopify-import', imports: [DatePipe, DecimalPipe], templateUrl: './initial-shopify-import.component.html', styleUrl: './initial-shopify-import.component.scss' })
export class InitialShopifyImportComponent implements OnInit, OnDestroy {
  state: InitialImportState | null = null;
  loading = false;
  saving = false;
  error = '';
  readonly labels: Record<string, string> = {
    orders: 'Pedidos', products: 'Productos', variants: 'Variantes', customers: 'Clientes', order_items: 'Artículos de pedidos',
    shipping_lines: 'Gastos de envío', discounts: 'Descuentos', transactions: 'Transacciones', fulfillments: 'Envíos', fulfillment_items: 'Artículos enviados',
    fulfillment_events: 'Eventos de entrega', refunds: 'Reembolsos', refund_items: 'Artículos reembolsados', refund_shipping_lines: 'Envíos reembolsados', refund_adjustments: 'Ajustes de reembolso',
    images: 'Imágenes de productos', addresses: 'Direcciones', metafields: 'Metadatos', events: 'Eventos y comentarios', records: 'Otros registros',
    order_metafields: 'Metadatos de pedidos', product_metafields: 'Metadatos de productos', variant_metafields: 'Metadatos de variantes', customer_metafields: 'Metadatos de clientes',
    event_attachments: 'Adjuntos del timeline',
  };
  readonly entities = ['orders', 'order_items', 'products', 'variants', 'customers', 'transactions', 'fulfillments', 'refunds', 'shipping_lines', 'discounts', 'addresses', 'images', 'metafields', 'events', 'event_attachments', 'fulfillment_items', 'fulfillment_events', 'refund_items', 'refund_shipping_lines', 'refund_adjustments', 'records'];
  readonly statuses: Record<string, string> = { queued: 'En cola', running: 'Importando', completed: 'Completada', failed: 'Requiere atención', cancelled: 'Cancelada' };
  private readonly destroy$ = new Subject<void>();
  constructor(private service: InitialShopifyImportService) {}
  get latest(): InitialImportRun | null { return this.state?.runs[0] ?? null; }
  get active(): boolean { return !!this.latest && ['queued', 'running'].includes(this.latest.status); }
  get canStart(): boolean { return !!this.state?.checks.length && this.state.checks.every(check => check.ready) && (!this.latest || ['completed', 'cancelled'].includes(this.latest.status)); }
  ngOnInit(): void {
    this.refresh();
    interval(3000).pipe(filter(() => this.active && !this.saving), takeUntil(this.destroy$)).subscribe(() => this.refresh());
  }
  refresh(): void {
    if (this.loading) return;
    this.loading = true;
    this.service.state().pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => { this.state = response.data; this.error = ''; },
      error: () => this.error = 'No se pudo actualizar el progreso. La carga continúa en segundo plano.',
    });
  }
  start(): void {
    if (this.saving || !this.canStart) return;
    this.runAction(this.service.startImport());
  }
  resume(): void {
    if (this.saving || !this.latest?.can_resume) return;
    this.runAction(this.service.resumeImport(this.latest.id));
  }
  private runAction(operation: ReturnType<InitialShopifyImportService['startImport']>): void {
    this.saving = true; this.error = '';
    operation.pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: response => { if (this.state) this.state = { ...this.state, runs: [response.data, ...this.state.runs.filter(run => run.id !== response.data.id)].slice(0, 5) }; this.refresh(); },
      error: error => this.error = error.error?.message || 'No se pudo iniciar la carga. Inténtalo nuevamente.',
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

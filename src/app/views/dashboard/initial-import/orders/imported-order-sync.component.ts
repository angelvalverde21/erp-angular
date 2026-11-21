import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { catchError, EMPTY, exhaustMap, finalize, Subject, Subscription, takeUntil, timer } from 'rxjs';
import { ImportedOrderUpdate, ImportedRun, importedOrderView } from './imported-order.model';
import { ImportedOrdersService } from './imported-orders.service';

@Component({
  selector: 'app-imported-order-sync', imports: [DecimalPipe],
  templateUrl: './imported-order-sync.component.html', styleUrls: ['./imported-orders.scss', './imported-order-sync.component.scss'],
})
export class ImportedOrderSyncComponent implements OnChanges, OnDestroy {
  @Input() run: ImportedRun | null = null;
  @Input() initialUpdate: ImportedOrderUpdate | null = null;
  @Output() finished = new EventEmitter<void>();
  update: ImportedOrderUpdate | null = null;
  saving = false;
  error = '';
  pollError = false;
  readonly view = importedOrderView;
  private runId: string | null = null;
  private polling?: Subscription;
  private readonly runChanged$ = new Subject<void>();
  private readonly notified = new Set<string>();
  get active(): boolean { return !!this.update && ['queued', 'scanning', 'importing'].includes(this.update.status); }
  get canStart(): boolean { return !!this.run && !this.saving && !this.active && (this.run.status === 'completed' || (this.run.status === 'failed' && !!this.update?.can_resume)); }

  constructor(private service: ImportedOrdersService) {}
  ngOnChanges(): void {
    if (this.run?.id !== this.runId) {
      this.runChanged$.next(); this.polling?.unsubscribe();
      this.runId = this.run?.id ?? null; this.update = null; this.error = ''; this.pollError = false;
    }
    if (this.initialUpdate && this.initialUpdate.run_id === this.runId && (!this.update || this.initialUpdate.id > this.update.id)) this.adopt(this.initialUpdate);
  }
  start(): void {
    if (!this.canStart || !this.run) return;
    this.saving = true; this.error = '';
    this.service.findNewOrders(this.run.id).pipe(takeUntil(this.runChanged$), finalize(() => this.saving = false)).subscribe({
      next: response => this.adopt(response.data),
      error: error => this.error = error.error?.message || 'No se pudo iniciar la búsqueda. Inténtalo nuevamente.',
    });
  }
  private adopt(update: ImportedOrderUpdate): void {
    this.polling?.unsubscribe(); this.update = update; this.pollError = false;
    if (!this.active) return;
    this.polling = timer(0, 3000).pipe(exhaustMap(() => this.service.orderUpdate(update.id).pipe(catchError(() => { this.pollError = true; return EMPTY; }))), takeUntil(this.runChanged$)).subscribe(response => {
      this.update = response.data; this.pollError = false;
      if (!this.active) {
        this.polling?.unsubscribe();
        const key = `${update.id}:${response.data.status}`;
        if (!this.notified.has(key)) { this.notified.add(key); this.finished.emit(); }
      }
    });
  }
  ngOnDestroy(): void { this.runChanged$.next(); this.runChanged$.complete(); this.polling?.unsubscribe(); }
}

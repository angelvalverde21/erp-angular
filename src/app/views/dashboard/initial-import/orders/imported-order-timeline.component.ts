import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ImportedEvent, importedOrderView } from './imported-order.model';
import { ImportedOrdersService } from './imported-orders.service';
import { ImportedOrderAttachmentComponent } from './imported-order-attachment.component';

@Component({ selector: 'app-imported-order-timeline', imports: [JsonPipe, ImportedOrderAttachmentComponent], templateUrl: './imported-order-timeline.component.html', styleUrl: './imported-orders.scss' })
export class ImportedOrderTimelineComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) orderId!: number;
  @Input({ required: true }) counts!: { all: number; comments: number; system: number };
  items: ImportedEvent[] = [];
  type = 'all';
  loading = false;
  error = '';
  page = 0;
  lastPage = 1;
  readonly view = importedOrderView;
  readonly filters = [{ key: 'all', label: 'Todos' }, { key: 'comments', label: 'Comentarios' }, { key: 'system', label: 'Sistema' }] as const;
  private readonly cancel$ = new Subject<void>();
  constructor(private service: ImportedOrdersService) {}
  ngOnChanges(): void { this.select('all'); }
  select(type: string): void { this.cancel$.next(); this.type = type; this.items = []; this.page = 0; this.lastPage = 1; this.load(); }
  load(): void {
    if (this.loading || this.page >= this.lastPage) return;
    this.loading = true; this.error = '';
    this.service.events(this.orderId, this.type, this.page + 1).pipe(takeUntil(this.cancel$), finalize(() => this.loading = false)).subscribe({
      next: response => { this.items = [...this.items, ...response.data.items]; this.page = response.data.pagination.page; this.lastPage = response.data.pagination.last_page; },
      error: () => this.error = 'No se pudo cargar el historial. Puedes volver a intentarlo.',
    });
  }
  ngOnDestroy(): void { this.cancel$.next(); this.cancel$.complete(); }
}

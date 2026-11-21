import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, combineLatest, EMPTY, finalize, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { ImportedOrderList, importedOrderView } from './imported-order.model';
import { ImportedOrdersService } from './imported-orders.service';
import { ImportedOrderSyncComponent } from './imported-order-sync.component';
import { DateShopifyPipe } from '../../../shared/pipes/date-shopify.pipe';
import { ImportedOrderItemImageComponent } from './imported-order-item-image.component';

@Component({ selector: 'app-imported-orders', imports: [FormsModule, RouterLink, DecimalPipe, ImportedOrderSyncComponent, DateShopifyPipe, ImportedOrderItemImageComponent], templateUrl: './imported-orders.component.html', styleUrl: './imported-orders.scss' })
export class ImportedOrdersComponent implements OnInit, OnDestroy {
  data: ImportedOrderList | null = null;
  loading = false;
  error = '';
  search = '';
  query: Record<string, string> = {};
  readonly view = importedOrderView;
  readonly packingFilters = [
    { key: 'all', label: 'Todos los pedidos', count: 'total', icon: 'fa-bag-shopping' },
    { key: 'ready', label: 'Por empacar', count: 'ready', icon: 'fa-box-open' },
    { key: 'preparing', label: 'En preparación', count: 'preparing', icon: 'fa-box' },
    { key: 'shipped', label: 'Enviados', count: 'shipped', icon: 'fa-truck-fast' },
  ] as const;
  readonly packingStates: Record<string, { label: string; icon: string; hint: string }> = {
    ready: { label: 'Por empacar', icon: 'fa-box-open', hint: 'Pago recibido · Sin preparar' },
    preparing: { label: 'En preparación', icon: 'fa-box', hint: 'Revisa lo pendiente de enviar' },
    shipped: { label: 'Enviado', icon: 'fa-circle-check', hint: 'Despachado en Shopify' },
    cancelled: { label: 'Cancelado', icon: 'fa-ban', hint: 'No preparar' },
    on_hold: { label: 'En espera', icon: 'fa-pause', hint: 'Revisar antes de preparar' },
    scheduled: { label: 'Programado', icon: 'fa-calendar', hint: 'Revisar fecha en el pedido' },
    review: { label: 'Por revisar', icon: 'fa-circle-exclamation', hint: 'Comprueba el pago y la preparación' },
  };
  readonly filters = [{ key: 'all', label: 'Todos los pedidos', count: 'total', icon: 'fa-bag-shopping' },
    { key: 'unavailable', label: 'Comentarios no recuperados', count: 'unavailable', icon: 'fa-comment-slash' },
    { key: 'with_comments', label: 'Con comentarios', count: 'with_comments', icon: 'fa-comments' },
    { key: 'unchecked', label: 'Sin revisar', count: 'unchecked', icon: 'fa-clock' }] as const;
  private readonly destroy$ = new Subject<void>();
  private readonly refresh$ = new Subject<void>();
  get detailQuery(): Record<string, string> { return { ...this.query, ...(this.data?.run ? { run_id: this.data.run.id } : {}) }; }
  get listHeading(): string { return this.packingStates[this.query['work']]?.label ?? 'Todos los pedidos'; }
  constructor(private service: ImportedOrdersService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    combineLatest([this.route.queryParamMap, this.refresh$.pipe(startWith(undefined))]).pipe(switchMap(([params]) => {
      this.query = {};
      for (const key of ['run_id', 'timeline', 'work', 'q', 'page']) if (params.get(key)) this.query[key] = params.get(key)!;
      this.search = this.query['q'] ?? '';
      this.loading = true; this.error = '';
      return this.service.list(this.query).pipe(catchError(() => { this.error = 'No se pudieron cargar los pedidos. Vuelve a intentarlo.'; this.data = null; return EMPTY; }), finalize(() => this.loading = false));
    }), takeUntil(this.destroy$)).subscribe(response => this.data = response.data);
  }
  filter(key: string): void { this.navigate({ timeline: key, page: '1' }); }
  filterWork(key: string): void { this.navigate({ work: key, page: '1' }); }
  selectTimeline(event: Event): void { this.filter((event.target as HTMLSelectElement).value); }
  selectWork(event: Event): void { this.filterWork((event.target as HTMLSelectElement).value); }
  submit(): void { this.navigate({ q: this.search.trim() || null, page: '1' }); }
  changeRun(event: Event): void { this.navigate({ run_id: (event.target as HTMLSelectElement).value, page: '1' }); }
  page(value: number): void { if (this.data && value >= 1 && value <= this.data.pagination.last_page && !this.loading) this.navigate({ page: String(value) }); }
  retry(): void { this.refresh$.next(); }
  clear(): void { this.search = ''; this.navigate({ q: null, timeline: 'all', work: 'all', page: '1' }); }
  private navigate(values: Record<string, string | null>): void { void this.router.navigate([], { relativeTo: this.route, queryParams: { ...this.query, ...values } }); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

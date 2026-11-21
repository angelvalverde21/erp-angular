import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, EMPTY, finalize, startWith, Subject, switchMap } from 'rxjs';
import { DateShopifyPipe } from '../../shared/pipes/date-shopify.pipe';
import { OrderWorkspaceService } from './order-workspace.service';
import { PREPARATION_FILTERS, PREPARATION_STATES, WorkspacePage } from './order-workspace.model';
import { OrderPreparationBadgeComponent } from './order-preparation-badge.component';
import { OrderProductListComponent } from './order-product-list.component';

@Component({
  selector: 'app-order-workspace-list',
  imports: [FormsModule, RouterLink, DecimalPipe, DateShopifyPipe, OrderPreparationBadgeComponent, OrderProductListComponent],
  templateUrl: './order-workspace-list.component.html',
  styleUrls: ['./order-workspace.scss', './order-workspace-list.component.scss'],
})
export class OrderWorkspaceListComponent implements OnInit {
  private readonly service = inject(OrderWorkspaceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refresh$ = new Subject<void>();

  readonly filters = PREPARATION_FILTERS;
  readonly otherStates = Object.entries(PREPARATION_STATES).filter(([key]) => !['ready', 'preparing', 'shipped'].includes(key));
  data: WorkspacePage | null = null;
  query: Record<string, string> = {};
  search = '';
  loading = false;
  error = '';

  get activeFilter(): string { return this.query['work'] || 'all'; }
  get heading(): string { return PREPARATION_STATES[this.activeFilter as keyof typeof PREPARATION_STATES]?.label ?? 'Todos los pedidos'; }
  get detailQuery(): Record<string, string> { return { ...this.query, ...(this.data?.runId ? { run_id: this.data.runId } : {}) }; }

  ngOnInit(): void {
    combineLatest([this.route.queryParamMap, this.refresh$.pipe(startWith(undefined))]).pipe(
      switchMap(([params]) => {
        this.query = {};
        for (const key of ['q', 'work', 'page', 'run_id']) if (params.get(key)) this.query[key] = params.get(key)!;
        this.search = this.query['q'] || '';
        this.loading = true;
        this.error = '';
        return this.service.list(this.query).pipe(
          catchError(() => { this.data = null; this.error = 'No se pudieron cargar los pedidos. Vuelve a intentarlo.'; return EMPTY; }),
          finalize(() => this.loading = false),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(page => this.data = page);
  }

  filter(work: string): void { this.navigate({ work, page: '1' }); }
  submit(): void { this.navigate({ q: this.search.trim() || null, page: '1' }); }
  clear(): void { this.navigate({ q: null, work: 'all', page: '1' }); }
  retry(): void { this.refresh$.next(); }
  page(page: number): void {
    if (!this.loading && this.data && page >= 1 && page <= this.data.lastPage) this.navigate({ page: String(page) });
  }
  private navigate(query: Record<string, string | null>): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { ...this.query, ...query } });
  }
}

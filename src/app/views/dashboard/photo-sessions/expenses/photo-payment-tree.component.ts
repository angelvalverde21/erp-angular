import { Component, DestroyRef, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, of, switchMap } from 'rxjs';
import { PhotoExpenseService } from './photo-expense.service';
import { PhotoExpenseContext, PhotoExpenseTarget } from './photo-expense.model';
import { PurchaseIndexComponent } from '../../purchases/purchase-index/purchase-index.component';

@Component({ selector: 'app-photo-payment-tree', imports: [CurrencyPipe, DatePipe, PurchaseIndexComponent],
  template: `
    @if (loading) { <p role="status">Actualizando gastos…</p> }
    @if (error) { <p role="alert">No se pudieron cargar los gastos. <button type="button" (click)="load()">Reintentar</button></p> }
    @if (context; as data) {
      <div class="expense-summary"><span>Compras: <strong>{{ data.total_purchases | currency:'PEN':'symbol':'1.2-2':'es-PE' }}</strong></span><span>Pagado: <strong>{{ data.total_paid | currency:'PEN':'symbol':'1.2-2':'es-PE' }}</strong></span></div>
      <app-purchase-index [purchases]="data.purchases" purchaseable_type="photo_session" [purchaseable_id]="sessionId" [photoSource]="data.source" [productionView]="true" [compactHeader]="true" [stageName]="'Compras de ' + target.name" stageDescription="Consulta los conceptos y registra los pagos dentro de cada compra." (purchasesChanged)="load(true)" />
      @if (data.legacy_expenses.length) { <details><summary>Pagos directos anteriores</summary>@for (expense of data.legacy_expenses; track expense.id) { <p>{{ expense.payment.date | date:'dd/MM/yyyy' }} · {{ expense.payment.comment }} <strong>{{ expense.payment.amount | currency:'PEN':'symbol':'1.2-2':'es-PE' }}</strong></p> }</details> }
    }
  `,
  styles: [`:host { display:block; padding:18px 20px; border-top:1px solid #e5ebf3; background:#fff; } .expense-summary { display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:20px; padding:14px; border:1px solid #ddd2fa; border-radius:8px; background:#f7f3fe; font-size:13px; } .expense-summary strong { color:#6b4db4; font-size:20px; } details { margin-top:16px; } button { padding:6px 10px; }`]
})
export class PhotoPaymentTreeComponent implements OnChanges {
  @Input() sessionId = 0;
  @Input({ required: true }) target!: PhotoExpenseTarget;
  @Input() revision = 0;
  @Output() paid = new EventEmitter<{ target: PhotoExpenseTarget; total: number; cost: number }>();
  private notifyNext = false;
  context: PhotoExpenseContext | null = null;
  loading = false; error = false;
  private lastKey = '';
  private readonly api = inject(PhotoExpenseService);
  private readonly refresh = new Subject<void>();
  constructor() {
    const destroyRef = inject(DestroyRef);
    this.refresh.pipe(switchMap(() => {
      this.loading = true; this.error = false; this.context = null;
      return this.api.context(this.sessionId, this.target).pipe(catchError(() => { this.error = true; return of(null); }));
    }), takeUntilDestroyed(destroyRef)).subscribe(response => { this.context = response?.data || null; this.loading = false; if (this.context && this.notifyNext) { this.notifyNext = false; this.paid.emit({ target: this.target, total: this.context.total_paid, cost: this.context.total_purchases }); } });
  }
  ngOnChanges(): void {
    const key = `${this.sessionId}:${this.target?.kind}:${this.target?.id}:${this.revision}`;
    if (key !== this.lastKey) { this.lastKey = key; this.load(); }
  }
  load(notify = false): void { if (this.sessionId && this.target) { this.notifyNext = notify; this.refresh.next(); } }
}

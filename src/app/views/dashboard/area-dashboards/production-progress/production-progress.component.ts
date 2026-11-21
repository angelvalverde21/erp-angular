import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductionProgress, ProductionProgressItem } from '../dashboard.model';
@Component({ selector: 'app-production-progress', imports: [DatePipe, DecimalPipe, CurrencyPipe, RouterLink], templateUrl: './production-progress.component.html', styleUrl: './production-progress.component.scss' })
export class ProductionProgressComponent {
  @Input({ required: true }) summary!: ProductionProgress;
  @Input() store = '';
  @Input() limit = 6;
  @Input() loading = false;
  @Output() limitChanged = new EventEmitter<number>();
  readonly limits = Array.from({ length: 9 }, (_, index) => index + 2);
  constructor(private router: Router) {}
  changeLimit(value: string): void { if (value === 'all') { void this.router.navigate(this.link()); return; } const limit = Number(value); if (this.limits.includes(limit)) this.limitChanged.emit(limit); }
  @ViewChild('detailDialog') detailDialog?: ElementRef<HTMLDialogElement>;
  selected: ProductionProgressItem | null = null;
  readonly labels = { unplanned: 'Sin plan', pending: 'Pendiente', in_progress: 'Recepción parcial', completed: 'Recepción completa' };
  get items(): ProductionProgressItem[] { return this.summary.recent_items ?? this.summary.items; }
  get totalUnits(): number { return this.items.reduce((sum, item) => sum + item.planned_units, 0); }
  get totalExpense(): number | null { return this.items.some(item => item.total_expense == null) ? null : this.items.reduce((sum, item) => sum + (item.total_expense ?? 0), 0); }
  get weightedCost(): number | null { return this.totalExpense !== null && this.totalUnits > 0 ? this.totalExpense / this.totalUnits : null; }
  productNames(production: ProductionProgressItem): string { return [...new Set((production.variants ?? []).map(variant => variant.product_name))].join(' · '); }
  open(production: ProductionProgressItem): void { this.selected = production; this.detailDialog?.nativeElement.showModal(); }
  close(): void { this.detailDialog?.nativeElement.close(); this.selected = null; }
  link(path = 'manufactures/productions'): string[] { return ['/', this.store, 'dashboard', ...path.split('/')]; }
}

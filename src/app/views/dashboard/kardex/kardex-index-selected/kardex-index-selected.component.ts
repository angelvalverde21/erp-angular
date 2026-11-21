import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { KardexIndexSelectedRowComponent } from '../kardex-index-selected-row/kardex-index-selected-row.component';

@Component({
  selector: 'app-kardex-index-selected', imports: [KardexIndexSelectedRowComponent, DecimalPipe],
  templateUrl: './kardex-index-selected.component.html', styleUrl: './kardex-index-selected.component.scss',
})
export class KardexIndexSelectedComponent implements OnChanges {
  @Input() variants: any[] = [];
  @Input() color_check = 'success';
  @Input() comments: string[] = [];
  @Input() disabled = false;
  @Input() showSummary = true;
  @Input() initialItems: any[] = [];
  initialById = new Map<number, any>();
  @Output() emitKardexVariants = new EventEmitter<any>();
  kardex_variants: any[] = [];
  sum = 0;
  search = '';

  get availableVariants(): any[] {
    return (Array.isArray(this.variants) ? this.variants : []).filter(variant => variant && Number.isInteger(Number(variant.id)) && Number(variant.id) > 0);
  }
  get unavailableCount(): number { return (Array.isArray(this.variants) ? this.variants.length : 0) - this.availableVariants.length; }
  get visibleCount(): number { return this.availableVariants.filter(variant => this.matches(variant)).length; }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialItems']) {
      this.initialById = new Map(this.initialItems.map(item => [Number(item.variant_id), item]));
      this.kardex_variants = this.initialItems.map(item => ({ ...item }));
      this.sumQuantity();
    }
    if (!changes['variants'] || !this.kardex_variants.length) return;
    const ids = new Set(this.availableVariants.map(variant => String(variant.id)));
    const previousCount = this.kardex_variants.length;
    this.kardex_variants = this.kardex_variants.filter(item => ids.has(String(item.variant_id)));
    if (this.kardex_variants.length !== previousCount) {
      this.sumQuantity();
      queueMicrotask(() => this.emitKardexVariants.emit(this.kardex_variants));
    }
  }
  matches(variant: any): boolean {
    if (!variant?.id) return false;
    const query = this.search.trim().toLocaleLowerCase();
    const text = [variant.sku, variant.product?.name, ...(variant.option_values || []).map((option: any) => option.value)].join(' ').toLocaleLowerCase();
    return !query || query.split(/\s+/).every(word => text.includes(word));
  }
  receiveVariantKardex(event: any): void {
    const quantity = Number(event.quantity);
    const remaining = this.kardex_variants.filter(item => item.variant_id !== event.variant_id);
    const available = this.availableVariants.some(variant => String(variant.id) === String(event.variant_id));
    this.kardex_variants = available && Number.isFinite(quantity) && quantity >= 1 && event.comment ? [...remaining, { ...event, quantity }] : remaining;
    this.sumQuantity();
    this.emitKardexVariants.emit(this.kardex_variants);
  }
  sumQuantity(): void { this.sum = this.kardex_variants.reduce((sum, item) => sum + Number(item.quantity), 0); }
}

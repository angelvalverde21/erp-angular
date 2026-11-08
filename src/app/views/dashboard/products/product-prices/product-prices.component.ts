import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, finalize, forkJoin, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ProductService } from '../product.service';
import { PriceLabel, ProductPrice } from '../../../../interfaces/product-price.interface';

interface PriceRow {
  id?: number;
  form: FormGroup;
  busy: boolean;
  error: string;
  saved: boolean;
  label?: PriceLabel | null;
}

@Component({
  selector: 'app-product-prices',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './product-prices.component.html',
  styleUrl: './product-prices.component.scss',
  host: { '[class.prices-compact]': 'compact' },
})
export class ProductPricesComponent implements OnInit, OnDestroy {
  @Input({ required: true }) productId!: number;
  @Input() compact = false;
  private fb = inject(FormBuilder);
  private service = inject(ProductService);
  private destroy$ = new Subject<void>();
  private labelSearch$ = new Subject<string>();
  labelSuggestions: PriceLabel[] = [];
  labelSearchError = '';
  selectedLabelCode = '';
  rows: PriceRow[] = [];
  loading = true;
  loadError = '';

  ngOnInit(): void {
    this.labelSearch$.pipe(
      debounceTime(200), distinctUntilChanged(),
      switchMap(search => this.service.getPriceLabels(search).pipe(catchError(() => {
        this.labelSearchError = 'No se pudieron cargar las sugerencias de nombres.';
        return of({ data: [] as PriceLabel[] });
      }))),
      takeUntil(this.destroy$),
    ).subscribe(response => { this.labelSuggestions = response.data; });
    this.load();
  }

  get availableLabels(): PriceLabel[] {
    const labels = new Map<number, PriceLabel>();
    for (const row of this.rows) { if (row.label) labels.set(row.label.id, row.label); }
    return [...labels.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  searchLabels(value: string): void {
    this.labelSearchError = '';
    this.labelSearch$.next(value.trim());
  }

  load(): void {
    this.loading = true;
    this.loadError = '';
    forkJoin({ prices: this.service.getPrices(this.productId), labels: this.service.getPriceLabels() })
      .pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        this.rows = response.prices.data.map(price => this.createRow(price));
        this.labelSuggestions = response.labels.data;
        this.selectedLabelCode = '';
      },
      error: () => { this.loadError = 'No se pudieron cargar los precios. Intenta nuevamente.'; },
    });
  }

  add(): void { this.selectedLabelCode = ''; this.rows.unshift(this.createRow()); }

  private createRow(price?: ProductPrice): PriceRow {
    const form = this.fb.group({
      name: [price?.name ?? '', [Validators.required, Validators.maxLength(255), Validators.pattern(/\S/)]],
      quantity: [price ? Number(price.quantity) : 1, [Validators.required, Validators.min(0.001), Validators.max(999999999.999), Validators.pattern(/^\d+(\.\d{1,3})?$/)]],
      price: [price ? Number(price.price) : null, [Validators.required, Validators.min(0), Validators.max(999999999999.99), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      total: [price ? Number(price.total) : 0, [Validators.required, Validators.min(0), Validators.max(9999999999999999.99)]],
    });
    const row: PriceRow = { id: price?.id, form, busy: false, error: '', saved: false, label: price?.label };
    form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      const total = Math.round((Number(value.quantity) * Number(value.price) + Number.EPSILON) * 100) / 100;
      form.controls.total.setValue(Number.isFinite(total) ? total : 0, { emitEvent: false });
      row.saved = false;
      row.error = '';
    });
    return row;
  }

  save(row: PriceRow): void {
    if (row.busy) return;
    row.form.markAllAsTouched();
    if (row.form.invalid) return;
    row.busy = true;
    row.error = '';
    row.saved = false;
    const values = row.form.getRawValue();
    values.name = values.name.trim();
    this.service.savePrice(this.productId, values, row.id).pipe(
      takeUntil(this.destroy$), finalize(() => row.busy = false),
    ).subscribe({
      next: response => {
        row.id = response.data.id;
        row.label = response.data.label;
        if (row.label && !this.labelSuggestions.some(label => label.id === row.label!.id)) {
          this.labelSuggestions = [...this.labelSuggestions, row.label];
        }
        this.selectedLabelCode = '';
        row.form.patchValue({ ...response.data, quantity: Number(response.data.quantity), price: Number(response.data.price), total: Number(response.data.total) }, { emitEvent: false });
        row.form.markAsPristine();
        row.saved = true;
      },
      error: error => {
        const errors = error.error?.errors;
        row.error = errors ? Object.values(errors).flat().join(' ') : 'No se pudo guardar el precio. Intenta nuevamente.';
      },
    });
  }

  remove(row: PriceRow): void {
    if (row.busy) return;
    if (!row.id) { this.rows = this.rows.filter(item => item !== row); return; }
    row.busy = true;
    row.error = '';
    this.service.deletePrice(this.productId, row.id).pipe(
      takeUntil(this.destroy$), finalize(() => row.busy = false),
    ).subscribe({
      next: () => { this.rows = this.rows.filter(item => item !== row); this.selectedLabelCode = ''; },
      error: () => { row.error = 'No se pudo eliminar el precio. Intenta nuevamente.'; },
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

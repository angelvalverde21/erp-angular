import { Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, finalize, of, switchMap, takeUntil, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { VariantService } from '../../../products/variants/variant.service';
import { KardexService } from '../../../kardex/kardex.service';
import { BarcodeVariant, KardexMovement } from '../inventory-barcode-search/inventory-barcode.model';

interface CountRow {
  variant: BarcodeVariant;
  initialStock: number;
  quantity: FormControl<number | null>;
  counted: boolean;
}

interface CatalogResponse {
  data: BarcodeVariant[];
  meta?: { last_page?: number; total?: number };
  last_page?: number;
  total?: number;
  links?: { next?: string | null };
  next_page_url?: string | null;
}

@Component({
  selector: 'app-inventory-total-count',
  imports: [ReactiveFormsModule],
  templateUrl: './inventory-total-count.component.html',
  styleUrl: './inventory-total-count.component.scss',
})
export class InventoryTotalCountComponent implements OnDestroy {
  @Input() active = false;
  @Output() busyChange = new EventEmitter<boolean>();
  @Output() countApplied = new EventEmitter<void>();

  private readonly variantService = inject(VariantService);
  private readonly kardexService = inject(KardexService);
  private readonly destroy$ = new Subject<void>();
  private destroyed = false;

  rows: CountRow[] = [];
  loading = false;
  saving = false;
  confirming = false;
  finished = false;
  loadedCount = 0;
  catalogLoaded = false;
  expectedCount: number | null = null;
  savedMovements = 0;
  query = '';
  error = '';
  needsStockReview = false;
  reviewNotice = '';

  get busy(): boolean { return this.loading || this.saving || this.confirming; }
  get counted(): number { return this.rows.filter(row => row.counted && this.validRow(row)).length; }
  get differences(): number {
    return this.rows.filter(row => row.counted && this.validRow(row) && row.quantity.value !== row.initialStock).length;
  }
  get canFinish(): boolean {
    return !this.busy && !this.finished && !this.needsStockReview && this.rows.length > 0 && this.counted === this.rows.length;
  }
  get visibleRows(): CountRow[] {
    const query = this.query.trim().toLocaleLowerCase();
    if (!query) return this.rows;
    return this.rows.filter(row => [row.variant.id, row.variant.sku, row.variant.product?.name,
      ...(row.variant.variant_option_values ?? []).map(option => option.option_value?.value)]
      .join(' ').toLocaleLowerCase().includes(query));
  }

  validRow(row: CountRow): boolean {
    return row.quantity.valid && Number.isSafeInteger(row.quantity.value);
  }

  markCounted(row: CountRow, counted = true): void {
    if (!this.busy && !this.finished) row.counted = counted;
  }

  markStockChanged(): void {
    if (!this.rows.length || this.finished) return;
    this.needsStockReview = true;
    this.error = 'Se registró o intentó un movimiento mientras este conteo estaba abierto. Vuelve a consultar el stock antes de finalizar.';
  }

  startCount(preserveCounts = false): void {
    if (this.busy) return;
    const previousRows = preserveCounts ? new Map(this.rows.map(row => [row.variant.id, row])) : new Map<number, CountRow>();
    if (!preserveCounts) this.rows = [];
    this.error = '';
    this.reviewNotice = '';
    this.query = '';
    this.finished = false;
    this.loadedCount = 0;
    this.catalogLoaded = false;
    this.expectedCount = null;
    this.loading = true;
    this.emitBusy();

    this.loadCatalog(1, new Map()).pipe(
      takeUntil(this.destroy$),
      finalize(() => { this.loading = false; this.emitBusy(); }),
    ).subscribe({
      next: variants => {
        if (variants.some(variant => !Number.isSafeInteger(variant.stock))) {
          this.error = 'No se puede iniciar: hay variantes sin un stock de referencia válido.';
          return;
        }
        this.rows = variants.map(variant => {
          const previous = previousRows.get(variant.id);
          return {
            variant,
            initialStock: variant.stock!,
            quantity: previous?.quantity ?? new FormControl<number | null>(0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]),
            counted: false,
          };
        });
        this.catalogLoaded = true;
        this.needsStockReview = false;
        if (preserveCounts) this.reviewNotice = 'Se conservan tus cantidades. Revisa y confirma nuevamente cada variante con el stock actualizado.';
      },
      error: () => { this.error = 'No se pudo cargar el catálogo completo. Reintenta antes de comenzar el conteo.'; },
    });
  }

  private loadCatalog(page: number, variants: Map<number, BarcodeVariant>): Observable<BarcodeVariant[]> {
    return this.variantService.index(page).pipe(switchMap((response: unknown) => {
      const result = (Array.isArray(response) ? { data: response } : response) as CatalogResponse;
      if (!result || !Array.isArray(result.data)) return throwError(() => new Error('Invalid catalog response'));

      const previousSize = variants.size;
      for (const variant of result.data) {
        if (!Number.isSafeInteger(variant.id)) return throwError(() => new Error('Invalid variant ID'));
        variants.set(variant.id, variant);
      }
      this.loadedCount = variants.size;
      this.expectedCount = result.meta?.total ?? result.total ?? this.expectedCount;

      const lastPage = result.meta?.last_page ?? result.last_page;
      let next: boolean | null = null;
      if (lastPage != null) next = page < lastPage;
      else if (result.links && 'next' in result.links) next = !!result.links.next;
      else if ('next_page_url' in result) next = !!result.next_page_url;

      if (!result.data.length || next === false || variants.size === previousSize) {
        if ((this.expectedCount != null && variants.size !== this.expectedCount) ||
            (next === true && variants.size === previousSize)) {
          return throwError(() => new Error('Incomplete catalog'));
        }
        return of([...variants.values()]);
      }
      return this.loadCatalog(page + 1, variants);
    }));
  }

  async finishCount(): Promise<void> {
    if (!this.canFinish) return;

    const movements: KardexMovement[] = this.rows.flatMap(row => {
      const difference = row.quantity.value! - row.initialStock;
      return difference === 0 ? [] : [{
        variant_id: row.variant.id,
        direction: difference > 0 ? 'in' as const : 'out' as const,
        quantity: Math.abs(difference),
        comment: 'Conteo total',
      }];
    });
    if (!movements.length) {
      this.finished = true;
      this.savedMovements = 0;
      this.countApplied.emit();
      return;
    }

    this.confirming = true;
    this.emitBusy();
    let confirmed = false;
    try {
      const result = await Swal.fire({
        title: 'Aplicar conteo total',
        text: `Se registrarán ${movements.length} movimientos. Las variantes confirmadas con cantidad cero quedarán sin existencias.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aplicar conteo',
        cancelButtonText: 'Seguir revisando',
        focusCancel: true,
      });
      confirmed = result.isConfirmed;
    } catch {
      this.error = 'No se pudo abrir la confirmación. El conteo se conserva.';
    } finally {
      this.confirming = false;
      if (!confirmed && !this.destroyed) this.emitBusy();
    }
    if (!confirmed || this.destroyed) return;

    this.saving = true;
    this.error = '';
    this.emitBusy();
    this.kardexService.batch(movements).pipe(
      takeUntil(this.destroy$),
      finalize(() => { this.saving = false; this.emitBusy(); }),
    ).subscribe({
      next: () => {
        this.savedMovements = movements.length;
        this.finished = true;
        this.countApplied.emit();
      },
      error: () => {
        this.needsStockReview = true;
        this.error = 'No se pudo confirmar el conteo. Se conservan las cantidades. Vuelve a consultar el stock para revisar los movimientos antes de reintentar.';
      },
    });
  }

  private emitBusy(): void { this.busyChange.emit(this.busy); }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.confirming) Swal.close();
    this.destroy$.next();
    this.destroy$.complete();
  }
}

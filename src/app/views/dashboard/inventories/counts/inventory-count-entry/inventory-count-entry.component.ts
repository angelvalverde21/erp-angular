import { Component, EventEmitter, Input, OnChanges, OnDestroy, SimpleChanges, Output, ViewChild } from '@angular/core';
import { finalize, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { InventoryCount, InventoryCountPayload, InventoryVariant, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { branchError, markBranchFieldErrors } from '../../../branches/branch-api.model';
import { VariantService } from '../../../products/variants/variant.service';
import { InventoryCountService } from '../inventory-count.service';
import { InventoryCountCreateComponent } from '../inventory-count-create/inventory-count-create.component';

@Component({
  selector: 'app-inventory-count-entry',
  imports: [InventoryCountCreateComponent],
  templateUrl: './inventory-count-entry.component.html',
  styleUrl: './inventory-count-entry.component.scss',
})
export class InventoryCountEntryComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) inventoryId!: number;
  @Input({ required: true }) sessionId!: number;
  @Input() locationId: number | null = null;
  @Input() readOnly = false;
  @Input({ required: true }) options!: InventoryWorkspaceOptions;
  @Output() busyChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<InventoryCount>();
  @Output() editExisting = new EventEmitter<number>();
  @ViewChild(InventoryCountCreateComponent) private editor?: InventoryCountCreateComponent;
  variants: InventoryVariant[] = [];
  countedQuantity = 0;
  searching = false;
  saving = false;
  searchError = '';
  error = '';
  success = '';
  private readonly destroy$ = new Subject<void>();
  private readonly cancelSearch$ = new Subject<void>();

  constructor(
    private _variant: VariantService,
    private _count: InventoryCountService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locationId']) {
      this.cancelSearch$.next();
      this.variants = [];
      this.searchError = '';
      this.error = '';
      this.success = '';
    }
  }

  searchVariant(code: string): void {
    if (this.saving || this.readOnly || !this.locationId || !code.trim()) return;
    this.cancelSearch$.next();
    this.searching = true;
    this.variants = [];
    this.searchError = '';
    this.error = '';
    this.success = '';
    this._variant.get(code.trim()).pipe(
      switchMap(response => {
        const variant = response && 'data' in response ? response.data : response;
        if (!variant?.id) return of({ variant: null, total: 0 });
        return this._count.list(this.inventoryId, this.sessionId, 1, variant.id, this.locationId ?? undefined).pipe(
          map(response => ({ variant, total: response.variant_counted_quantity ?? 0 })),
        );
      }),
      takeUntil(this.destroy$), takeUntil(this.cancelSearch$), finalize(() => this.searching = false),
    ).subscribe({
      next: result => {
        this.countedQuantity = result.total;
        this.variants = result.variant?.id ? [result.variant] : [];
      },
      error: error => {
        if (error.status !== 404) this.searchError = branchError(error, 'No se pudo consultar la variante.');
      },
    });
  }

  save(payload: InventoryCountPayload): void {
    if (this.saving || this.searching || this.readOnly || !this.locationId || this.options.recording_locked || payload.location_id !== this.locationId) return;
    this.saving = true;
    this.busyChange.emit(true);
    this.error = '';
    this.success = '';
    this._count.create(this.inventoryId, this.sessionId, payload).pipe(
      takeUntil(this.destroy$), finalize(() => { this.saving = false; this.busyChange.emit(false); }),
    ).subscribe({
      next: response => {
        const name = response.data.variant?.product?.name || this.editor?.selectedVariant?.product?.name || 'Variante #' + response.data.variant_id;
        this.variants = [];
        this.editor?.completeRegistration(response.data);
        this.success = name + ': ' + response.data.quantity + ' unidades registradas.';
        this.saved.emit(response.data);
      },
      error: error => {
        markBranchFieldErrors(this.editor?.form, error);
        this.error = branchError(error, 'No se pudo registrar el conteo.');
      },
    });
  }

  openExisting(id: number): void { if (!this.saving) this.editExisting.emit(id); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); this.cancelSearch$.next(); this.cancelSearch$.complete(); }
}

import { ImagePreviewComponent } from 'src/app/views/shared/components/image-preview/image-preview.component';
import { WarehouseSelectComponent } from '../../../warehouses/warehouse-select/warehouse-select.component';
import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventoryCount, InventoryCountPayload, InventoryWorkspaceOptions, InventoryVariant } from 'src/app/interfaces/inventory-workspace.interface';
import { BranchFieldValidationDirective } from '../../../branches/branch-field-validation.directive';
import { INVENTORY_STATUS_LABELS } from '../../inventory-workflow';
import Swal from 'sweetalert2';
@Component({ selector: 'app-inventory-count-create', imports: [ImagePreviewComponent, WarehouseSelectComponent, CurrencyPipe, DatePipe, UpperCasePipe, RouterLink, ReactiveFormsModule, BranchFieldValidationDirective], templateUrl: './inventory-count-create.component.html', styleUrl: './inventory-count-create.component.scss' })
export class InventoryCountCreateComponent implements OnChanges, AfterViewChecked, OnDestroy {
  @Input() options: InventoryWorkspaceOptions | null = null;
  @Input() saving = false;
  @Input() readOnly = false;
  @Input() variants: InventoryVariant[] = [];
  @Input() initialVariant: InventoryVariant | null = null;
  @Input() searching = false;
  @Input() searchError = '';
  @Input() initialLocationId: number | null = null;
  @Input() embedded = false;
  @Input() showHistory = true;
  @Input() showLocationPicker = true;
  @Output() editExisting = new EventEmitter<number>();
  @Input() countedQuantity = 0;
  @Input() historyRecords: InventoryCount[] | null = null;
  @Input() historyLoading = false;
  @Input() historyError = '';
  @Input() historyTotal = 0;
  @Input() historyPage = 1;
  @Input() historyLastPage = 1;
  @Output() historyPageChange = new EventEmitter<number>();
  get countHistory(): InventoryCount[] { return this.historyRecords ?? this.savedRecords; }
  @Output() searchVariants = new EventEmitter<string>();
  @Output() save = new EventEmitter<InventoryCountPayload>();
  @ViewChild('barcodeInput') private barcodeInput?: ElementRef<HTMLInputElement>;
  @ViewChild('quantityInput') private quantityInput?: ElementRef<HTMLInputElement>;
  private focusPending: 'barcode' | 'quantity' | null = null;
  readonly quantityWarningLimit = 50;
  confirmingQuantity = false;
  private destroyed = false;
  savedRecords: InventoryCount[] = [];
  get savedRecord(): InventoryCount | null { return this.savedRecords[0] ?? null; }
  registrationComplete = false;
  initialQuantity = 0;
  locationConfirmed = false;
  selectedBranchId: number | null = null;
  selectedWarehouseId: number | null = null;
  get branches(): { id: number; name: string }[] {
    if (this.options?.branches) return this.options.branches;
    const branches = this.options?.locations.flatMap(location => location.warehouse?.branch ? [location.warehouse.branch] : []) ?? [];
    return [...new Map(branches.map(branch => [branch.id, branch])).values()];
  }
  get warehouses(): { id: number; name: string }[] {
    if (this.options?.warehouses) return this.options.warehouses.filter(warehouse => warehouse.branch_id === this.selectedBranchId);
    const warehouses = this.options?.locations.flatMap(location => location.warehouse?.branch?.id === this.selectedBranchId ? [location.warehouse] : []) ?? [];
    return [...new Map(warehouses.map(warehouse => [warehouse.id, warehouse])).values()];
  }
  get zones() { return this.options?.locations.filter(location => location.warehouse_id === this.selectedWarehouseId) ?? []; }
  get locationPath(): string {
    const location = this.options?.locations.find(item => item.id === this.form.controls.location_id.value);
    return [location?.warehouse?.branch?.name, location?.warehouse?.name, location?.parent?.name, location?.name].filter(Boolean).join(' / ') || this.locationName;
  }
  get warehouseSubtitle(): string | null {
    return this.options?.warehouses?.find(item => item.id === this.selectedWarehouseId)?.subtitle ?? null;
  }
  selectBranch(value: string): void {
    if (this.locationConfirmed) return;
    this.selectedBranchId = value ? Number(value) : null;
    this.selectedWarehouseId = null;
    this.form.controls.location_id.reset(null);
  }
  selectWarehouse(value: string | number | null): void {
    if (this.locationConfirmed) return;
    this.selectedWarehouseId = value ? Number(value) : null;
    this.form.controls.location_id.reset(null);
  }
  selectedVariant: InventoryVariant | null = null;
  searchTerm = '';
  hasSearched = false;
  imageUnavailable = false;
  round: number | null = null;
  recordStatus: 'valid' | 'replaced' | 'cancelled' | null = null;
  editing = false;
  cancelPath = ['../'];
  readonly labels = INVENTORY_STATUS_LABELS;
  
  readonly form;
  constructor(private fb: FormBuilder) { this.form = this.fb.nonNullable.group({ location_id: [null as number | null, Validators.required], variant_id: [null as number | null, Validators.required], quantity: [null as number | null, [Validators.required, Validators.min(0), Validators.max(2147483647), Validators.pattern(/^\d+$/)]], mode: ['accumulate' as 'accumulate' | 'recount'], status: ['valid' as 'valid' | 'cancelled'] }); }
  get canSearch(): boolean { return this.locationConfirmed && !this.editing && !this.saving && !this.readOnly && !this.searching && !this.confirmingQuantity && !!this.searchTerm.trim(); }
  get needsQuantityConfirmation(): boolean {
    return (this.form.controls.quantity.value ?? 0) > this.quantityWarningLimit && this.form.controls.status.value !== 'cancelled';
  }
  confirmLocation(event?: Event): void {
    event?.preventDefault();
    if (this.locationConfirmed || this.saving || this.readOnly) return;
    const location = this.form.controls.location_id;
    location.markAsTouched();
    if (location.invalid) return;
    this.locationConfirmed = true;
    location.disable();
  }
  get productImageUrl(): string | null { return this.imageUnavailable ? null : this.selectedVariant?.product?.image?.url_thumbnail || this.selectedVariant?.product?.image?.url_medium || null; }
  get locationName(): string { return this.options?.locations.find(location => location.id === this.form.controls.location_id.value)?.name || 'la ubicación seleccionada'; }
  get quantityReady(): boolean { return this.form.controls.quantity.value !== null && this.form.controls.quantity.valid; }
  get hasQuantityChange(): boolean { return this.quantityReady && (!this.editing || this.form.controls.quantity.value !== this.initialQuantity); }
  get currentQuantity(): number | null { return this.editing ? this.initialQuantity : this.countedQuantity; }
  get quantityChange(): number | null { return this.form.controls.quantity.value === null ? null : this.form.controls.quantity.value - this.initialQuantity; }

  updateQuantityFromChange(input: HTMLInputElement): void {
    this.registrationComplete = false;
    const change = input.valueAsNumber;
    this.form.controls.quantity.setValue(Number.isFinite(change) ? this.initialQuantity + change : null);
    this.form.controls.quantity.markAsDirty();
    this.form.controls.quantity.markAsTouched();
  }
  get countSummary(): string {
    if (this.readOnly) return 'Cantidad física registrada en ' + this.locationName + '.';
    if (this.editing && this.form.controls.status.value === 'cancelled') return 'Este registro se cancelará y dejará de sumar al conteo vigente.';
    if (!this.quantityReady) return 'Ingresa la cantidad física encontrada en esta ubicación.';
    const quantity = this.form.controls.quantity.value;
    if (this.editing) return 'Se corregirá este registro a ' + quantity + ' unidades.';
    return 'Se registrarán ' + quantity + ' unidades en ' + this.locationName + '.';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editing && (changes['initialLocationId'] || (this.initialLocationId && changes['options']))) {
      const location = this.options?.locations.find(item => item.id === this.initialLocationId);
      if (location) {
        this.form.controls.location_id.setValue(location.id);
        this.form.controls.location_id.disable();
        this.locationConfirmed = true;
      } else if (!this.showLocationPicker) {
        this.form.controls.location_id.enable();
        this.form.controls.location_id.reset(null);
        this.locationConfirmed = false;
      }
      if (changes['initialLocationId']) this.clearProduct(!!location);
    }
    if (!this.editing && changes['initialVariant'] && this.initialVariant) {
      this.hasSearched = true;
      this.chooseVariant(this.initialVariant);
    }
    if (!this.editing && this.hasSearched && (changes['variants'] || changes['searching']) && !this.searching && !this.searchError && this.variants.length === 1) this.chooseVariant(this.variants[0]);
  }

  requestSearch(event: Event): void {
    event.preventDefault();
    if (!this.canSearch) return;
    this.focusPending = null;
    this.hasSearched = true;
    this.registrationComplete = false;
    this.selectedVariant = null;
    this.form.controls.variant_id.reset(null);
    this.form.controls.quantity.reset(null);
    this.searchVariants.emit(this.searchTerm.trim());
  }

  ngAfterViewChecked(): void {
    const input = this.focusPending === 'quantity' ? this.quantityInput?.nativeElement : this.barcodeInput?.nativeElement;
    if (!this.focusPending || !input || input.disabled || this.saving || this.readOnly || this.searching || this.confirmingQuantity) return;
    this.focusPending = null;
    input.focus();
    input.select();
  }

  chooseVariant(variant: InventoryVariant): void {
    if (this.selectedVariant?.id !== variant.id) this.form.controls.quantity.reset(null);
    this.selectedVariant = variant;
    this.initialQuantity = 0;
    this.imageUnavailable = false;
    this.form.controls.variant_id.setValue(variant.id);
    this.form.controls.variant_id.markAsTouched();
    this.focusPending = !this.editing && !this.readOnly ? 'quantity' : null;
  }

  preventInvalidQuantityKey(event: Event): void {
    if (['-', '+', 'e', 'E', '.', ','].includes((event as KeyboardEvent).key)) event.preventDefault();
  }

  completeRegistration(record: InventoryCount): void {
    const confirmed = {
      ...record,
      variant: record.variant ?? this.selectedVariant ?? undefined,
      location: record.location ?? this.options?.locations.find(location => location.id === record.location_id),
    };
    const previous = this.savedRecords.filter(item => item.id !== record.id).map(item =>
      item.variant_id === record.variant_id && item.location_id === record.location_id &&
      item.count_round < record.count_round && item.status === 'valid'
        ? { ...item, status: 'replaced' as const }
        : item,
    );
    this.savedRecords = [confirmed, ...previous];
    this.registrationComplete = true;
    this.initialQuantity = 0;
    this.form.reset({
      location_id: this.form.controls.location_id.value,
      variant_id: this.form.controls.variant_id.value,
      quantity: null,
      mode: 'accumulate',
      status: 'valid',
    });
    if (this.embedded) this.clearProduct();
  }

  nextProduct(): void {
    if (this.saving || this.editing || this.confirmingQuantity) return;
    this.clearProduct();
  }

  private clearProduct(focus = true): void {
    this.registrationComplete = false;
    this.selectedVariant = null;
    this.hasSearched = false;
    this.searchTerm = '';
    this.form.controls.variant_id.reset(null);
    this.form.controls.quantity.reset(null);
    this.form.controls.mode.reset('accumulate');
    this.focusPending = focus ? 'barcode' : null;
  }

  async submit(): Promise<void> {
    if (this.saving || this.readOnly || this.confirmingQuantity || this.destroyed) return;

    if (!this.editing && !this.locationConfirmed) { this.form.controls.location_id.markAsTouched(); return; }
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    if (this.needsQuantityConfirmation) {
      this.confirmingQuantity = true;
      let confirmed = false;
      try {
        const result = await Swal.fire({
          title: 'Revisa la cantidad ingresada',
          text: `Ingresaste ${value.quantity} unidades, una cantidad superior a ${this.quantityWarningLimit}. Podría ser un código de barras ingresado por error. ¿La cantidad es correcta?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: `Sí, registrar ${value.quantity} unidades`,
          cancelButtonText: 'Revisar cantidad',
          focusCancel: true,
          returnFocus: false,
          allowOutsideClick: false,
        });
        confirmed = result.isConfirmed;
      } finally {
        this.confirmingQuantity = false;
      }
      if (this.destroyed || this.readOnly || this.saving) return;
      const current = this.form.getRawValue();
      if (!confirmed || current.quantity !== value.quantity || current.variant_id !== value.variant_id || current.location_id !== value.location_id || current.status !== value.status || current.mode !== value.mode) {
        this.focusPending = 'quantity';
        return;
      }
    }
    this.save.emit({ location_id: value.location_id!, variant_id: value.variant_id!, quantity: value.quantity!, mode: value.mode, ...(this.editing ? {status: value.status} : {}) });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.confirmingQuantity) Swal.close();
  }
}

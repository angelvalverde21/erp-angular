import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, SimpleChanges, Output, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { finalize, from, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { InventoryCount, InventoryCountMove, InventoryCountPayload, InventoryVariant, InventoryVariantLocation, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { branchError, markBranchFieldErrors } from '../../../branches/branch-api.model';
import { VariantService } from '../../../products/variants/variant.service';
import { InventoryCountService } from '../inventory-count.service';
import { InventoryCountCreateComponent } from '../inventory-count-create/inventory-count-create.component';
import Swal from 'sweetalert2';

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
  @Input() movedProduct: InventoryCountMove | null = null;
  @Input({ required: true }) options!: InventoryWorkspaceOptions;
  @Output() busyChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<InventoryCount>();
  @Output() editExisting = new EventEmitter<number>();
  @Output() moveRequested = new EventEmitter<InventoryCountMove>();
  @ViewChild(InventoryCountCreateComponent) private editor?: InventoryCountCreateComponent;
  variants: InventoryVariant[] = [];
  initialVariant: InventoryVariant | null = null;
  countedQuantity = 0;
  searching = false;
  saving = false;
  searchError = '';
  error = '';
  success = '';
  placementNotice = '';
  private readonly document = inject(DOCUMENT);
  private searchRevision = 0;
  private dialogContent: HTMLElement | null = null;
  private destroyed = false;
  private readonly destroy$ = new Subject<void>();
  private readonly cancelSearch$ = new Subject<void>();

  constructor(
    private _variant: VariantService,
    private _count: InventoryCountService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locationId'] || changes['inventoryId'] || changes['sessionId']) {
      this.searchRevision++;
      this.closeLocationDialog();
      this.cancelSearch$.next();
      this.variants = [];
      this.searchError = '';
      this.error = '';
      this.success = '';
      this.placementNotice = '';
      this.initialVariant = null;
    }
    if (changes['movedProduct'] && this.movedProduct && this.movedProduct.location_id === this.locationId) {
      this.initialVariant = this.movedProduct.variant;
      this.variants = [this.movedProduct.variant];
      this.countedQuantity = this.movedProduct.counted_quantity;
      this.placementNotice = 'Cuenta aquí las unidades que trasladarás a esta ubicación. Los conteos anteriores se conservan.';
    }
  }

  searchVariant(code: string): void {
    if (this.saving || this.readOnly || !this.locationId || !code.trim()) return;
    const revision = ++this.searchRevision;
    const locationId = this.locationId;
    this.closeLocationDialog();
    this.cancelSearch$.next();
    this.searching = true;
    this.variants = [];
    this.searchError = '';
    this.error = '';
    this.success = '';
    this.placementNotice = '';
    this.initialVariant = null;
    this._variant.get(code.trim()).pipe(
      switchMap(response => {
        const variant = response && 'data' in response ? response.data : response;
        if (!variant?.id) return of({ variant: null, total: 0, otherLocations: [] as InventoryVariantLocation[] });
        return this._count.list(this.inventoryId, this.sessionId, 1, variant.id, this.locationId ?? undefined).pipe(
          map(response => ({ variant, total: response.variant_counted_quantity ?? 0, otherLocations: response.other_locations ?? [] })),
        );
      }),
      switchMap(result => result.variant && result.otherLocations.length
        ? from(this.confirmLocationChoice(result.variant, result.otherLocations, locationId, revision, result.total)).pipe(
          map(keep => ({ ...result, variant: keep ? result.variant : null })),
        )
        : of(result)),
      takeUntil(this.destroy$), takeUntil(this.cancelSearch$), finalize(() => this.searching = false),
    ).subscribe({
      next: result => {
        this.countedQuantity = result.total;
        this.variants = result.variant?.id ? [result.variant] : [];
        if (!result.variant) this.editor?.nextProduct();
      },
      error: error => {
        if (error.status !== 404) this.searchError = branchError(error, 'No se pudo consultar la variante.');
      },
    });
  }

  private async confirmLocationChoice(variant: InventoryVariant, locations: InventoryVariantLocation[], locationId: number, revision: number, countedQuantity: number): Promise<boolean> {
    const warehouseId = this.options.locations.find(location => location.id === locationId)?.warehouse_id;
    const destinations = locations.filter(destination => this.options.locations.some(location =>
      location.id === destination.location_id && location.warehouse_id === warehouseId,
    ));
    const content = this.document.createElement('div');
    content.className = 'text-start';
    const product = this.document.createElement('p');
    product.className = 'fw-semibold mb-2';
    const options = variant.variant_option_values?.map(option => `${option.option?.label || option.option?.name || 'Opción'}: ${option.option_value?.value?.toUpperCase() || '—'}`).join(' · ');
    product.textContent = [variant.product?.name || `Variante #${variant.id}`, variant.sku, options].filter(Boolean).join(' · ');
    content.append(product);
    const description = this.document.createElement('p');
    description.textContent = 'Esta misma variante ya tiene unidades contadas en otras ubicaciones de este inventario:';
    content.append(description);
    const list = this.document.createElement('ul');
    list.className = 'list-group mb-3';
    list.style.maxHeight = '240px';
    list.style.overflowY = 'auto';
    for (const location of locations) {
      const item = this.document.createElement('li');
      item.className = 'list-group-item';
      const title = this.document.createElement('strong');
      title.className = 'd-block';
      title.textContent = location.location_path;
      const detail = this.document.createElement('small');
      detail.className = 'd-block text-body-secondary';
      detail.textContent = [location.branch_name, location.warehouse_name, `${location.quantity} unidades contadas`].filter(Boolean).join(' · ');
      item.append(title, detail);
      list.append(item);
    }
    content.append(list);
    const explanation = this.document.createElement('p');
    explanation.className = 'small mb-0';
    explanation.textContent = destinations.length
      ? 'Puedes mantener las unidades aquí o abrir automáticamente la captura en una ubicación anterior de este almacén. Los conteos anteriores se conservan.'
      : 'Puedes mantener estas unidades aquí. Para contarlas en otra ubicación, esta debe estar disponible dentro del almacén de la sesión.';
    content.append(explanation);
    this.dialogContent = content;
    try {
      const choice = await Swal.fire({
        title: 'Producto contado en otra ubicación',
        html: content,
        icon: 'warning',
        width: 680,
        showDenyButton: destinations.length > 0,
        showCancelButton: true,
        confirmButtonText: 'Mantener aquí',
        denyButtonText: 'Mover a ubicación anterior',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#212631',
        denyButtonColor: '#31558e',
        focusCancel: true,
        returnFocus: false,
        allowOutsideClick: false,
      });
      if (!this.currentSearch(revision, locationId)) return false;
      if (choice.isConfirmed) return true;
      if (!choice.isDenied || !destinations.length) return false;
      let destination = destinations[0];
      if (destinations.length > 1) {
        const target = await Swal.fire<string>({
          title: '¿A qué ubicación lo llevarás?',
          html: content,
          input: 'select',
          inputOptions: Object.fromEntries(destinations.map(location => [String(location.location_id), `${location.location_path} · ${location.warehouse_name || 'Almacén'} · ${location.quantity} unidades`])),
          inputValue: String(destination.location_id),
          showCancelButton: true,
          confirmButtonText: 'Elegir ubicación',
          cancelButtonText: 'Cancelar',
          returnFocus: false,
          allowOutsideClick: false,
        });
        if (!this.currentSearch(revision, locationId) || !target.isConfirmed) return false;
        const selected = destinations.find(location => String(location.location_id) === String(target.value));
        if (!selected) return false;
        destination = selected;
      }
      this.moveRequested.emit({
        source_location_id: locationId,
        location_id: destination.location_id,
        variant,
        counted_quantity: countedQuantity,
      });
      return false;
    } finally {
      if (this.dialogContent === content) this.dialogContent = null;
    }
  }

  private currentSearch(revision: number, locationId: number): boolean {
    return !this.destroyed && revision === this.searchRevision && locationId === this.locationId;
  }

  private closeLocationDialog(): void {
    if (this.dialogContent && Swal.getHtmlContainer()?.contains(this.dialogContent)) Swal.close();
    this.dialogContent = null;
  }

  refreshCountedQuantity(variantId: number): void {
    if (this.variants[0]?.id !== variantId || !this.locationId) return;
    const locationId = this.locationId;
    this._count.list(this.inventoryId, this.sessionId, 1, variantId, locationId)
      .pipe(takeUntil(this.destroy$), takeUntil(this.cancelSearch$))
      .subscribe({
        next: response => {
          if (this.variants[0]?.id === variantId && this.locationId === locationId) {
            this.countedQuantity = response.variant_counted_quantity ?? 0;
          }
        },
        error: () => this.error = 'No se pudo actualizar el total contado. Vuelve a escanear el producto.',
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
  ngOnDestroy(): void {
    this.destroyed = true;
    this.searchRevision++;
    this.closeLocationDialog();
    this.destroy$.next();
    this.destroy$.complete();
    this.cancelSearch$.next();
    this.cancelSearch$.complete();
  }
}

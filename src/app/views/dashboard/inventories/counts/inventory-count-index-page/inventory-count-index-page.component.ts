import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, of, Subject, takeUntil } from 'rxjs';
import { Inventory } from 'src/app/interfaces/inventory.interface';
import { InventorySession } from 'src/app/interfaces/inventory-session.interface';
import { InventoryCount, InventoryCountMove, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryWorkspaceService } from '../../inventory-workspace.service';
import { InventoryCountEntryComponent } from '../inventory-count-entry/inventory-count-entry.component';
import { InventoryService } from '../../inventory.service';
import { InventorySessionService } from '../../sessions/inventory-session.service';
import { InventorySectionHeaderComponent } from '../../inventory-section-header/inventory-section-header.component';
import { InventoryCountService } from '../inventory-count.service';
import { InventoryCountIndexComponent } from '../inventory-count-index/inventory-count-index.component';
import { branchError } from '../../../branches/branch-api.model';
import { InventoryRackComponent } from '../inventory-rack/inventory-rack.component';
import Swal from 'sweetalert2';
import { BaseService } from '../../../../base.service';

@Component({ selector: 'app-inventory-count-index-page', imports: [RouterLink, InventorySectionHeaderComponent, InventoryCountIndexComponent, InventoryCountEntryComponent, InventoryRackComponent], templateUrl: './inventory-count-index-page.component.html', styleUrl: './inventory-count-index-page.component.scss' })
export class InventoryCountIndexPageComponent implements OnInit, OnDestroy {
  options: InventoryWorkspaceOptions | null = null;
  selectedLocationId: number | null = null;
  selectedLocationPath: number[] = [];
  locationLocked = false;
  movedProduct: InventoryCountMove | null = null;
  savingCount = false;
  deletingCountId: number | null = null;
  confirmingDelete = false;
  deleteError = '';
  deleteSuccess = '';
  @ViewChild(InventoryCountEntryComponent) private countEntry?: InventoryCountEntryComponent;
  @ViewChild(InventoryRackComponent) private rack?: InventoryRackComponent;
  private destroyed = false;
  
  inventory: Inventory | null = null;
  session: InventorySession | null = null;
  records: InventoryCount[] = [];
  viewMode: 'rack' | 'history' = 'rack';
  page = 1;
  lastPage = 1;
  total = 0;
  barcode = '';
  variantId: number | undefined;
  searchInvalid = false;
  loading = false;
  error = '';
  readonly inventoryId: number;
  readonly sessionId: number;
  
  private readonly destroy$ = new Subject<void>();
  private readonly cancelLoad$ = new Subject<void>();
  constructor(
    private _inventory: InventoryService,
    private _resource: InventoryCountService,
    private _session: InventorySessionService,
    private _workspace: InventoryWorkspaceService,
    private router: Router,
    private route: ActivatedRoute,
    private base: BaseService,
  ) {
    this.inventoryId = Number(this.route.snapshot.paramMap.get('inventory_id'));
    this.sessionId = Number(this.route.snapshot.paramMap.get('session_id'));
    
  }
  ngOnInit(): void { this.load(); }
  search(event: Event): void {
    event.preventDefault();
    if (this.loading) return;
    const code = this.barcode.trim();
    this.searchInvalid = !!code && (!/^\d+$/.test(code) || !Number.isSafeInteger(Number(code)) || Number(code) < 1);
    if (this.searchInvalid) return;
    this.variantId = code ? Number(code) : undefined;
    this.load(1);
  }
  clearSearch(): void {
    if (this.loading) return;
    this.barcode = '';
    this.variantId = undefined;
    this.searchInvalid = false;
    this.load(1);
  }
  get editable(): boolean { return !!this.inventory && ['draft','in_progress'].includes(this.inventory.status) && this.session?.status === 'open' && !this.options?.recording_locked && !!this.session?.warehouse_id; }
  get deleteInProgress(): boolean { return this.confirmingDelete || this.deletingCountId !== null; }
  get canDeleteCounts(): boolean { return this.editable && !this.savingCount && !this.loading && !this.countEntry?.searching; }
  get locations() { return this.options?.locations.filter(item => item.warehouse_id === this.session?.warehouse_id) ?? []; }
  get selectedLocation() { return this.locations.find(item => item.id === this.selectedLocationId) ?? null; }
  get locationNodes() {
    const nodes = this.options?.location_tree ?? this.locations.flatMap(location => location.parent ? [
      { ...location.parent, warehouse_id: location.warehouse_id, parent_id: location.parent.parent_id ?? null }, location,
    ] : [location]);
    return [...new Map(nodes.filter(node => node.warehouse_id === this.session?.warehouse_id).map(node => [node.id, node])).values()];
  }
  get selectedLocationLabel(): string {
    return this.selectedLocationPath.map(id => this.locationNodes.find(node => node.id === id)?.name).filter(Boolean).join(' / ') || this.selectedLocation?.name || '';
  }
  get warehouseLocationsPath(): (string | number)[] | null {
    const warehouseId = this.session?.warehouse_id;
    const branchId = this.session?.warehouse?.branch_id
      ?? this.session?.warehouse?.branch?.id
      ?? this.options?.warehouses?.find(warehouse => warehouse.id === warehouseId)?.branch_id;
    if (!this.base.store || !warehouseId || !branchId) return null;
    return ['/', this.base.store, 'dashboard', 'branches', branchId, 'warehouses', warehouseId, 'locations'];
  }
  get warehousePath(): string { return [this.session?.warehouse?.branch?.name, this.session?.warehouse?.name].filter(Boolean).join(' / ') || 'Almacén #' + this.session?.warehouse_id; }
  finishCount(): void {
    if (this.savingCount || this.deleteInProgress) return;
    this.locationLocked = false;
    this.selectedLocationId = null;
    this.selectedLocationPath = [];
    this.movedProduct = null;
  }

  startRackCapture(locationId: number): void {
    if (!this.editable || this.loading || this.savingCount || this.locationLocked || this.deleteInProgress) return;
    const location = this.locations.find(location => location.id === locationId);
    if (!location) return;
    this.movedProduct = null;
    const nodes = this.locationNodes;
    const path: number[] = [];
    let node = nodes.find(node => node.id === locationId);
    while (node && !path.includes(node.id)) {
      path.unshift(node.id);
      node = nodes.find(parent => parent.id === node!.parent_id);
    }
    this.selectedLocationPath = path;
    this.selectedLocationId = locationId;
    this.locationLocked = true;
  }

  moveCapture(move: InventoryCountMove): void {
    if (!this.editable || this.loading || this.savingCount || this.deleteInProgress || !this.locationLocked || move.source_location_id !== this.selectedLocationId) return;
    if (!this.locations.some(location => location.id === move.location_id) || move.location_id === move.source_location_id) return;
    this.locationLocked = false;
    this.startRackCapture(move.location_id);
    if (this.selectedLocationId === move.location_id) this.movedProduct = move;
  }

  onCountSaved(record: InventoryCount): void {
    this.barcode = '';
    this.variantId = undefined;
    this.searchInvalid = false;
    if (this.viewMode === 'rack') {
      this.rack?.refreshLocation(record.location_id);
      return;
    }
    this.cancelLoad$.next();
    this.load(1);
  }

  setViewMode(mode: 'rack' | 'history'): void {
    if (this.loading || this.deleteInProgress || this.locationLocked || mode === this.viewMode) return;
    this.viewMode = mode;
    this.load(1);
  }

  async deleteCapture(record: InventoryCount): Promise<void> {
    if (!this.canDeleteCounts || this.deleteInProgress || record.status !== 'valid' || record.user_id !== this.options?.current_user_id) return;
    this.deleteError = '';
    this.deleteSuccess = '';
    this.confirmingDelete = true;
    let confirmed = false;
    try {
      const result = await Swal.fire({
        title: `¿Eliminar captura #${record.id}?`,
        text: `Se eliminará definitivamente la captura de ${record.quantity} unidades de ${record.variant?.product?.name || 'esta variante'}. Se actualizará el total contado de esta ubicación.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar captura',
        cancelButtonText: 'Conservar captura',
        confirmButtonColor: '#c0392b',
        focusCancel: true,
      });
      confirmed = result.isConfirmed;
    } finally {
      this.confirmingDelete = false;
    }
    if (!confirmed || this.destroyed || !this.canDeleteCounts) return;
    this.deletingCountId = record.id;
    this._resource.deleteCapture(this.inventoryId, this.sessionId, record.id)
      .pipe(takeUntil(this.destroy$), finalize(() => this.deletingCountId = null))
      .subscribe({
        next: () => {
          this.deleteSuccess = `Captura #${record.id} eliminada correctamente.`;
          const page = this.viewMode === 'history' && this.records.length === 1 && this.page > 1 ? this.page - 1 : this.page;
          this.records = this.records.filter(item => item.id !== record.id);
          this.deletingCountId = null;
          if (this.viewMode === 'rack') {
            this.rack?.refreshLocation(record.location_id, record.id);
          } else {
            this.load(page);
          }
          this.countEntry?.refreshCountedQuantity(record.variant_id);
        },
        error: error => this.deleteError = branchError(error, 'No se pudo eliminar la captura. Intenta nuevamente.'),
      });
  }

  editCount(id: number): void {
    this.router.navigate(['./', id, 'edit'], { relativeTo: this.route });
  }

  load(page = this.page): void {
    if (this.loading) return;
    if (!Number.isSafeInteger(this.inventoryId) || this.inventoryId < 1 || !Number.isSafeInteger(this.sessionId) || this.sessionId < 1) { this.error = 'El registro solicitado no es válido.'; return; }
    this.loading = true; this.error = '';
    forkJoin({ inventory: this._inventory.details(this.inventoryId), session: this._session.show(this.inventoryId, this.sessionId),
      list: this.viewMode === 'history'
        ? this._resource.list(this.inventoryId, this.sessionId, page, this.variantId, this.locationLocked ? this.selectedLocationId ?? undefined : undefined)
        : of(null),
      options: this._workspace.options(this.inventoryId),
      
    }).pipe(takeUntil(this.destroy$), takeUntil(this.cancelLoad$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        this.inventory = response.inventory.data;
        this.session = response.session.data;
        this.options = response.options.data;
        if (response.list) {
          this.records = response.list.data;
          this.page = response.list.current_page ?? page;
          this.lastPage = response.list.last_page ?? 1;
          this.total = response.list.total ?? response.list.data.length;
        }
        
        
      },
      error: error => this.error = branchError(error, 'No se pudieron cargar los datos de esta sección.'),
    });
  }
  
  
  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.confirmingDelete) Swal.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.cancelLoad$.complete();
  }
}

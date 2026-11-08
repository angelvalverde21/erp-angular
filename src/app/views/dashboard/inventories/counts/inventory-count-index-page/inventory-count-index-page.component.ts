import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, of, Subject, takeUntil } from 'rxjs';
import { Inventory } from 'src/app/interfaces/inventory.interface';
import { InventorySession } from 'src/app/interfaces/inventory-session.interface';
import { InventoryCount, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryWorkspaceService } from '../../inventory-workspace.service';
import { InventoryCountEntryComponent } from '../inventory-count-entry/inventory-count-entry.component';
import { InventoryService } from '../../inventory.service';
import { InventorySessionService } from '../../sessions/inventory-session.service';
import { InventorySectionHeaderComponent } from '../../inventory-section-header/inventory-section-header.component';
import { InventoryCountService } from '../inventory-count.service';
import { InventoryCountIndexComponent } from '../inventory-count-index/inventory-count-index.component';
import { branchError } from '../../../branches/branch-api.model';
import { InventoryRackComponent } from '../inventory-rack/inventory-rack.component';

@Component({ selector: 'app-inventory-count-index-page', imports: [RouterLink, InventorySectionHeaderComponent, InventoryCountIndexComponent, InventoryCountEntryComponent, InventoryRackComponent], templateUrl: './inventory-count-index-page.component.html', styleUrl: './inventory-count-index-page.component.scss' })
export class InventoryCountIndexPageComponent implements OnInit, OnDestroy {
  options: InventoryWorkspaceOptions | null = null;
  selectedLocationId: number | null = null;
  selectedLocationPath: number[] = [];
  locationLocked = false;
  locationTouched = false;
  savingCount = false;
  
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
  get locations() { return this.options?.locations.filter(item => item.warehouse_id === this.session?.warehouse_id) ?? []; }
  get selectedLocation() { return this.locations.find(item => item.id === this.selectedLocationId) ?? null; }
  get locationNodes() {
    const nodes = this.options?.location_tree ?? this.locations.flatMap(location => location.parent ? [
      { ...location.parent, warehouse_id: location.warehouse_id, parent_id: location.parent.parent_id ?? null }, location,
    ] : [location]);
    return [...new Map(nodes.filter(node => node.warehouse_id === this.session?.warehouse_id).map(node => [node.id, node])).values()];
  }
  get locationLevels() {
    const nodes = this.locationNodes;
    const ids = new Set(nodes.map(node => node.id));
    const levels = [];
    let choices = nodes.filter(node => node.parent_id === null || !ids.has(node.parent_id));
    for (let depth = 0; choices.length && depth <= nodes.length; depth++) {
      const selectedId = this.selectedLocationPath[depth] ?? null;
      levels.push({ choices, selectedId });
      if (selectedId === null) break;
      choices = nodes.filter(node => node.parent_id === selectedId);
    }
    return levels;
  }
  get selectedLocationLabel(): string {
    return this.selectedLocationPath.map(id => this.locationNodes.find(node => node.id === id)?.name).filter(Boolean).join(' / ') || this.selectedLocation?.name || '';
  }
  get warehousePath(): string { return [this.session?.warehouse?.branch?.name, this.session?.warehouse?.name].filter(Boolean).join(' / ') || 'Almacén #' + this.session?.warehouse_id; }
  chooseLocation(value: string, depth = 0): void {
    if (this.locationLocked || this.savingCount || this.loading || !this.editable) return;
    const id = value ? Number(value) : null;
    const allowed = this.locationLevels[depth]?.choices.some(node => node.id === id);
    this.selectedLocationPath = this.selectedLocationPath.slice(0, depth);
    if (id !== null && allowed) this.selectedLocationPath.push(id);
    this.selectedLocationId = allowed && this.locations.some(location => location.id === id) ? id : null;
    this.locationTouched = !!value;
    if (!this.selectedLocation) return;
    this.locationLocked = true;
    this.load(1);
  }
  finishCount(): void {
    if (this.savingCount) return;
    this.locationLocked = false;
    this.selectedLocationId = null;
    this.selectedLocationPath = [];
    this.locationTouched = false;
    this.cancelLoad$.next();
    this.load(1);
  }

  onCountSaved(): void {
    this.cancelLoad$.next();
    this.barcode = '';
    this.variantId = undefined;
    this.searchInvalid = false;
    this.load(1);
  }

  setViewMode(mode: 'rack' | 'history'): void {
    if (this.loading || mode === this.viewMode) return;
    this.viewMode = mode;
    this.load(1);
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
        ? this._resource.list(this.inventoryId, this.sessionId, page, this.variantId, this.locationLocked ? this.selectedLocationId ?? undefined : undefined, true)
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
  
  
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); this.cancelLoad$.complete(); }
}

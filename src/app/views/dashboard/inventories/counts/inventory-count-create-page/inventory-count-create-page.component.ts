import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Inventory } from 'src/app/interfaces/inventory.interface';
import { InventorySession } from 'src/app/interfaces/inventory-session.interface';
import { InventoryCount, InventoryCountPayload, InventoryVariant, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { VariantService } from '../../../products/variants/variant.service';
import { InventoryService } from '../../inventory.service';
import { InventorySessionService } from '../../sessions/inventory-session.service';
import { InventoryWorkspaceService } from '../../inventory-workspace.service';
import { InventorySectionHeaderComponent } from '../../inventory-section-header/inventory-section-header.component';
import { InventoryCountService } from '../inventory-count.service';
import { InventoryCountCreateComponent } from '../inventory-count-create/inventory-count-create.component';
import { branchError, markBranchFieldErrors } from '../../../branches/branch-api.model';

@Component({ selector: 'app-inventory-count-create-page', imports: [RouterLink, InventorySectionHeaderComponent, InventoryCountCreateComponent], templateUrl: './inventory-count-create-page.component.html', styleUrl: './inventory-count-create-page.component.scss' })
export class InventoryCountCreatePageComponent implements OnInit, OnDestroy {
  @ViewChild(InventoryCountCreateComponent) private editor?: InventoryCountCreateComponent;
  inventory: Inventory | null = null;
  session: InventorySession | null = null;
  record: InventoryCount | null = null;
  historyRecords: InventoryCount[] = [];
  historyLoading = false;
  historyError = '';
  historyTotal = 0;
  historyPage = 1;
  historyLastPage = 1;
  private readonly cancelHistory$ = new Subject<void>();
  options: InventoryWorkspaceOptions | null = null;
  variants: InventoryVariant[] = [];
  countedQuantity = 0;
  searching = false;
  searchError = '';
  saving = false;
  private readonly cancelSearch$ = new Subject<void>();
  loading = false;
  error = '';
  readonly inventoryId: number;
  readonly sessionId: number;
  
  private readonly destroy$ = new Subject<void>();
  constructor(
    private _inventory: InventoryService,
    private _resource: InventoryCountService,
    private _session: InventorySessionService,
    private _workspace: InventoryWorkspaceService,
    private _variant: VariantService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.inventoryId = Number(this.route.snapshot.paramMap.get('inventory_id'));
    this.sessionId = Number(this.route.snapshot.paramMap.get('session_id'));
    
  }
  ngOnInit(): void { this.load(); }
  get editable(): boolean { return !!this.inventory && ['draft','in_progress'].includes(this.inventory.status) && this.session?.status === 'open' && !this.options?.recording_locked ; }
  load(): void {
    if (this.loading) return;
    if (!Number.isSafeInteger(this.inventoryId) || this.inventoryId < 1 || !Number.isSafeInteger(this.sessionId) || this.sessionId < 1) { this.error = 'El registro solicitado no es válido.'; return; }
    this.loading = true; this.error = '';
    forkJoin({ inventory: this._inventory.details(this.inventoryId), session: this._session.show(this.inventoryId, this.sessionId),
      
      options: this._workspace.options(this.inventoryId),
    }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        this.inventory = response.inventory.data;
        this.session = response.session.data;
        
        this.options = response.options.data;
        this.loadHistory();
        
      },
      error: error => this.error = branchError(error, 'No se pudieron cargar los datos de esta sección.'),
    });
  }
  
  searchVariants(term: string): void {
    this.cancelSearch$.next(); this.searching = true; this.searchError = ''; this.variants = [];
    this._variant.get(term.trim()).pipe(
      switchMap(response => {
        const variant = response && 'data' in response ? response.data : response;
        const locationId = this.editor?.form.controls.location_id.value;
        if (!variant?.id || !locationId) return of({ variant, total: 0 });
        return this._resource.list(this.inventoryId, this.sessionId, 1, variant.id, locationId).pipe(
          map(response => ({ variant, total: response.variant_counted_quantity ?? 0 })),
        );
      }),
      takeUntil(this.destroy$), takeUntil(this.cancelSearch$), finalize(() => this.searching = false),
    ).subscribe({
      next: result => {
        this.countedQuantity = result.total;
        this.variants = result.variant?.id != null ? [result.variant] : [];
      },
      error: error => {
        if (error.status !== 404) this.searchError = branchError(error, 'No se pudo consultar la variante.');
      },
    });
  }
  save(payload: InventoryCountPayload): void {
    if (this.saving || !this.editable) return;
    this.saving = true; this.error = '';
    this._resource.create(this.inventoryId, this.sessionId, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: response => {
        this.record = response.data;
        this.editor?.completeRegistration(response.data);
        this.loadHistory(1);
      },
      error: error => {
        markBranchFieldErrors(this.editor?.form, error);
        this.error = branchError(error, 'No se pudieron guardar los cambios.');
      },
    });
  }
  
  loadHistory(page = this.historyPage): void {
    this.cancelHistory$.next();
    this.historyLoading = true;
    this.historyError = '';
    this._resource.list(this.inventoryId, this.sessionId, page).pipe(
      takeUntil(this.destroy$),
      takeUntil(this.cancelHistory$),
      finalize(() => this.historyLoading = false),
    ).subscribe({
      next: response => {
        this.historyRecords = response.data;
        this.historyPage = response.current_page ?? page;
        this.historyLastPage = response.last_page ?? 1;
        this.historyTotal = response.total ?? response.data.length;
      },
      error: error => this.historyError = branchError(error, 'No se pudo cargar el historial de conteos.'),
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); this.cancelSearch$.next(); this.cancelSearch$.complete(); this.cancelHistory$.next(); this.cancelHistory$.complete(); }
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { Inventory } from 'src/app/interfaces/inventory.interface';
import { InventorySession } from 'src/app/interfaces/inventory-session.interface';
import { InventoryCount, InventoryCountPayload, InventoryVariant, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { VariantService } from '../../../products/variants/variant.service';
import { InventoryService } from '../../inventory.service';
import { InventorySessionService } from '../../sessions/inventory-session.service';
import { InventoryWorkspaceService } from '../../inventory-workspace.service';
import { InventorySectionHeaderComponent } from '../../inventory-section-header/inventory-section-header.component';
import { InventoryCountService } from '../inventory-count.service';
import { InventoryCountEditComponent } from '../inventory-count-edit/inventory-count-edit.component';
import { branchError, markBranchFieldErrors } from '../../../branches/branch-api.model';

@Component({ selector: 'app-inventory-count-edit-page', imports: [RouterLink, InventorySectionHeaderComponent, InventoryCountEditComponent], templateUrl: './inventory-count-edit-page.component.html', styleUrl: './inventory-count-edit-page.component.scss' })
export class InventoryCountEditPageComponent implements OnInit, OnDestroy {
  @ViewChild(InventoryCountEditComponent) private editor?: InventoryCountEditComponent;
  inventory: Inventory | null = null;
  session: InventorySession | null = null;
  record: InventoryCount | null = null;
  options: InventoryWorkspaceOptions | null = null;
  variants: InventoryVariant[] = [];
  searching = false;
  searchError = '';
  saving = false;
  private readonly cancelSearch$ = new Subject<void>();
  loading = false;
  error = '';
  readonly inventoryId: number;
  readonly sessionId: number;
  readonly recordId: number;
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
    this.recordId = Number(this.route.snapshot.paramMap.get('count_id'));
  }
  ngOnInit(): void { this.load(); }
  get editable(): boolean { return !!this.inventory && ['draft','in_progress'].includes(this.inventory.status) && this.session?.status === 'open' && !this.options?.recording_locked && (!this.record || (this.record.status === 'valid' && this.record.user_id === this.options?.current_user_id)); }
  load(): void {
    if (this.loading) return;
    if (!Number.isSafeInteger(this.inventoryId) || this.inventoryId < 1 || !Number.isSafeInteger(this.sessionId) || this.sessionId < 1 || !Number.isSafeInteger(this.recordId) || this.recordId < 1) { this.error = 'El registro solicitado no es válido.'; return; }
    this.loading = true; this.error = '';
    forkJoin({ inventory: this._inventory.details(this.inventoryId), session: this._session.show(this.inventoryId, this.sessionId),
      record: this._resource.show(this.inventoryId, this.sessionId, this.recordId),
      options: this._workspace.options(this.inventoryId),
    }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        this.inventory = response.inventory.data;
        this.session = response.session.data;
        
        this.options = response.options.data;
        this.record = response.record.data;
      },
      error: error => this.error = branchError(error, 'No se pudieron cargar los datos de esta sección.'),
    });
  }
  
  searchVariants(term: string): void {
    this.cancelSearch$.next(); this.searching = true; this.searchError = ''; this.variants = [];
    this._variant.get(term.trim()).pipe(takeUntil(this.destroy$), takeUntil(this.cancelSearch$), finalize(() => this.searching = false)).subscribe({
      next: response => {
        const variant = response && 'data' in response ? response.data : response;
        this.variants = variant?.id != null ? [variant] : [];
      },
      error: error => {
        if (error.status !== 404) this.searchError = branchError(error, 'No se pudo consultar la variante.');
      },
    });
  }
  save(payload: InventoryCountPayload): void {
    if (this.saving || !this.editable) return;
    this.saving = true; this.error = '';
    this._resource.saveChanges(this.inventoryId, this.sessionId, this.recordId, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => this.router.navigate(['../../'], { relativeTo: this.route }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudieron guardar los cambios.'); },
    });
  }
  
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); this.cancelSearch$.next(); this.cancelSearch$.complete(); }
}

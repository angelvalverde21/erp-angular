import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { Inventory } from 'src/app/interfaces/inventory.interface';
import { InventorySession } from 'src/app/interfaces/inventory-session.interface';
import { InventoryLocationProgress, LocationProgressPayload, InventoryVariant, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryService } from '../../inventory.service';
import { InventorySessionService } from '../../sessions/inventory-session.service';
import { InventoryWorkspaceService } from '../../inventory-workspace.service';
import { InventorySectionHeaderComponent } from '../../inventory-section-header/inventory-section-header.component';
import { InventoryLocationProgressService } from '../inventory-location-progress.service';
import { InventoryLocationProgressEditComponent } from '../inventory-location-progress-edit/inventory-location-progress-edit.component';
import { branchError, markBranchFieldErrors } from '../../../branches/branch-api.model';

@Component({ selector: 'app-inventory-location-progress-edit-page', imports: [RouterLink, InventorySectionHeaderComponent, InventoryLocationProgressEditComponent], templateUrl: './inventory-location-progress-edit-page.component.html', styleUrl: './inventory-location-progress-edit-page.component.scss' })
export class InventoryLocationProgressEditPageComponent implements OnInit, OnDestroy {
  @ViewChild(InventoryLocationProgressEditComponent) private editor?: InventoryLocationProgressEditComponent;
  inventory: Inventory | null = null;
  session: InventorySession | null = null;
  record: InventoryLocationProgress | null = null;
  options: InventoryWorkspaceOptions | null = null;
  variants: InventoryVariant[] = [];
  searching = false;
  searchError = '';
  saving = false;
  private readonly cancelSearch$ = new Subject<void>();
  loading = false;
  error = '';
  readonly inventoryId: number;
  
  readonly recordId: number;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private _inventory: InventoryService,
    private _resource: InventoryLocationProgressService,
    
    private _workspace: InventoryWorkspaceService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.inventoryId = Number(this.route.snapshot.paramMap.get('inventory_id'));
    
    this.recordId = Number(this.route.snapshot.paramMap.get('progress_id'));
  }
  ngOnInit(): void { this.load(); }
  get editable(): boolean { return !!this.inventory && ['draft','in_progress'].includes(this.inventory.status) && !this.options?.recording_locked; }
  load(): void {
    if (this.loading) return;
    if (!Number.isSafeInteger(this.inventoryId) || this.inventoryId < 1 || !Number.isSafeInteger(this.recordId) || this.recordId < 1) { this.error = 'El registro solicitado no es válido.'; return; }
    this.loading = true; this.error = '';
    forkJoin({ inventory: this._inventory.details(this.inventoryId), 
      record: this._resource.show(this.inventoryId, this.recordId),
      options: this._workspace.options(this.inventoryId),
    }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        this.inventory = response.inventory.data;
        
        
        this.options = response.options.data;
        this.record = response.record.data;
      },
      error: error => this.error = branchError(error, 'No se pudieron cargar los datos de esta sección.'),
    });
  }
  
  searchVariants(term: string): void {
    this.cancelSearch$.next(); this.searching = true; this.searchError = ''; this.variants = [];
    this._workspace.variants(this.inventoryId, term).pipe(takeUntil(this.destroy$), takeUntil(this.cancelSearch$), finalize(() => this.searching = false)).subscribe({
      next: response => this.variants = response.data,
      error: error => this.searchError = branchError(error, 'No se pudieron buscar las variantes.'),
    });
  }
  save(payload: LocationProgressPayload): void {
    if (this.saving || !this.editable) return;
    this.saving = true; this.error = '';
    this._resource.saveChanges(this.inventoryId, this.recordId, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => this.router.navigate(['../../'], { relativeTo: this.route }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudieron guardar los cambios.'); },
    });
  }
  
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); this.cancelSearch$.next(); this.cancelSearch$.complete(); }
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { Inventory } from 'src/app/interfaces/inventory.interface';
import { InventorySession } from 'src/app/interfaces/inventory-session.interface';
import { InventoryAdjustment, InventoryAdjustmentPayload, InventoryVariant, InventoryWorkspaceOptions, InventoryAdjustmentAction } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryService } from '../../inventory.service';
import { InventorySessionService } from '../../sessions/inventory-session.service';
import { InventoryWorkspaceService } from '../../inventory-workspace.service';
import { InventorySectionHeaderComponent } from '../../inventory-section-header/inventory-section-header.component';
import { InventoryAdjustmentService } from '../inventory-adjustment.service';
import { InventoryAdjustmentEditComponent } from '../inventory-adjustment-edit/inventory-adjustment-edit.component';
import { branchError, markBranchFieldErrors } from '../../../branches/branch-api.model';
import Swal from 'sweetalert2';
@Component({ selector: 'app-inventory-adjustment-edit-page', imports: [RouterLink, InventorySectionHeaderComponent, InventoryAdjustmentEditComponent], templateUrl: './inventory-adjustment-edit-page.component.html', styleUrl: './inventory-adjustment-edit-page.component.scss' })
export class InventoryAdjustmentEditPageComponent implements OnInit, OnDestroy {
  @ViewChild(InventoryAdjustmentEditComponent) private editor?: InventoryAdjustmentEditComponent;
  inventory: Inventory | null = null;
  session: InventorySession | null = null;
  record: InventoryAdjustment | null = null;
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
    private _resource: InventoryAdjustmentService,
    
    private _workspace: InventoryWorkspaceService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.inventoryId = Number(this.route.snapshot.paramMap.get('inventory_id'));
    
    this.recordId = Number(this.route.snapshot.paramMap.get('adjustment_id'));
  }
  ngOnInit(): void { this.load(); }
  get editable(): boolean { return !!this.inventory && ['draft','in_progress'].includes(this.inventory.status) && this.inventory.inventoriable_id === null; }
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
  save(payload: InventoryAdjustmentPayload): void {
    if (this.saving || !this.editable) return;
    this.saving = true; this.error = '';
    this._resource.saveChanges(this.inventoryId, this.recordId, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => this.router.navigate(['../../'], { relativeTo: this.route }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudieron guardar los cambios.'); },
    });
  }
  
  async transition(action: InventoryAdjustmentAction): Promise<void> {
    if (this.saving || !this.record || !this.editable) return;
    const labels = { approve: 'Aprobar ajuste', reject: 'Rechazar ajuste', apply: 'Aplicar ajuste' };
    const result = await Swal.fire({ title: labels[action], text: action === 'apply' ? 'El stock pasará de ' + this.record.system_quantity + ' a ' + this.record.counted_quantity + ' unidades. Si existe diferencia se generará un movimiento en kardex.' : action === 'approve' ? 'Confirma que revisaste los conteos y la diferencia detectada.' : 'El ajuste quedará rechazado.', icon: 'question', showCancelButton: true, confirmButtonText: labels[action], cancelButtonText: 'Cancelar' });
    if (!result.isConfirmed) return;
    this.saving = true; this.error = '';
    this._resource.transition(this.inventoryId, this.recordId, action).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({ next: response => this.record = response.data, error: error => this.error = branchError(error, 'No se pudo completar la acción.') });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); this.cancelSearch$.next(); this.cancelSearch$.complete(); }
}

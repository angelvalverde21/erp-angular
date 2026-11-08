import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, forkJoin, of, takeUntil } from 'rxjs';
import { Inventory, InventoryOptions, InventoryPayload } from 'src/app/interfaces/inventory.interface';
import { InventoryService } from '../../inventory.service';
import { InventorySectionHeaderComponent } from '../../inventory-section-header/inventory-section-header.component';
import { InventorySessionCreateComponent } from '../inventory-session-create/inventory-session-create.component';
import { branchError, markBranchFieldErrors } from '../../../branches/branch-api.model';
import { InventorySession, InventorySessionPayload } from 'src/app/interfaces/inventory-session.interface';
import { InventoryWorkspaceService } from '../../inventory-workspace.service';
import { InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { InventorySessionService } from '../inventory-session.service';
@Component({ selector: 'app-inventory-session-create-page', imports: [RouterLink, InventorySectionHeaderComponent, InventorySessionCreateComponent], templateUrl: './inventory-session-create-page.component.html', styleUrl: './inventory-session-create-page.component.scss' })
export class InventorySessionCreatePageComponent implements OnInit, OnDestroy {
  @ViewChild(InventorySessionCreateComponent) private editor?: InventorySessionCreateComponent;
  options: InventoryOptions | null = null;
  workspaceOptions: InventoryWorkspaceOptions | null = null;
  inventory: Inventory | null = null;
  session: InventorySession | null = null;
  loading = true;
  saving = false;
  error = '';
  readonly inventoryId: number;
  
  private readonly destroy$ = new Subject<void>();
  constructor(
    private _inventory: InventoryService,
    private _session: InventorySessionService,
    private _workspace: InventoryWorkspaceService,
    private router: Router,
    private route: ActivatedRoute,
  ) { this.inventoryId = Number(this.route.snapshot.paramMap.get('inventory_id'));  }
  ngOnInit(): void { this.load(); }
  load(): void {
    if (!Number.isSafeInteger(this.inventoryId) || this.inventoryId < 1) { this.error = 'El registro solicitado no es válido.'; this.loading = false; return; }
    this.loading = true;
    this.error = '';
    forkJoin({ workspace: this._workspace.options(this.inventoryId), options: this._inventory.options(), inventory: this._inventory.details(this.inventoryId),  }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => { this.workspaceOptions = response.workspace.data; this.options = response.options.data; this.inventory = response.inventory?.data ?? null;  if (this.inventory && ['completed','cancelled'].includes(this.inventory.status)) this.error = 'El inventario está finalizado o cancelado; no permite abrir nuevas sesiones.'; },
      error: error => this.error = branchError(error, 'No se pudo cargar la información.'),
    });
  }
  
  save(payload: InventorySessionPayload): void {
    if (this.saving) return;
    this.saving = true;
    this.error = '';
    this._session.create(this.inventoryId, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => this.router.navigate(['../'], { relativeTo: this.route }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudieron guardar los cambios.'); },
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, forkJoin, of, takeUntil } from 'rxjs';
import { Inventory, InventoryOptions, InventoryPayload } from 'src/app/interfaces/inventory.interface';
import { InventoryService } from '../../inventory.service';
import { InventorySectionHeaderComponent } from '../../inventory-section-header/inventory-section-header.component';
import { InventorySessionEditComponent } from '../inventory-session-edit/inventory-session-edit.component';
import { branchError, markBranchFieldErrors } from '../../../branches/branch-api.model';
import { InventorySession, InventorySessionPayload } from 'src/app/interfaces/inventory-session.interface';
import { InventorySessionService } from '../inventory-session.service';
@Component({ selector: 'app-inventory-session-edit-page', imports: [RouterLink, InventorySectionHeaderComponent, InventorySessionEditComponent], templateUrl: './inventory-session-edit-page.component.html', styleUrl: './inventory-session-edit-page.component.scss' })
export class InventorySessionEditPageComponent implements OnInit, OnDestroy {
  @ViewChild(InventorySessionEditComponent) private editor?: InventorySessionEditComponent;
  options: InventoryOptions | null = null;
  inventory: Inventory | null = null;
  session: InventorySession | null = null;
  loading = true;
  saving = false;
  error = '';
  readonly inventoryId: number;
  readonly sessionId: number;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private _inventory: InventoryService,
    private _session: InventorySessionService,
    private router: Router,
    private route: ActivatedRoute,
  ) { this.inventoryId = Number(this.route.snapshot.paramMap.get('inventory_id')); this.sessionId = Number(this.route.snapshot.paramMap.get('session_id')); }
  ngOnInit(): void { this.load(); }
  load(): void {
    if (!Number.isSafeInteger(this.inventoryId) || this.inventoryId < 1 || !Number.isSafeInteger(this.sessionId) || this.sessionId < 1) { this.error = 'El registro solicitado no es válido.'; this.loading = false; return; }
    this.loading = true;
    this.error = '';
    forkJoin({ options: this._inventory.options(), inventory: this._inventory.details(this.inventoryId), session: this._session.show(this.inventoryId, this.sessionId), }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        this.options = response.options.data;
        this.inventory = response.inventory.data;
        this.session = response.session.data;
        if (this.session.user && !this.options.operators.some(user => user.id === this.session?.user_id)) this.options.operators.push(this.session.user);
      },
      error: error => this.error = branchError(error, 'No se pudo cargar la información.'),
    });
  }
  get readOnly(): boolean { return this.session?.status !== 'open' || !!this.inventory && ['completed','cancelled'].includes(this.inventory.status); }
  save(payload: InventorySessionPayload): void {
    if (this.saving || this.readOnly) return;
    this.saving = true;
    this.error = '';
    this._session.saveChanges(this.inventoryId, this.sessionId, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => this.router.navigate(['../../'], { relativeTo: this.route }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudieron guardar los cambios.'); },
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

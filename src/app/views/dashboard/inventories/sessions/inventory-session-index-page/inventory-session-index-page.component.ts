import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { Inventory } from 'src/app/interfaces/inventory.interface';
import { InventorySession } from 'src/app/interfaces/inventory-session.interface';
import { InventorySessionService } from '../inventory-session.service';
import { InventoryService } from '../../inventory.service';
import { InventorySectionHeaderComponent } from '../../inventory-section-header/inventory-section-header.component';
import { InventorySessionIndexComponent } from '../inventory-session-index/inventory-session-index.component';
import { branchError } from '../../../branches/branch-api.model';
import { INVENTORY_STATUS_LABELS } from '../../inventory-workflow';
@Component({ selector: 'app-inventory-session-index-page', imports: [RouterLink, InventorySectionHeaderComponent, InventorySessionIndexComponent], templateUrl: './inventory-session-index-page.component.html', styleUrl: './inventory-session-index-page.component.scss' })
export class InventorySessionIndexPageComponent implements OnInit, OnDestroy {
  sessions: InventorySession[] = [];
  inventory: Inventory | null = null;
  readonly inventoryId: number;
  loading = false;
  error = '';
  page = 1;
  lastPage = 1;
  total = 0;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private _inventory: InventoryService,
    private _session: InventorySessionService,
    private route: ActivatedRoute,
  ) { this.inventoryId = Number(this.route.snapshot.paramMap.get('inventory_id')); }
  ngOnInit(): void { this.load(); }
  get canOpenSessions(): boolean { return !!this.inventory && ['draft', 'in_progress'].includes(this.inventory.status); }
  load(page = this.page): void {
    if (this.loading) return;
    if (!Number.isSafeInteger(this.inventoryId) || this.inventoryId < 1) { this.error = 'El inventario solicitado no es válido.'; return; }
    this.loading = true;
    this.error = '';
    forkJoin({ inventory: this._inventory.details(this.inventoryId), list: this._session.list(this.inventoryId, page) }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => { this.inventory = response.inventory.data; const list = response.list; this.sessions = list.data; this.page = list.current_page ?? page; this.lastPage = list.last_page ?? 1; this.total = list.total ?? list.data.length; },
      error: error => this.error = branchError(error, 'No se pudieron cargar los registros.'),
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

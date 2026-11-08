import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { InventoryLocationProgressIndexComponent } from '../inventory-location-progress-index/inventory-location-progress-index.component';
import { branchError, markBranchFieldErrors } from '../../../branches/branch-api.model';

@Component({ selector: 'app-inventory-location-progress-index-page', imports: [RouterLink, InventorySectionHeaderComponent, InventoryLocationProgressIndexComponent], templateUrl: './inventory-location-progress-index-page.component.html', styleUrl: './inventory-location-progress-index-page.component.scss' })
export class InventoryLocationProgressIndexPageComponent implements OnInit, OnDestroy {
  
  inventory: Inventory | null = null;
  session: InventorySession | null = null;
  records: InventoryLocationProgress[] = [];
  page = 1;
  lastPage = 1;
  total = 0;
  loading = false;
  error = '';
  readonly inventoryId: number;
  
  
  private readonly destroy$ = new Subject<void>();
  constructor(
    private _inventory: InventoryService,
    private _resource: InventoryLocationProgressService,
    
    
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.inventoryId = Number(this.route.snapshot.paramMap.get('inventory_id'));
    
    
  }
  ngOnInit(): void { this.load(); }
  get editable(): boolean { return !!this.inventory && ['draft','in_progress'].includes(this.inventory.status); }
  load(page = this.page): void {
    if (this.loading) return;
    if (!Number.isSafeInteger(this.inventoryId) || this.inventoryId < 1) { this.error = 'El registro solicitado no es válido.'; return; }
    this.loading = true; this.error = '';
    forkJoin({ inventory: this._inventory.details(this.inventoryId), 
      list: this._resource.list(this.inventoryId, page),
      
    }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        this.inventory = response.inventory.data;
        
        this.records = response.list.data; this.page = response.list.current_page ?? page; this.lastPage = response.list.last_page ?? 1; this.total = response.list.total ?? response.list.data.length;
        
        
      },
      error: error => this.error = branchError(error, 'No se pudieron cargar los datos de esta sección.'),
    });
  }
  
  
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete();  }
}

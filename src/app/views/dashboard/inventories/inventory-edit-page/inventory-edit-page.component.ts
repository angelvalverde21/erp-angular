import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, forkJoin, of, takeUntil } from 'rxjs';
import { Inventory, InventoryOptions, InventoryPayload } from 'src/app/interfaces/inventory.interface';
import { InventoryService } from '../inventory.service';
import { InventorySectionHeaderComponent } from '../inventory-section-header/inventory-section-header.component';
import { InventoryEditComponent } from '../inventory-edit/inventory-edit.component';
import { branchError, markBranchFieldErrors } from '../../branches/branch-api.model';

@Component({ selector: 'app-inventory-edit-page', imports: [RouterLink, InventorySectionHeaderComponent, InventoryEditComponent], templateUrl: './inventory-edit-page.component.html', styleUrl: './inventory-edit-page.component.scss' })
export class InventoryEditPageComponent implements OnInit, OnDestroy {
  @ViewChild(InventoryEditComponent) private editor?: InventoryEditComponent;
  options: InventoryOptions | null = null;
  inventory: Inventory | null = null;
  
  loading = true;
  saving = false;
  error = '';
  readonly inventoryId: number;
  
  private readonly destroy$ = new Subject<void>();
  constructor(
    private _inventory: InventoryService,
    
    private router: Router,
    private route: ActivatedRoute,
  ) { this.inventoryId = Number(this.route.snapshot.paramMap.get('inventory_id'));  }
  ngOnInit(): void { this.load(); }
  load(): void {
    if (!Number.isSafeInteger(this.inventoryId) || this.inventoryId < 1) { this.error = 'El registro solicitado no es válido.'; this.loading = false; return; }
    this.loading = true;
    this.error = '';
    forkJoin({ options: this._inventory.options(), inventory: this._inventory.details(this.inventoryId),  }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => { this.options = response.options.data; this.inventory = response.inventory?.data ?? null;   },
      error: error => this.error = branchError(error, 'No se pudo cargar la información.'),
    });
  }
  
  save(payload: InventoryPayload): void {
    if (this.saving) return;
    this.saving = true;
    this.error = '';
    this._inventory.saveChanges(this.inventoryId, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => this.router.navigate(['../../'], { relativeTo: this.route }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudieron guardar los cambios.'); },
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

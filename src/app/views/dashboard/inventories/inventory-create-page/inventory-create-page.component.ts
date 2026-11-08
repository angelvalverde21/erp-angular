import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, forkJoin, of, takeUntil } from 'rxjs';
import { Inventory, InventoryOptions, InventoryPayload } from 'src/app/interfaces/inventory.interface';
import { InventoryService } from '../inventory.service';
import { InventorySectionHeaderComponent } from '../inventory-section-header/inventory-section-header.component';
import { InventoryCreateComponent } from '../inventory-create/inventory-create.component';
import { branchError, markBranchFieldErrors } from '../../branches/branch-api.model';

@Component({ selector: 'app-inventory-create-page', imports: [RouterLink, InventorySectionHeaderComponent, InventoryCreateComponent], templateUrl: './inventory-create-page.component.html', styleUrl: './inventory-create-page.component.scss' })
export class InventoryCreatePageComponent implements OnInit, OnDestroy {
  @ViewChild(InventoryCreateComponent) private editor?: InventoryCreateComponent;
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
    
    this.loading = true;
    this.error = '';
    forkJoin({ options: this._inventory.options(), inventory: of(null),  }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => { this.options = response.options.data; this.inventory = null; },
      error: error => this.error = branchError(error, 'No se pudo cargar la información.'),
    });
  }
  
  save(payload: InventoryPayload): void {
    if (this.saving) return;
    this.saving = true;
    this.error = '';
    this._inventory.create(payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: response => this.router.navigate(['../', response.data.id, 'sessions'], { relativeTo: this.route }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudieron guardar los cambios.'); },
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

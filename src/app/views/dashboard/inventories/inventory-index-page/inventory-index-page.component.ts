import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { Inventory } from 'src/app/interfaces/inventory.interface';

import { InventoryService } from '../inventory.service';
import { InventorySectionHeaderComponent } from '../inventory-section-header/inventory-section-header.component';
import { InventoryIndexComponent } from '../inventory-index/inventory-index.component';
import { branchError } from '../../branches/branch-api.model';
import { INVENTORY_STATUS_LABELS } from '../inventory-workflow';
@Component({ selector: 'app-inventory-index-page', imports: [RouterLink, InventorySectionHeaderComponent, InventoryIndexComponent], templateUrl: './inventory-index-page.component.html', styleUrl: './inventory-index-page.component.scss' })
export class InventoryIndexPageComponent implements OnInit, OnDestroy {
  inventories: Inventory[] = [];
  search = '';
  status = '';
  readonly labels = INVENTORY_STATUS_LABELS;
  loading = false;
  error = '';
  page = 1;
  lastPage = 1;
  total = 0;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private _inventory: InventoryService,
    
  ) {  }
  ngOnInit(): void { this.load(); }
  applyFilters(event: Event): void { event.preventDefault(); this.load(1); }
  load(page = this.page): void {
    if (this.loading) return;
    
    this.loading = true;
    this.error = '';
    this._inventory.catalog(page, this.search.trim(), this.status).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => { const list = response; this.inventories = list.data; this.page = list.current_page ?? page; this.lastPage = list.last_page ?? 1; this.total = list.total ?? list.data.length; },
      error: error => this.error = branchError(error, 'No se pudieron cargar los registros.'),
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

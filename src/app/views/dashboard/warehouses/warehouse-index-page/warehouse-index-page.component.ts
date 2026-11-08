import { BranchSectionHeaderComponent } from '../../branches/branch-section-header/branch-section-header.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { Warehouse } from 'src/app/interfaces/warehouse.interface';
import { WarehouseService } from '../warehouse.service';
import { WarehouseIndexComponent } from '../warehouse-index/warehouse-index.component';
import { branchError } from '../../branches/branch-api.model';
import { BranchService } from '../../branches/branch.service';
import { Branch } from 'src/app/interfaces/branch.interface';

@Component({ selector: 'app-warehouse-index-page', imports: [BranchSectionHeaderComponent, RouterLink, WarehouseIndexComponent], templateUrl: './warehouse-index-page.component.html', styleUrl: './warehouse-index-page.component.scss' })
export class WarehouseIndexPageComponent implements OnInit, OnDestroy {
  warehouses: Warehouse[] = [];
  loading = false;
  error = '';
  page = 1;
  lastPage = 1;
  context: Branch | null = null;
  readonly parentId: number;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private _warehouse: WarehouseService,
    private _branch: BranchService,
    private route: ActivatedRoute,
  ) { this.parentId = Number(this.route.snapshot.paramMap.get('branch_id')); }

  ngOnInit(): void {
    if (!Number.isInteger(this.parentId) || this.parentId < 1) { this.error = 'Selecciona una sucursal desde la sección Sucursales.'; return; }
    this._branch.show(this.parentId).pipe(takeUntil(this.destroy$)).subscribe({ next: response => this.context = response.data, error: error => this.error = branchError(error, 'No se pudo cargar el contexto.') });
    this.load();
  }

  load(page = this.page): void {
    if (this.loading) return;
    if (!Number.isInteger(this.parentId) || this.parentId < 1) return;
    this.loading = true;
    this.error = '';
    this._warehouse.list(this.parentId, page).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => { this.warehouses = response.data; this.page = response.current_page ?? page; this.lastPage = response.last_page ?? 1; },
      error: error => this.error = branchError(error, 'No se pudieron cargar almacenes. Intenta nuevamente.'),
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

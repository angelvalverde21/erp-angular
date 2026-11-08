import { BranchSectionHeaderComponent } from '../../branches/branch-section-header/branch-section-header.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { WarehousePayload } from 'src/app/interfaces/warehouse.interface';
import { WarehouseService } from '../warehouse.service';
import { WarehouseCreateComponent } from '../warehouse-create/warehouse-create.component';
import { branchError, markBranchFieldErrors } from '../../branches/branch-api.model';
import { BranchService } from '../../branches/branch.service';
import { Branch } from 'src/app/interfaces/branch.interface';
@Component({ selector: 'app-warehouse-create-page', imports: [BranchSectionHeaderComponent, RouterLink, WarehouseCreateComponent], templateUrl: './warehouse-create-page.component.html', styleUrl: './warehouse-create-page.component.scss' })
export class WarehouseCreatePageComponent implements OnInit, OnDestroy {
  @ViewChild(WarehouseCreateComponent) private editor?: WarehouseCreateComponent;

  saving = false;
  loading = true;
  error = '';
  context: Branch | null = null;
  readonly parentId: number;
  
  private readonly destroy$ = new Subject<void>();
  constructor(
    private _warehouse: WarehouseService,
    private router: Router,
    private _branch: BranchService,
    private route: ActivatedRoute,
  ) { this.parentId = Number(this.route.snapshot.paramMap.get('branch_id')); }

  ngOnInit(): void {
    if (!Number.isInteger(this.parentId) || this.parentId < 1) { this.error = 'Abre este formulario desde una sucursal.'; return; }
    this._branch.show(this.parentId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => { this.context = response.data; this.loading = false; },
      error: error => this.error = branchError(error, 'No se pudieron cargar los datos. Vuelve al listado e intenta nuevamente.'),
    });
  }
  

  save(payload: WarehousePayload): void {
    if (this.saving) return;
    this.saving = true;
    this.error = '';
    this._warehouse.create(payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => this.router.navigate(['../'], { relativeTo: this.route }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudo crear almacén. Intenta nuevamente.'); },
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

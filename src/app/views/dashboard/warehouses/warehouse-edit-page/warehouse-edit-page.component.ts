import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, forkJoin, takeUntil } from 'rxjs';
import { Warehouse, WarehousePayload } from 'src/app/interfaces/warehouse.interface';
import { WarehouseService } from '../warehouse.service';
import { WarehouseEditComponent } from '../warehouse-edit/warehouse-edit.component';
import { BranchSectionHeaderComponent } from '../../branches/branch-section-header/branch-section-header.component';
import { branchError, markBranchFieldErrors } from '../../branches/branch-api.model';
import { Branch } from 'src/app/interfaces/branch.interface';
import { BranchService } from '../../branches/branch.service';

@Component({ selector: 'app-warehouse-edit-page', imports: [RouterLink, BranchSectionHeaderComponent, WarehouseEditComponent], templateUrl: './warehouse-edit-page.component.html', styleUrl: './warehouse-edit-page.component.scss' })
export class WarehouseEditPageComponent implements OnInit, OnDestroy {
  @ViewChild(WarehouseEditComponent) private editor?: WarehouseEditComponent;
  record: Warehouse | null = null;
  context: Branch | null = null;
  readonly parentId: number;
  
  readonly recordId: number;
  loading = true;
  saving = false;
  error = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private _warehouse: WarehouseService,
    private _branch: BranchService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.recordId = Number(this.route.snapshot.paramMap.get('warehouse_id'));
    this.parentId = Number(this.route.snapshot.paramMap.get('branch_id'));
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    if (!Number.isInteger(this.recordId) || this.recordId < 1 || !Number.isInteger(this.parentId) || this.parentId < 1) { this.error = 'El registro solicitado no es válido.'; this.loading = false; return; }
    this.loading = true;
    this.error = '';
    forkJoin({
      record: this._warehouse.show(this.recordId),
      context: this._branch.show(this.parentId),
      
    }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        if (response.record.data.branch_id !== this.parentId) { this.error = 'El registro no pertenece a la sección seleccionada.'; return; }
        this.record = response.record.data;
        this.context = response.context.data;
        
      },
      error: error => this.error = branchError(error, 'No se pudo cargar el registro.'),
    });
  }
  

  save(payload: WarehousePayload): void {
    if (this.saving || !this.record) return;
    this.saving = true;
    this.error = '';
    this._warehouse.saveChanges(this.recordId, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => this.router.navigate(['../../'], { relativeTo: this.route }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudieron guardar los cambios.'); },
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

import { BranchSectionHeaderComponent } from '../../branches/branch-section-header/branch-section-header.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { LocationPayload, Location } from 'src/app/interfaces/location.interface';
import { LocationService } from '../location.service';
import { LocationCreateComponent } from '../location-create/location-create.component';
import { branchError, markBranchFieldErrors } from '../../branches/branch-api.model';
import { WarehouseService } from '../../warehouses/warehouse.service';
import { Warehouse } from 'src/app/interfaces/warehouse.interface';
@Component({ selector: 'app-location-create-page', imports: [BranchSectionHeaderComponent, RouterLink, LocationCreateComponent], templateUrl: './location-create-page.component.html', styleUrl: './location-create-page.component.scss' })
export class LocationCreatePageComponent implements OnInit, OnDestroy {
  @ViewChild(LocationCreateComponent) private editor?: LocationCreateComponent;

  saving = false;
  loading = true;
  error = '';
  context: Warehouse | null = null;
  readonly parentId: number;
  parents: Location[] = [];
  initialParentId: number | null = null;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private _location: LocationService,
    private router: Router,
    private _warehouse: WarehouseService,
    private route: ActivatedRoute,
  ) { this.parentId = Number(this.route.snapshot.paramMap.get('warehouse_id')); }

  ngOnInit(): void {
    if (!Number.isInteger(this.parentId) || this.parentId < 1) { this.error = 'Abre este formulario desde un almacén.'; return; }
    this._warehouse.show(this.parentId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        if (response.data.branch_id !== Number(this.route.snapshot.paramMap.get('branch_id'))) {
          this.error = 'El almacén no pertenece a la sucursal seleccionada.';
          return;
        }
        this.context = response.data;
        this.loadParents();
      },
      error: error => this.error = branchError(error, 'No se pudieron cargar los datos. Vuelve al listado e intenta nuevamente.'),
    });
  }
  private loadParents(): void {
    this._location.options(this.parentId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.parents = response.data;
        const requestedParent = Number(this.route.snapshot.queryParamMap.get('parent_id'));
        this.initialParentId = this.parents.some(parent => parent.id === requestedParent) ? requestedParent : null;
        this.loading = false;
      },
      error: error => this.error = branchError(error, 'No se pudieron cargar las ubicaciones superiores.'),
    });
  }

  save(payload: LocationPayload): void {
    if (this.saving) return;
    this.saving = true;
    this.error = '';
    this._location.create(payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: response => this.router.navigate(['../'], { relativeTo: this.route, queryParams: { location_id: response.data.id } }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudo crear ubicación. Intenta nuevamente.'); },
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

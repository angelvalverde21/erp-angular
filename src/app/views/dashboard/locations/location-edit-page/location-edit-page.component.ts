import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, forkJoin, takeUntil } from 'rxjs';
import { Location, LocationPayload } from 'src/app/interfaces/location.interface';
import { LocationService } from '../location.service';
import { LocationEditComponent } from '../location-edit/location-edit.component';
import { BranchSectionHeaderComponent } from '../../branches/branch-section-header/branch-section-header.component';
import { branchError, markBranchFieldErrors } from '../../branches/branch-api.model';
import { Warehouse } from 'src/app/interfaces/warehouse.interface';
import { WarehouseService } from '../../warehouses/warehouse.service';

@Component({ selector: 'app-location-edit-page', imports: [RouterLink, BranchSectionHeaderComponent, LocationEditComponent], templateUrl: './location-edit-page.component.html', styleUrl: './location-edit-page.component.scss' })
export class LocationEditPageComponent implements OnInit, OnDestroy {
  @ViewChild(LocationEditComponent) private editor?: LocationEditComponent;
  record: Location | null = null;
  context: Warehouse | null = null;
  readonly parentId: number;
  parents: Location[] = [];
  readonly recordId: number;
  loading = true;
  saving = false;
  error = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private _location: LocationService,
    private _warehouse: WarehouseService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.recordId = Number(this.route.snapshot.paramMap.get('location_id'));
    this.parentId = Number(this.route.snapshot.paramMap.get('warehouse_id'));
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    if (!Number.isInteger(this.recordId) || this.recordId < 1 || !Number.isInteger(this.parentId) || this.parentId < 1) { this.error = 'El registro solicitado no es válido.'; this.loading = false; return; }
    this.loading = true;
    this.error = '';
    forkJoin({
      record: this._location.show(this.recordId),
      context: this._warehouse.show(this.parentId),
      parents: this._location.options(this.parentId),
    }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        if (response.record.data.warehouse_id !== this.parentId || response.context.data.branch_id !== Number(this.route.snapshot.paramMap.get('branch_id'))) { this.error = 'El registro no pertenece a la sección seleccionada.'; return; }
        this.record = response.record.data;
        this.context = response.context.data;
        this.parents = response.parents.data.filter(parent => !this.isDescendant(parent, response.parents.data));
      },
      error: error => this.error = branchError(error, 'No se pudo cargar el registro.'),
    });
  }
  
  private isDescendant(location: Location, locations: Location[]): boolean {
    const visited = new Set<number>();
    let current: Location | undefined = location;
    while (current) {
      if (current.id === this.recordId || visited.has(current.id)) return true;
      visited.add(current.id);
      current = locations.find(item => item.id === current?.parent_id);
    }
    return false;
  }

  save(payload: LocationPayload): void {
    if (this.saving || !this.record) return;
    this.saving = true;
    this.error = '';
    this._location.saveChanges(this.recordId, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => this.router.navigate(['../../'], { relativeTo: this.route, queryParams: { location_id: this.recordId } }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudieron guardar los cambios.'); },
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

import { BranchSectionHeaderComponent } from '../../branches/branch-section-header/branch-section-header.component';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { Location } from 'src/app/interfaces/location.interface';
import { LocationService } from '../location.service';
import { LocationIndexComponent } from '../location-index/location-index.component';
import { branchError } from '../../branches/branch-api.model';
import { WarehouseService } from '../../warehouses/warehouse.service';
import { Warehouse } from 'src/app/interfaces/warehouse.interface';

@Component({ selector: 'app-location-index-page', imports: [BranchSectionHeaderComponent, RouterLink, LocationIndexComponent], templateUrl: './location-index-page.component.html', styleUrl: './location-index-page.component.scss' })
export class LocationIndexPageComponent implements OnInit, OnDestroy {
  @ViewChild('deleteConfirmation') private deleteConfirmation?: TemplateRef<unknown>;
  private deleteModal?: NgbModalRef;
  pendingDelete: Location | null = null;
  deleting = false;
  deleteError = '';
  success = '';
  locations: Location[] = [];
  selectedLocationId: number | null = null;
  loading = false;
  error = '';
  context: Warehouse | null = null;
  readonly parentId: number;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private _location: LocationService,
    private _warehouse: WarehouseService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
  ) { this.parentId = Number(this.route.snapshot.paramMap.get('warehouse_id')); }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = Number(params.get('location_id'));
      this.selectedLocationId = Number.isSafeInteger(id) && id > 0 ? id : null;
    });
    if (!Number.isInteger(this.parentId) || this.parentId < 1) { this.error = 'Selecciona un almacén desde la sección Sucursales.'; return; }
    this._warehouse.show(this.parentId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        if (response.data.branch_id !== Number(this.route.snapshot.paramMap.get('branch_id'))) {
          this.error = 'El almacén no pertenece a la sucursal seleccionada.';
          return;
        }
        this.context = response.data;
        this.load();
      },
      error: error => this.error = branchError(error, 'No se pudo cargar el almacén.'),
    });
  }

  load(): void {
    if (this.loading) return;
    if (!Number.isInteger(this.parentId) || this.parentId < 1) return;
    this.loading = true;
    this.error = '';
    this._location.options(this.parentId).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => this.locations = response.data,
      error: error => this.error = branchError(error, 'No se pudieron cargar ubicaciones. Intenta nuevamente.'),
    });
  }

  selectLocation(id: number): void {
    if (!this.locations.some(location => location.id === id)) return;
    this.router.navigate([], { relativeTo: this.route, queryParams: { location_id: id }, queryParamsHandling: 'merge', replaceUrl: true });
  }

  requestDelete(location: Location): void {
    if (this.loading || this.deleting || !this.deleteConfirmation) return;
    const current = this.locations.find(item => item.id === location.id);
    if (!current) return;
    this.pendingDelete = current;
    this.deleteError = '';
    this.success = '';
    this.deleteModal = this.modalService.open(this.deleteConfirmation, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      ariaLabelledBy: 'location-delete-title',
    });
  }

  confirmDelete(): void {
    if (this.deleting || !this.pendingDelete) return;
    const location = this.pendingDelete;
    this.deleting = true;
    this.deleteError = '';
    this._location.destroy(location.id).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.deleting = false),
    ).subscribe({
      next: () => {
        this.locations = this.locations.filter(item => item.id !== location.id);
        if (this.context?.locations_count !== undefined) this.context = { ...this.context, locations_count: Math.max(0, this.context.locations_count - 1) };
        if (this.selectedLocationId === location.id) {
          this.selectedLocationId = null;
          this.router.navigate([], { relativeTo: this.route, queryParams: { location_id: null }, queryParamsHandling: 'merge', replaceUrl: true });
        }
        this.success = 'Ubicación eliminada correctamente.';
        this.pendingDelete = null;
        this.deleteModal?.close();
      },
      error: error => this.deleteError = branchError(error, 'No se pudo eliminar la ubicación. Intenta nuevamente.'),
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); this.deleteModal?.dismiss(); }
}

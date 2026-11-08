import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureProductionIndexComponent } from '../manufacture-production-index/manufacture-production-index.component';
import { ManufactureProductionService } from '../manufacture.production.service';
import { ManufactureSectionHeaderComponent } from '../../components/manufacture-section-header/manufacture-section-header.component';
import { ManufactureIndexFiltersComponent, ManufactureListFilters } from '../../components/manufacture-index-filters/manufacture-index-filters.component';

@Component({
  selector: 'app-manufacture-production-index-page',
  imports: [RouterLink, LoadingComponent, ManufactureProductionIndexComponent, ManufactureSectionHeaderComponent, ManufactureIndexFiltersComponent],
  templateUrl: './manufacture-production-index-page.component.html',
  styleUrl: './manufacture-production-index-page.component.scss',
})
export class ManufactureProductionIndexPageComponent implements OnInit, OnDestroy {
  @Input() createPath: string[] = ['./create'];

productions: any[] = [];
  activeFilters: ManufactureListFilters | null = null;
  error = '';
  loading = false;

  private readonly destroy$ = new Subject<void>();
  private readonly cancelLoad$ = new Subject<void>();

  constructor(
    private _production: ManufactureProductionService,
  ) {}

  ngOnInit(): void {
    this.productionsInit();
  }

  applyFilters(filters: ManufactureListFilters): void {
    this.activeFilters = filters;
    this.productionsInit();
  }

  clearFilters(): void {
    this.activeFilters = null;
    this.productionsInit();
  }

  productionsInit(): void {
    this.cancelLoad$.next();
    this.error = '';
    this.loading = true;

    const request = this.activeFilters
      ? this._production.search(this.activeFilters)
      : this._production.index();

    request
      .pipe(
        takeUntil(this.destroy$),
        takeUntil(this.cancelLoad$),
        finalize(() => this.loading = false),
      )
      .subscribe({
        next: (response: any) => {
          this.productions = response.data ?? [];
        },
        error: (error: unknown) => {
          this.error = 'No se pudo consultar el listado. Intenta nuevamente.';
          console.error(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cancelLoad$.complete();
  }
}

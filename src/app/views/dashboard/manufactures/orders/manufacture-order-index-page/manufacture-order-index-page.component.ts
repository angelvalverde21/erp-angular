import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureOrderIndexComponent } from '../manufacture-order-index/manufacture-order-index.component';
import { ManufactureOrderService } from '../manufacture.order.service';
import { ManufactureSectionHeaderComponent } from '../../components/manufacture-section-header/manufacture-section-header.component';
import { ManufactureIndexFiltersComponent, ManufactureListFilters } from '../../components/manufacture-index-filters/manufacture-index-filters.component';

@Component({
  selector: 'app-manufacture-order-index-page',
  imports: [RouterLink, LoadingComponent, ManufactureOrderIndexComponent, ManufactureSectionHeaderComponent, ManufactureIndexFiltersComponent],
  templateUrl: './manufacture-order-index-page.component.html',
  styleUrl: './manufacture-order-index-page.component.scss',
})
export class ManufactureOrderIndexPageComponent implements OnInit, OnDestroy {
  manufactures: any[] = [];
  activeFilters: ManufactureListFilters | null = null;
  error = '';
  loading = false;

  private readonly destroy$ = new Subject<void>();
  private readonly cancelLoad$ = new Subject<void>();

  constructor(
    private _order: ManufactureOrderService,
  ) {}

  ngOnInit(): void {
    this.manufacturesInit();
  }

  applyFilters(filters: ManufactureListFilters): void {
    this.activeFilters = filters;
    this.manufacturesInit();
  }

  clearFilters(): void {
    this.activeFilters = null;
    this.manufacturesInit();
  }

  manufacturesInit(): void {
    this.cancelLoad$.next();
    this.error = '';
    this.loading = true;

    const request = this.activeFilters
      ? this._order.search(this.activeFilters)
      : this._order.index();

    request
      .pipe(
        takeUntil(this.destroy$),
        takeUntil(this.cancelLoad$),
        finalize(() => this.loading = false),
      )
      .subscribe({
        next: (response: any) => {
          this.manufactures = response.data ?? [];
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

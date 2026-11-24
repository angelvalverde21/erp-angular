import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductListResponse, ProductSort, ProductSortDirection } from 'src/app/interfaces/product-list.interface';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { ProductIndexComponent } from '../product-index/product-index.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-index-page',
  imports: [ProductIndexComponent, RouterLink, HeadPageComponent, ProductSearchComponent],
  templateUrl: './product-index-page.component.html',
  styleUrl: './product-index-page.component.scss',
})
export class ProductIndexPageComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  sortBy: ProductSort = 'created_at';
  sortDirection: ProductSortDirection = 'desc';
  page = 1;
  lastPage = 1;
  total: number | null = null;
  loading = false;
  error = '';

  private readonly destroy$ = new Subject<void>();
  private readonly cancelLoad$ = new Subject<void>();

  constructor(
    private _product: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.productsInit();
  }

  productsInit(): void {
    this.total = null;
    this.lastPage = 1;
    this.loadProducts(1);
  }

  insertedProductId: number | null = null;
  insertDuplicate(product: Product): void {
    if (this.products.some(item => item.id === product.id)) return;
    this.products = [product, ...this.products];
    this.insertedProductId = product.id;
    if (this.total !== null) this.total++;
  }

  changeSort(sortBy: ProductSort): void {
    if (sortBy === this.sortBy) {
      this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    } else {
      this.sortDirection = ['name', 'category', 'price'].includes(sortBy) ? 'asc' : 'desc';
    }
    this.sortBy = sortBy;
    this.productsInit();
  }

  changePage(page: number): void {
    if (this.loading || page < 1 || page > this.lastPage || page === this.page) return;
    this.loadProducts(page);
  }

  retry(): void {
    if (this.loading) return;
    this.loadProducts(this.page);
  }

  private loadProducts(page: number): void {
    this.cancelLoad$.next();
    this.products = [];
    this.insertedProductId = null;
    this.page = page;
    this.error = '';
    this.loading = true;

    this._product.getCatalog(page, this.sortBy, this.sortDirection)
      .pipe(
        takeUntil(this.destroy$),
        takeUntil(this.cancelLoad$),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: response => this.receiveProducts(response, page),
        error: (error: unknown) => {
          this.error = 'No se pudieron cargar los productos. Intenta nuevamente.';
          console.error(error);
        },
      });
  }

  private receiveProducts(response: ProductListResponse, page: number): void {
    this.products = response.data ?? [];
    this.page = page;
    this.total = response.meta?.total ?? response.total ?? this.total;

    this.lastPage = Math.max(1, response.meta?.last_page ?? response.last_page ?? (response.links?.next || response.next_page_url ? page + 1 : page));
  }

  receiveParams(params: Record<string, unknown>): void {
    this.router.navigate(['search'], {
      relativeTo: this.route,
      queryParams: { ...params, sort_by: this.sortBy, sort_direction: this.sortDirection },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cancelLoad$.complete();
  }
}

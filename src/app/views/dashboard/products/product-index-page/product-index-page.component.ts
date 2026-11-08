import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductListResponse, ProductSort, ProductSortDirection } from 'src/app/interfaces/product-list.interface';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { ProductIndexComponent } from '../product-index/product-index.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-index-page',
  imports: [ProductIndexComponent, RouterLink, HeadPageComponent, LoadingComponent, ProductSearchComponent],
  templateUrl: './product-index-page.component.html',
  styleUrl: './product-index-page.component.scss',
})
export class ProductIndexPageComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  sortBy: ProductSort = 'created_at';
  sortDirection: ProductSortDirection = 'desc';
  page = 0;
  total: number | null = null;
  hasMore = true;
  loading = false;
  loadingMore = false;
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
    this.loadProducts(true);
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

  loadMoreProducts(): void {
    if (this.loading || this.loadingMore || !this.hasMore || this.error) return;
    this.loadProducts(false);
  }

  retry(): void {
    if (this.loading || this.loadingMore) return;
    this.loadProducts(this.page === 0);
  }

  private loadProducts(reset: boolean): void {
    if (reset) {
      this.cancelLoad$.next();
      this.products = [];
      this.page = 0;
      this.total = null;
      this.hasMore = true;
    }

    this.error = '';
    this.loading = reset;
    this.loadingMore = !reset;
    const nextPage = this.page + 1;

    this._product.getCatalog(nextPage, this.sortBy, this.sortDirection)
      .pipe(
        takeUntil(this.destroy$),
        takeUntil(this.cancelLoad$),
        finalize(() => {
          this.loading = false;
          this.loadingMore = false;
        }),
      )
      .subscribe({
        next: response => this.receiveProducts(response, nextPage),
        error: (error: unknown) => {
          this.error = 'No se pudieron cargar los productos. Intenta nuevamente.';
          console.error(error);
        },
      });
  }

  private receiveProducts(response: ProductListResponse, page: number): void {
    const incoming = response.data ?? [];
    const loadedIds = new Set(this.products.map(product => product.id));
    const added = incoming.filter(product => !loadedIds.has(product.id));
    this.products = [...this.products, ...added];
    this.page = page;
    this.total = response.meta?.total ?? response.total ?? this.total;

    const lastPage = response.meta?.last_page ?? response.last_page;
    if (lastPage !== undefined) this.hasMore = page < lastPage;
    else if (response.links && 'next' in response.links) this.hasMore = !!response.links.next;
    else if ('next_page_url' in response) this.hasMore = !!response.next_page_url;
    else this.hasMore = incoming.length > 0;

    this.hasMore = this.hasMore && added.length > 0;
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

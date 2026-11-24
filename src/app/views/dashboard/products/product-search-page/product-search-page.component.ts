import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductIndexComponent } from '../product-index/product-index.component';

import { faMagnifyingGlass, faFilter, faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../product.service'
import { HeadPageComponent } from "@shared/components/head-page/head-page.component";
import { ButtonComponent } from "@shared/components/buttons/button/button.component";
import { Product } from '../../../../interfaces/product.interface';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { HeadTableComponent } from '@shared/components/head-table/head-table.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductSearchComponent } from '../product-search/product-search.component';


@Component({
  selector: 'app-product-search-page',
  imports: [
    ProductIndexComponent,
    ButtonComponent,
    FontAwesomeModule,
    RouterLink,
    HeadPageComponent,
    LoadingComponent,
    HeadTableComponent,
    ProductSearchComponent
  ],
  templateUrl: './product-search-page.component.html',
  styleUrl: './product-search-page.component.scss'
})
export class ProductSearchPageComponent implements OnInit, OnDestroy {

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  faTag = faTag;

  params: any = {};

  constructor(
    private _product: ProductService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.params = params;
    });
  }


  products: any[] = [];
  loading: boolean = false;
  page = 1;
  lastPage = 1;
  total: number | null = null;
  error = '';

  changePage(page: number): void {
    if (this.loading || page < 1 || page > this.lastPage || page === this.page) return;
    this.initSearch(page);
  }

  ngOnInit() {
    this.initSearch();
  }

  insertedProductId: number | null = null;
  insertDuplicate(product: Product): void {
    if (this.products.some(item => item.id === product.id)) return;
    this.products = [product, ...this.products];
    this.insertedProductId = product.id;
    if (this.total !== null) this.total++;
  }

  initSearch(page = 1) {
    this.cancelSearch$.next();
    this.page = page;
    if (page === 1) { this.lastPage = 1; this.total = null; }
    this.products = [];
    this.insertedProductId = null;
    this.error = '';
    this.loading = true;

    this._product.search({ ...this.params, page }).pipe(takeUntil(this.destroy$), takeUntil(this.cancelSearch$)).subscribe({

      next: (resp: any) => {
        this.products = resp.data;
        this.lastPage = Math.max(1, resp.meta?.last_page ?? resp.last_page ?? (resp.links?.next || resp.next_page_url ? page + 1 : page));
        this.total = resp.meta?.total ?? resp.total ?? null;
        this.loading = false;
      },

      error: (error: any) => {
        this.loading = false;
        this.error = 'No se pudo completar la búsqueda. Inténtalo nuevamente.';
        console.error(error);
      },

    });
  }

  private readonly destroy$ = new Subject<void>();
  private readonly cancelSearch$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();
    this.cancelSearch$.complete();

  }

  receiveParams($event: any) {
    this.params = {
      ...$event,
      sort_by: this.params.sort_by ?? 'created_at',
      sort_direction: this.params.sort_direction ?? 'desc',
    };
    this.initSearch();
  }

}

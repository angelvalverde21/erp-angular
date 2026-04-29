import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ShopifyProductService } from '../../shopify.product.service';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { ShopifyProductIndexComponent } from '../../shopify-product-index/shopify-product-index.component';
import { ProductHeadTableComponent } from '../../shared/product-head-table/product-head-table.component';
import { ShopifyProductPriceIndexComponent } from '../shopify-product-price-index/shopify-product-price-index.component';
import { ActivatedRoute } from '@angular/router';
import { PaginatorComponent } from 'src/app/views/dashboard/shared/paginator/paginator.component';
import { UserHeadTableComponent } from "src/app/views/dashboard/users/shared/user-head-table/user-head-table.component";
import { HeadTableComponent } from 'src/app/views/shared/components/head-table/head-table.component';

@Component({
  selector: 'app-shopify-product-price-search-page',
  imports: [
    LoadingComponent,
    ShopifyProductIndexComponent,
    ProductHeadTableComponent,
    ShopifyProductPriceIndexComponent,
    PaginatorComponent,
    UserHeadTableComponent,
    HeadTableComponent
  ],
  templateUrl: './shopify-product-price-search-page.component.html',
  styleUrl: './shopify-product-price-search-page.component.scss'
})
export class ShopifyProductPriceSearchPageComponent {

  params: any = {};

  destroy$ = new Subject<void>();
  products: any[] = [];
  loading: boolean = true;
  status: string = '';
  links: any;

  constructor(
    private _shopify_product: ShopifyProductService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  ngOnInit(): void {

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const page = Math.max(1, Number(params['page']) || 1);
        const status = params['status'] ?? '';
        this.status = status;
        this.productInit(page, status);
        console.log(page);
      });
  }

  productInit(page: number = 1, status: string = "") {

    this.loading = true;

    this._shopify_product.search(this.params).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.products = resp.data;
        this.links = resp.links;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }


  reListProduct() {
    this.productInit();
  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveSearchResult(products: any) {
    console.log(products);

    // this.products = $event.data;
    this.links = [];
    this.products = products
  }
}
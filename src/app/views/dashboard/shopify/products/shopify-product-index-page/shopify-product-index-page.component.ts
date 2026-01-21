import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ShopifyProductService } from '../shopify.product.service';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ShopifyProductIndexComponent } from '../shopify-product-index/shopify-product-index.component';
import { ProductHeadTableComponent } from '../shared/product-head-table/product-head-table.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaginatorComponent } from '../../../shared/paginator/paginator.component';
import { HeadPageComponent } from 'src/app/views/shared/components/head-page/head-page.component';
import { ButtonLinkComponent } from 'src/app/views/shared/components/buttons/button-link/button-link.component';

@Component({
  selector: 'app-shopify-product-index-page',
  imports: [
    LoadingComponent,
    ShopifyProductIndexComponent,
    ProductHeadTableComponent,
    RouterModule,
    PaginatorComponent,
    HeadPageComponent,
    ButtonLinkComponent
  ],
  templateUrl: './shopify-product-index-page.component.html',
  styleUrl: './shopify-product-index-page.component.scss'
})
export class ShopifyProductIndexPageComponent {

  destroy$ = new Subject<void>();
  products: any[] = [];
  loading: boolean = true;
  links: any;
  status: string = '';

  constructor(
    private _shopify_product: ShopifyProductService,
    private route: ActivatedRoute
  ) {

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

    this._shopify_product.index(page, status).pipe(takeUntil(this.destroy$)).subscribe({

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

  receiveSearchResult(products: any) {
    console.log(products);

    // this.products = $event.data;

    this.products = products
  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}

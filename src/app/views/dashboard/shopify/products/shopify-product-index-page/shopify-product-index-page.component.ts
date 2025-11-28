import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ShopifyProductService } from '../shopify.product.service';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ShopifyProductIndexComponent } from '../shopify-product-index/shopify-product-index.component';
import { ProductHeadTableComponent } from '../shared/product-head-table/product-head-table.component';
@Component({
  selector: 'app-shopify-product-index-page',
  imports: [
    LoadingComponent,
    ShopifyProductIndexComponent,
    ProductHeadTableComponent
  ],
  templateUrl: './shopify-product-index-page.component.html',
  styleUrl: './shopify-product-index-page.component.scss'
})
export class ShopifyProductIndexPageComponent implements OnInit, OnDestroy{

  destroy$ = new Subject<void>();
  products: any[] = [];
  loading: boolean = true;

  constructor(private _shopify_product: ShopifyProductService) {
  
  }

  ngOnInit(): void {
    this.productInit();
  }


  productInit(){

    this.loading = true;

    this._shopify_product.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.products = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al crear. Inténtalo nuevamente.','error');
        console.error(error);
      },
    
    });

  }

  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

  receiveSearchResult($event: any) {
    // console.log($event);
    
    this.products = $event.items;
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HeadSearchComponent } from 'src/app/views/shared/components/head-search/head-search.component';
import { HeadTableComponent } from 'src/app/views/shared/components/head-table/head-table.component';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import Swal from 'sweetalert2';
import { ShopifyOrderService } from '../shopify.order.service';
import { ShopifyOrderCashIndexComponent } from './shopify-order-cash-index/shopify-order-cash-index.component';
import { HeadPageComponent } from 'src/app/views/shared/components/head-page/head-page.component';

@Component({
  selector: 'app-shopify-order-cash-page',
  imports: [
    LoadingComponent,
    HeadTableComponent,
    HeadPageComponent,
    HeadSearchComponent,
    ShopifyOrderCashIndexComponent
  ],
  templateUrl: './shopify-order-cash-page.component.html',
  styleUrl: './shopify-order-cash-page.component.scss'
})
export class ShopifyOrderCashPageComponent implements OnInit, OnDestroy{


  loading: boolean = false;
  orders: any[] = [];

  constructor(
    private _order: ShopifyOrderService
  ){
  
  }

  ngOnInit(): void {
    
    this.loading = true;
    
    this._order.cash().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.orders = resp.items;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al crear. Inténtalo nuevamente.','error');
        console.error(error);
      },
    
    });

  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

}

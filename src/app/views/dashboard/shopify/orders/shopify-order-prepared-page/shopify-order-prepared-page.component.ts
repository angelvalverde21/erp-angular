import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShopifyOrderService } from '../shopify.order.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { JsonPipe } from '@angular/common';
// import { LoadingComponent } from '@shared/components/loading/loading.component.html';

import { ShopifyOrderIndexComponent } from '../shopify-order-index/shopify-order-index.component';
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { Router, RouterModule } from '@angular/router';
import { ShopifyOrderHeaderNavigationComponent } from '../shared/shopify-order-header-navigation/shopify-order-header-navigation.component';

@Component({
  selector: 'app-shopify-order-prepared-page',
  imports: [
    ShopifyOrderIndexComponent, 
    LoadingComponent, 
    JsonPipe, 
    RouterModule,
    ShopifyOrderHeaderNavigationComponent
  ],
  templateUrl: './shopify-order-prepared-page.component.html',
  styleUrl: './shopify-order-prepared-page.component.scss'
})
export class ShopifyOrderPreparedPageComponent implements OnInit, OnDestroy{

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  store: string = "";
  cursor: string = "";
  hasNextPage: boolean = false;
  loadingSecondary: boolean = false;

  constructor(private _order: ShopifyOrderService){
  }

  loading: boolean = false;
  orders: any[] = [];

  cargarOrders(cursor: string = ""): void {

    // si es carga inicial
    const isInitialLoad = cursor === "";
    if (isInitialLoad) {
      this.loading = true;
    } else {
      this.loadingSecondary = true;
    }

    this._order.prepared(cursor)
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (resp: any) => {
          console.log(resp);

          this.orders = [...this.orders, ...resp.orders];
          this.cursor = resp.pageInfo.endCursor;
          this.hasNextPage = resp.pageInfo.hasNextPage;

          if (isInitialLoad) this.loading = false;
          else this.loadingSecondary = false;
        },

        error: (error: any) => {
          Swal.fire('Error', 'Ocurrió un problema al cargar las órdenes.', 'error');
          console.error(error);

          if (isInitialLoad) this.loading = false;
          else this.loadingSecondary = false;
        },

      });

  }

  next() {
    if (!this.cursor || this.loading || this.loadingSecondary || !this.hasNextPage) return;

    this.cargarOrders(this.cursor);
  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

  ngOnInit(): void {

    this.cargarOrders();
    
  }

}
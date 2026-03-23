import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShopifyOrderService } from '../shopify.order.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { JsonPipe } from '@angular/common';
// import { LoadingComponent } from '@shared/components/loading/loading.component.html';

import { ShopifyOrderIndexComponent } from '../shopify-order-index/shopify-order-index.component';
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ShopifyCardOrderIndexComponent } from "../../shared/shopify-card-order-index/shopify-card-order-index.component";
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { Router, RouterModule } from '@angular/router';
import { ShopifyOrderHeaderNavigationComponent } from '../shared/shopify-order-header-navigation/shopify-order-header-navigation.component';
import { BaseService } from '../../../../base.service';

@Component({
  selector: 'app-shopify-order-pending-page',
  imports: [
    ShopifyOrderIndexComponent,
    LoadingComponent,
    JsonPipe,
    RouterModule,
    ButtonComponent,
    ShopifyCardOrderIndexComponent,
    ShopifyOrderHeaderNavigationComponent
  ],
  templateUrl: './shopify-order-pending-page.component.html',
  styleUrl: './shopify-order-pending-page.component.scss'
})
export class ShopifyOrderPendingPageComponent implements OnInit, OnDestroy {

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  store: string = "";

  constructor(private _order: ShopifyOrderService, private _base: BaseService) {
    this.store = this._base.storeName!;
  }

  loading: boolean = false;
  loadingSecondary: boolean = false;
  orders: any[] = [];
  cursor: string = "";
  hasNextPage: string = "";


  cargarOrders(cursor: string = ""): void {

    // si es carga inicial
    const isInitialLoad = cursor === "";
    if (isInitialLoad) {
      this.loading = true;
    } else {
      this.loadingSecondary = true;
    }

    this._order.pending(cursor)
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

    this.cargarOrders(this.cursor);

  }

}
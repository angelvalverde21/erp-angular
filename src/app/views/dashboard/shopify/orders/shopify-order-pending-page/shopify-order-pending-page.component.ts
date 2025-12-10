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
import { BaseService } from 'src/app/views/base.service';
import { ShopifyOrderHeaderNavigationComponent } from '../shared/shopify-order-header-navigation/shopify-order-header-navigation.component';

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
export class ShopifyOrderPendingPageComponent implements OnInit, OnDestroy{

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  store: string = "";

  constructor(private _order: ShopifyOrderService, private _base: BaseService){
      this.store = this._base.storeName!;
  }

  loading: boolean = false;
  orders: any[] = [];

  cargarOders(){

    this.loading = true;

    this._order.pending().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.orders = resp.items;
        console.log(this.orders);
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

  ngOnInit(): void {

    this.cargarOders();
    
  }

}
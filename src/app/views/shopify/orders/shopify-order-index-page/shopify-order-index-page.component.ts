import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShopifyOrderService } from '../shopify.order.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { JsonPipe } from '@angular/common';
// import { LoadingComponent } from '@shared/components/loading/loading.component.html';

import { ShopifyOrderIndexComponent } from '../shopify-order-index/shopify-order-index.component';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ShopifyCardOrderIndexComponent } from "./shopify-card-order-index/shopify-card-order-index.component";

@Component({
  selector: 'app-shopify-order-index-page',
  imports: [ShopifyOrderIndexComponent, LoadingComponent, JsonPipe, ButtonComponent, ShopifyCardOrderIndexComponent],
  templateUrl: './shopify-order-index-page.component.html',
  styleUrl: './shopify-order-index-page.component.scss'
})
export class ShopifyOrderIndexPageComponent implements OnInit, OnDestroy{

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;

  constructor(private _order: ShopifyOrderService){
  
  }

  loading: boolean = false;
  orders: any[] = [];

  cargarOders(){

    this.loading = true;

    this._order.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.orders = resp.orders;
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
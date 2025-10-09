import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { JsonPipe } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { OrderIndexComponent } from '../order-index/order-index.component';

@Component({
  selector: 'app-order-index-page',
  imports: [JsonPipe, LoadingComponent, OrderIndexComponent],
  templateUrl: './order-index-page.component.html',
  styleUrl: './order-index-page.component.scss'
})
export class OrderIndexPageComponent implements OnInit, OnDestroy{


  constructor(private _order: OrderService){
  
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

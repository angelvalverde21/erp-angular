import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManufactureVariantIndexComponent } from '../../../variants/manufacture-variant-index/manufacture-variant-index.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ManufactureOrderService } from '../../order.service';
import { ActivatedRoute } from '@angular/router';
import { ManufactureOrderVariantService } from './manufacture.order.variant.service';

@Component({
  selector: 'app-manufacture-order-variant-index',
  imports: [
    ManufactureVariantIndexComponent,
    LoadingComponent
  ],
  templateUrl: './manufacture-order-variant-index.component.html',
  styleUrl: './manufacture-order-variant-index.component.scss'
})
export class ManufactureOrderVariantIndexComponent implements OnInit, OnDestroy {

  manufacture: any;
  manufacture_id: number = 0;
  purchases: any;
  loading: boolean = false;

  constructor(
    private _manufactureOrderVariantService: ManufactureOrderVariantService,
    private route: ActivatedRoute
  ) {

    // this.route.params.subscribe(params => {
    //   this.manufacture_id = params['production_id'];
    // });

    this.route.parent?.paramMap.subscribe(params => {
      this.manufacture_id = Number(params.get('order_id'));      
    });

  }

  manufacture_variants: any[] = [];

  ngOnInit(): void {

    this.kardexesInit();

  }


  kardexesInit(){

    this.loading = true;
        //seteamos el id de la orden de compra para que el servicio lo use en sus llamadas

    this._manufactureOrderVariantService.setManufactureId(this.manufacture_id || 0);

    this._manufactureOrderVariantService.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.manufacture_variants = resp.data;
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

  sum_products: number = 0;

  receiveSumManufactureVariant(sum_products: number) {

    this.sum_products = sum_products;

    // this.widget.progress = this.widget.quantity_received / this.widget.quantity_total * 100;
  }

}

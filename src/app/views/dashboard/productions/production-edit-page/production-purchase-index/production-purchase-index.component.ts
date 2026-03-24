import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PurchaseIndexComponent } from '@dashboard/purchases/purchase-index/purchase-index.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ProductionService } from '../../production.service';
import { ProductionPurchaseService } from './production.purchase.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-production-purchase-index',
  imports: [
    PurchaseIndexComponent,
    LoadingComponent,
    JsonPipe
  ],
  templateUrl: './production-purchase-index.component.html',
  styleUrl: './production-purchase-index.component.scss'
})
export class ProductionPurchaseIndexComponent {


  production: any;
  production_id: number = 0;
  purchases: any;
  loading: boolean = false;

  widget_summary: any = {
    cost: 0,
    sum_products: 0,
    sum_purchases: 0,
    reception: 0
  };

  items = [
    { title: 'Usuarios', content: 'Lista de usuarios' },
    { title: 'Productos', content: 'Lista de productos' },
    { title: 'Ventas', content: 'Lista de ventas' }
  ];

  constructor(
    private _productionPurchase: ProductionPurchaseService,
    private route: ActivatedRoute
  ) {

    // this.route.params.subscribe(params => {
    //   this.production_id = params['production_id'];
    // });

    this.route.parent?.paramMap.subscribe(params => {
      this.production_id = Number(params.get('production_id'));

    });

  }

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.productionPurchaseInit();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sum_purchases: number = 0;

  productionPurchaseInit() {

    this.loading = true;

    this._productionPurchase.setProductionId(this.production_id!);

    this._productionPurchase.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log('-----------------------------------------------');
        
        console.log(resp);
        this.purchases = resp.data;

        this.loading = false;

        this.sum_purchases = resp.data.sum_purchases ? resp.data.sum_purchases : 0;

        // this.widget_summary = {
        //   cost: (resp.data.quantity_total > 0) ? resp.data.purchase_total / resp.data.quantity_total : 0,
        //   sum_products: resp.data.quantity_total ? resp.data.quantity_total : 0,
        //   ,
        //   reception: this.kardex_summary.reception
        // };
        // this.calculeCost();
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema guardar. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  receiveSumPurchaseIndex(sum_purchases: number) {

    this.widget_summary = {
      ...this.widget_summary,
      sum_purchases: sum_purchases,
      cost: sum_purchases / this.widget_summary.sum_products,
    };

  }


}

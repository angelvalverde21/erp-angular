import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PurchaseIndexComponent } from '@dashboard/purchases/purchase-index/purchase-index.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '@shared/components/loading/loading.component';

import { JsonPipe } from '@angular/common';
import { ManufactureService } from '../../../manufacture.service';
import { ManufacturePurchaseService } from '../../../manufacture.purchase.service';

@Component({
  selector: 'app-manufacture-production-purchase-index',
  imports: [
    PurchaseIndexComponent,
    LoadingComponent,
    JsonPipe
  ],
  templateUrl: './manufacture-production-purchase-index.component.html',
  styleUrl: './manufacture-production-purchase-index.component.scss'
})
export class ManufactureProductionPurchaseIndexComponent {


  production: any;
  manufacture_id: number = 0;
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
    private _manufacturePurchase: ManufacturePurchaseService,
    private _manufacture: ManufactureService,
    private route: ActivatedRoute
  ) {

    // this.route.params.subscribe(params => {
    //   this.manufacture_id = params['manufacture_id'];
    // });

    this.route.parent?.paramMap.subscribe(params => {
      this.manufacture_id = Number(params.get('production_id'));

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

    this._manufacturePurchase.setManufactureId(this.manufacture_id!);

    this._manufacturePurchase.index().pipe(takeUntil(this.destroy$)).subscribe({

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

  // receiveSumPurchaseIndex(sum_purchases: number) {

  //   this.widget_summary = {
  //     ...this.widget_summary,
  //     sum_purchases: sum_purchases,
  //     cost: sum_purchases / this.widget_summary.sum_products,
  //   };

  // }

  receiveSumPurchases(sum_purchases: number) {

    // this.purchases = [purchase, ...this.purchases];
    console.log(sum_purchases);
    

    // console.log("receivePurchaseCreate on ProductionPurchaseIndexComponent");
    
    this._manufacture.setSummary({
      sum_purchases: sum_purchases
    });

  }

}

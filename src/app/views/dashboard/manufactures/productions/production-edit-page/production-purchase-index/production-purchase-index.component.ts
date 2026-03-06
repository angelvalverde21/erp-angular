import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ManufactureProductionService } from '../../production.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PurchaseIndexComponent } from '@dashboard/purchases/purchase-index/purchase-index.component';
import { ProductionEditHeadComponent } from '../production-edit-head/production-edit-head.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-production-purchase-index',
  imports: [
    PurchaseIndexComponent,
    ProductionEditHeadComponent,
    LoadingComponent
  ],
  templateUrl: './production-purchase-index.component.html',
  styleUrl: './production-purchase-index.component.scss'
})
export class ProductionPurchaseIndexComponent {


  manufacture: any;
  manufacture_id: string | null = null;
  purchases: any;
  loading: boolean = false;

  widget_summary: any = {
    cost: 0,
    sum_products: 0,
    sum_purchases: 0,
    reception: 0
  };

  constructor(
    private _manufactureProduction: ManufactureProductionService,
    private route: ActivatedRoute
  ) {

    // this.route.params.subscribe(params => {
    //   this.manufacture_id = params['production_id'];
    // });

    this.route.parent?.paramMap.subscribe(params => {
      this.manufacture_id = params.get('production_id');

    });

  }

  @Input() production_id: number = 0;

  destroy$ = new Subject<void>();

  ngOnInit(): void {



    this.manufactureInit();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sum_purchases: number = 0;

  manufactureInit() {

    this.loading = true;

    this._manufactureProduction.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        this.manufacture = resp.data;
        this.purchases = resp.data.purchases;

        this.loading = false;

        this.sum_purchases = resp.data.purchase_total ? resp.data.purchase_total : 0;

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

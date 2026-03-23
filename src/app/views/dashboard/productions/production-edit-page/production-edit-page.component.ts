import { Component, OnDestroy, OnInit } from '@angular/core';
// import { HeadPageComponent } from '@components/head-page/head-page.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '@components/loading/loading.component';
import Swal from 'sweetalert2';
import { ProductionService } from '../production.service';
import { ProductionWidgetComponent } from './production-widget/production-widget.component';
// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-production-edit-page',
  imports: [
    LoadingComponent,
    ProductionWidgetComponent,
    RouterModule
    // NgbDropdownModule
  ],
  templateUrl: './production-edit-page.component.html',
  styleUrl: './production-edit-page.component.scss'

})

export class ProductionEditPageComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  manufacture: any = null;
  manufacture_id: number = 0;
  purchases: any;
  variants: any;



  modal: any;
  manufacture_variants: any;


  constructor(
    private route: ActivatedRoute,
    private _production: ProductionService
  ) {

    this.route.params.subscribe(params => {
      this.manufacture_id = params['production_id'];
    });

  }

  ngOnInit(): void {

    this.manufactureInit();

  }

  // summary: SummaryPurchase = {
  //   cost: 0,
  //   sum_products: 0,
  //   sum_purchases: 0,
  //   sum_reception: 0
  // };

  //usado
  manufactureInit() {

    this.loading = true;

    this._production.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        this.manufacture = resp.data;

        // this.summary = {
        //   cost: resp.data.purchase_total / resp.data.variants_sum_quantity ? resp.data.purchase_total / resp.data.variants_sum_quantity : 0,
        //   sum_products: resp.data.variants_sum_quantity,
        //   sum_purchases: resp.data.purchase_total,
        //   sum_reception: resp.data.kardexes_sum_quantity
        // }

        this.loading = false;

        // this.calculeCost();
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  // calculeCost() {
  //   this.total_cost = Math.round(this.total_purchases_amount / this.total_products * 100) / 100;
  // }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }


}
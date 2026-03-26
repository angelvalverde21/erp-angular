import { Component, OnDestroy, OnInit, effect } from '@angular/core';
// import { HeadPageComponent } from '@components/head-page/head-page.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '@components/loading/loading.component';
import Swal from 'sweetalert2';
import { ProductionService } from '../production.service';
import { ProductionWidgetComponent } from './production-widget/production-widget.component';
import { HeadPageComponent } from '../../../shared/components/head-page/head-page.component';
// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { SummaryPurchase } from '../../../../interfaces/summary.interface';
import { ProductionEditComponent } from '../production-edit/production-edit.component'

@Component({
  selector: 'app-production-edit-page',
  imports: [
    LoadingComponent,
    HeadPageComponent,
    ButtonLinkComponent,
    ProductionWidgetComponent,
    ProductionEditComponent,
    RouterModule
    // NgbDropdownModule
  ],
  templateUrl: './production-edit-page.component.html',
  styleUrl: './production-edit-page.component.scss'

})

export class ProductionEditPageComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  production: any = null;
  production_id: number = 0;
  purchases: any;
  variants: any;

  // summary: any;

  modal: any;
  production_variants: any;

  constructor(
    private route: ActivatedRoute,
    private _production: ProductionService
  ) {

    this.route.params.subscribe(params => {
      this.production_id = params['production_id'];
    });

    effect(() => {

      const event = this._production.summaryEvent();

      if (!event) return;

      this.summary = {
        ...this.summary,
        ...event,
      }

      console.log('Summary actualizado:', event);

      console.log(this.summary);
      
      
    });

  }

  ngOnInit(): void {

    this.productionInit();

  }

  summary: SummaryPurchase = {
    sum_variants: 0,
    sum_purchases: 0,
    sum_kardexes: 0
  };

  //usado
  productionInit() {

    this.loading = true;

    this._production.get(this.production_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        this.production = resp.data;

        this.summary = {
          sum_variants: resp.data.sum_variants,
          sum_purchases: resp.data.sum_purchases,
          sum_kardexes: resp.data.sum_kardexes
        }

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

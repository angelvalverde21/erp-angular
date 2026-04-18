import { Component, OnDestroy, OnInit, effect } from '@angular/core';
// import { HeadPageComponent } from '@components/head-page/head-page.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '@components/loading/loading.component';
import Swal from 'sweetalert2';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { ManufactureProductionService } from '../manufacture.production.service';
import { ProductionWidgetComponent } from './production-widget/production-widget.component';
import { ManufactureProductionEditComponent } from './manufacture-production-edit/manufacture-production-edit.component';
import { SummaryPurchase } from '@interfaces/summary.interface';
import { ManufactureService } from '../../manufacture.service';

@Component({
  selector: 'app-manufacture-production-edit-page',
  imports: [
    LoadingComponent,
    HeadPageComponent,
    ButtonLinkComponent,
    ProductionWidgetComponent,
    RouterModule,
    ManufactureProductionEditComponent
    // NgbDropdownModule
  ],
  templateUrl: './manufacture-production-edit-page.component.html',
  styleUrl: './manufacture-production-edit-page.component.scss'

})

export class ManufactureProductionEditPageComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  manufacture: any = null;
  manufacture_id: number = 0;
  purchases: any;
  variants: any;

  // summary: any;--------------------------------------*

  modal: any;
  manufacture_variants: any;

  constructor(
    private route: ActivatedRoute,
    private _manufacture: ManufactureService,
    private _manufactureProduction: ManufactureProductionService
  ) {

    this.route.params.subscribe(params => {
      this.manufacture_id = Number(params['production_id']);
    });


    //Escuchar cambios en el resumen de compras y actualizar el widget de resumen en consecuencia
    effect(() => {

      const event = this._manufacture.summaryEvent();

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
    count_variants: 0,
    sum_purchases: 0,
    sum_kardexes: 0
  };

  //usado
  productionInit() {

    this.loading = true;

    this._manufacture.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        this.manufacture = resp.data;
        this._manufacture.setManufacture(this.manufacture);

        this.summary = {
          sum_variants: this.manufacture.sum_variants,
          count_variants: this.manufacture.count_variants,
          sum_purchases: this.manufacture.sum_purchases,
          sum_kardexes: this.manufacture.sum_kardexes
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

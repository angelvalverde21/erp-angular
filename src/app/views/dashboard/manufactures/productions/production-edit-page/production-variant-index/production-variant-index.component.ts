import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ManufactureProductionService } from '../../production.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureVariantIndexComponent } from '../../../variants/manufacture-variant-index/manufacture-variant-index.component';

@Component({
  selector: 'app-production-variant-index',
  imports: [
    LoadingComponent,
    ManufactureVariantIndexComponent
  ],
  templateUrl: './production-variant-index.component.html',
  styleUrl: './production-variant-index.component.scss'
})
export class ProductionVariantIndexComponent {

  manufacture: any;
  manufacture_id: string | null = null;
  purchases: any;
  loading: boolean = false;

  ngOnInit(): void {
    this.manufactureInit();
  }

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

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sum_purchases: number = 0;
  manufacture_variants: any;
  
  manufactureInit() {

    this.loading = true;

    this._manufactureProduction.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        this.manufacture = resp.data;
        this.purchases = resp.data.purchases;
        this.manufacture_variants = resp.data.manufacture_variants;

        this.loading = false;

        this.sum_products = resp.data.quantity_total ? resp.data.quantity_total : 0;

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

  sum_products: number = 0;

  receiveSumManufactureVariant(sum_products: number) {

    console.log("received total products:", sum_products);

    this.sum_products = sum_products;

    // this.widget_summary = {
    //   ...this.widget_summary,
    //   cost: this.widget_summary.sum_purchases / sum_products,
    //   sum_products: sum_products,
    // };

  }

}

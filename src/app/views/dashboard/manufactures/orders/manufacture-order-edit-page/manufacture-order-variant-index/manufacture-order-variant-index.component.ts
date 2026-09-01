import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManufactureVariantIndexComponent } from '../../../variants/manufacture-variant-index/manufacture-variant-index.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ManufactureVariantService } from '../../../manufacture.variants.service';
import { ManufactureService } from '../../../manufacture.service';

@Component({
  selector: 'app-manufacture-order-variant-index',
  imports: [
    ManufactureVariantIndexComponent,
    LoadingComponent,

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
    private _manufactureVariantService: ManufactureVariantService,
    private _manufacture: ManufactureService,
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


  kardexesInit() {

    this.loading = true;
    //seteamos el id de la orden de compra para que el servicio lo use en sus llamadas

    this._manufactureVariantService.setManufactureId(this.manufacture_id || 0);

    this._manufactureVariantService.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.manufacture_variants = resp.data;
        this.sumQuantity();
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }


  sumQuantity(): void {

    this.sum_variants = this.manufacture_variants.reduce(
      (acc: number, mv: any) => acc + Number(mv.quantity ?? 0),
      0
    );

    // this.emitSumProductionVariant.emit(this.sum_products);

    //Este valor se envia por signals
    this._manufacture.setSummary({
      sum_variants: this.sum_variants,
      count_variants: this.manufacture_variants.length
    });

  }


  sum_variants: number = 0;

  receiveSumManufactureVariant(sum_variants: number) {

    this.sum_variants = sum_variants;

    console.log('sum_variants', this.sum_variants);

    this._manufacture.setSummary({
      sum_variants: this.sum_variants,
      count_variants: this.manufacture_variants.length
    });
    // this.widget.progress = this.widget.quantity_received / this.widget.quantity_total * 100;
  }

}

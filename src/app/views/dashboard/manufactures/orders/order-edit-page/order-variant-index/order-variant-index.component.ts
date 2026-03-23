import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManufactureVariantIndexComponent } from '../../../variants/manufacture-variant-index/manufacture-variant-index.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ManufactureOrderService } from '../../order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-variant-index',
  imports: [
    ManufactureVariantIndexComponent,
    LoadingComponent
  ],
  templateUrl: './order-variant-index.component.html',
  styleUrl: './order-variant-index.component.scss'
})
export class OrderVariantIndexComponent implements OnInit, OnDestroy {

  manufacture: any;
  manufacture_id: string | null = null;
  purchases: any;
  loading: boolean = false;

  constructor(
    private _manufactureOrder: ManufactureOrderService,
    private route: ActivatedRoute
  ) {

    // this.route.params.subscribe(params => {
    //   this.manufacture_id = params['production_id'];
    // });

    this.route.parent?.paramMap.subscribe(params => {
      this.manufacture_id = params.get('order_id');

    });

  }

  ngOnInit(): void {
    this.manufactureInit();
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  manufacture_variants: any;
  sum_products: number = 0;

  manufactureInit() {

    this.loading = true;

    this._manufactureOrder.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        this.manufacture = resp.data;
        this.manufacture_variants = resp.data.manufacture_variants;
        this.purchases = resp.data.purchases;
        console.log(this.manufacture_variants);

        // this.variants = this.manufacture_variants.map((mv: any) => mv.variant);

        this.loading = false;

        // this.calculeCost();
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema guardar. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  receiveSumManufactureVariant(sum_products: number) {

    this.sum_products = sum_products;

    // this.widget.progress = this.widget.quantity_received / this.widget.quantity_total * 100;
  }

}

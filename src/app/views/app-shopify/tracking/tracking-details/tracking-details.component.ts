import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopifyWebService } from '../../shopify.web.service'
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DateShopifyPipe } from '../../../shared/pipes/date-shopify.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tracking-details',
  imports: [
    DateShopifyPipe,
    CommonModule
  ],
  templateUrl: './tracking-details.component.html',
  styleUrl: './tracking-details.component.scss'
})
export class TrackingDetailsComponent {

  order_id: number = 0;
  loading: boolean = false;
  tracking: any;

  constructor(private route: ActivatedRoute, private _shopifyWeb: ShopifyWebService) {

    console.log("hola");

    this.route.params.subscribe(params => {
      this.order_id = params['order_id'];
      console.log(this.order_id);

    });

  }

  orderInit() {

    this.loading = true;

    this._shopifyWeb.tracking(this.order_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        // this.orders = resp.data;
        this.loading = false;
        this.tracking = resp;

      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  ngOnInit(): void {
    this.orderInit();
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }


}

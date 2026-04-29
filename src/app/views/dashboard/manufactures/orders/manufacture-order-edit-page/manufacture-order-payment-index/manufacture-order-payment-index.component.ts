import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PaymentIndexComponent } from 'src/app/views/dashboard/payments/payment-index/payment-index.component';
import { HeadTableComponent } from 'src/app/views/shared/components/head-table/head-table.component';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import Swal from 'sweetalert2';
import { ManufacturePaymentService } from './manufacture.payment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manufacture-order-payment-index',
  imports: [
    HeadTableComponent,
    PaymentIndexComponent,
    LoadingComponent
  ],
  templateUrl: './manufacture-order-payment-index.component.html',
  styleUrl: './manufacture-order-payment-index.component.scss'
})
export class ManufactureOrderPaymentIndexComponent implements OnInit, OnDestroy {

  manufacture_id: number = 0;

  constructor(
    private _manufacturePayment: ManufacturePaymentService,
    private route: ActivatedRoute,
  ) {

    this.route.parent?.paramMap.subscribe(params => {
      this.manufacture_id = Number(params.get('order_id'));

    });
  }

  loading: boolean = true;

  payments: any[] = [];

  ngOnInit(): void {
    // Simulación de carga de datos

    this.loading = true;

    this._manufacturePayment.setManufactureId(this.manufacture_id);

    this._manufacturePayment.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        this.payments = resp.data;
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

}

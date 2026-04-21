import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PaymentIndexComponent } from 'src/app/views/dashboard/payments/payment-index/payment-index.component';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { EmployeePaymentService } from '../employe-payment-index/employe.payment.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { HeadTableComponent } from 'src/app/views/shared/components/head-table/head-table.component';
import { VoidIndexComponent } from 'src/app/views/shared/components/void-index/void-index.component';
import { PaymentReadIndexComponent } from 'src/app/views/dashboard/payments/payment-read-index/payment-read-index.component';

@Component({
  selector: 'app-employe-payment-index',
  imports: [
    PaymentIndexComponent,
    LoadingComponent,
    NgbAccordionModule,
    HeadTableComponent,
    VoidIndexComponent,
    PaymentReadIndexComponent
  ],
  templateUrl: './employe-payment-index.component.html',
  styleUrl: './employe-payment-index.component.scss'
})
export class EmployePaymentIndexComponent implements OnInit, OnDestroy {


  employee_id: number = 0;
  loading: boolean = false;
  employee_payments: any[] = [];
  purchases_payments: any[] = [];

  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private route: ActivatedRoute,
    private _employeePayment: EmployeePaymentService
  ) {

    this.route.parent?.params.subscribe(params => {

      this.employee_id = Number(params['employee_id']);
      console.log('employee_id:', this.employee_id);

      this._employeePayment.setId(this.employee_id);

    });

  }

  receiveParams(params: any) {

    console.log('Received params from head-table:', params);
    // Aquí puedes manejar los parámetros recibidos, por ejemplo, para filtrar los pagos
    // o para realizar alguna acción específica en función de los parámetros. 

  }

  ngOnInit(): void {

    this.paymentsInit();

  }

  paymentsInit() {

    this.loading = true;

    this._employeePayment.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.employee_payments = resp.data.employee_payments;
        this.purchases_payments = resp.data.purchase_payments;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los datos de payments. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();


  }

  receiveSearchResult(data: any) {

    this.loading = false;

    this.employee_payments = data.employee_payments ?? [];
    this.purchases_payments = data.purchase_payments ?? [];

    console.log('Received search results from head-table:', data);
  }

  receiveLoadingStatus(status: boolean) {

    console.log('Received loading status from head-table:', status);
    this.loading = status;
  }
}

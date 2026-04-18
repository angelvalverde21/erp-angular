import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeePaymentService } from './employe.payment.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PaymentIndexComponent } from 'src/app/views/dashboard/payments/payment-index/payment-index.component';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';

@Component({
  selector: 'app-employe-payment-index',
  imports: [
    PaymentIndexComponent,
    LoadingComponent
  ],
  templateUrl: './employe-payment-index.component.html',
  styleUrl: './employe-payment-index.component.scss'
})
export class EmployePaymentIndexComponent implements OnInit, OnDestroy{


  employee_id: number = 0;
  loading: boolean = false;
  payments: any[] = [];

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

  ngOnInit(): void {

    this.paymentsInit();

  }

  paymentsInit(){

    this.loading = true;
    
    this._employeePayment.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.payments = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al traer los datos de payments. Inténtalo nuevamente.','error');
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

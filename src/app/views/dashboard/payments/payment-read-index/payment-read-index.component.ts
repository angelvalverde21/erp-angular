import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PaymentIndexRowComponent } from '../payment-index-row/payment-index-row.component';
import { VoidIndexComponent } from 'src/app/views/shared/components/void-index/void-index.component';

@Component({
  selector: 'app-payment-read-index',
  imports: [
    PaymentIndexRowComponent,
    VoidIndexComponent
  ],
  templateUrl: './payment-read-index.component.html',
  styleUrl: './payment-read-index.component.scss'
})
export class PaymentReadIndexComponent implements OnChanges{

  sum_payments: number = 0;
  @Input() payments: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['payments']) {
      
      // Asegurar que siempre sea un array
      const paymentsArray = Array.isArray(this.payments) ? this.payments : [];
      
      // Normalizar la propiedad
      this.payments = paymentsArray;
      
      console.log(this.payments);
      // Calcular suma
      this.sum_payments = paymentsArray.reduce(
        (acc: number, payment: any) => acc + Number(payment?.amount || 0),
        0
      );
    }
  }


}

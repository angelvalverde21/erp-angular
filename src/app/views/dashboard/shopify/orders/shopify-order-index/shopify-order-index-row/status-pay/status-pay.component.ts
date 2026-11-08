import { Component, Input } from '@angular/core';
import { paymentState } from '../../../shared/order-status-stepper/order-status.model';

@Component({
  selector: 'app-status-pay',
  imports: [],
  templateUrl: './status-pay.component.html',
  styleUrl: './status-pay.component.scss',
})
export class StatusPayComponent {
  @Input() status: any;

  get payment() {
    return paymentState(this.status);
  }
}

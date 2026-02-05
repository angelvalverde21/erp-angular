import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment-edit',
  imports: [],
  templateUrl: './payment-edit.component.html',
  styleUrl: './payment-edit.component.scss'
})
export class PaymentEditComponent {

  @Input() payment: any = {}; 
  form!: FormGroup;
  @Input() paymentable_type: string = "";
  @Input() paymentable_id: number = 0;

}

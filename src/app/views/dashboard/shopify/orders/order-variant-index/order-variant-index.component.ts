import { Component, Input } from '@angular/core';
import { OrderVariantRowComponent } from '../order-variant-row/order-variant-row.component';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-variant-index',
  imports: [
    OrderVariantRowComponent,

  ],
  templateUrl: './order-variant-index.component.html',
  styleUrl: './order-variant-index.component.scss'
})
export class OrderVariantIndexComponent {

  // @Input() variants: any[] = [];

  @Input() variants!: FormArray<FormGroup>;
}

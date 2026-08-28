import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shipping-lines',
  imports: [
    JsonPipe,
    CommonModule
  ],
  templateUrl: './shipping-lines.component.html',
  styleUrl: './shipping-lines.component.scss'
})
export class ShippingLinesComponent {


  @Input() shippingLines: any[] = []; 

}

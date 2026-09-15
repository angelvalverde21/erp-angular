import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'tr[app-shopify-order-cash-index-row]',
  imports: [
    JsonPipe,
    CommonModule
  ],
  templateUrl: './shopify-order-cash-index-row.component.html',
  styleUrl: './shopify-order-cash-index-row.component.scss'
})
export class ShopifyOrderCashIndexRowComponent {

  @Input() order: any;

}

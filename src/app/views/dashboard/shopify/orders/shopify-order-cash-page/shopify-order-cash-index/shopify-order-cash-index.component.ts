import { Component, Input } from '@angular/core';
import { ShopifyOrderCashIndexRowComponent } from '../shopify-order-cash-index-row/shopify-order-cash-index-row.component';

@Component({
  selector: 'app-shopify-order-cash-index',
  imports: [
    ShopifyOrderCashIndexRowComponent
  ],
  templateUrl: './shopify-order-cash-index.component.html',
  styleUrl: './shopify-order-cash-index.component.scss'
})
export class ShopifyOrderCashIndexComponent {


  @Input() orders: any[] = []; 

}

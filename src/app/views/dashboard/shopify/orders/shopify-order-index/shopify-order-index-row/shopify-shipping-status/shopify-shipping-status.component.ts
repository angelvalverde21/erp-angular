import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shopify-shipping-status',
  imports: [],
  templateUrl: './shopify-shipping-status.component.html',
  styleUrl: './shopify-shipping-status.component.scss'
})
export class ShopifyShippingStatusComponent {

  @Input() displayFulfillmentStatus: string = ""; 

}

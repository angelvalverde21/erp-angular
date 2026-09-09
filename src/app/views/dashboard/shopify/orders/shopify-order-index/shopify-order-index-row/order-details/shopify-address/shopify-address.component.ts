import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shopify-address',
  imports: [
    CommonModule
  ],
  templateUrl: './shopify-address.component.html',
  styleUrl: './shopify-address.component.scss'
})
export class ShopifyAddressComponent {

  @Input() addresses: any; 

}

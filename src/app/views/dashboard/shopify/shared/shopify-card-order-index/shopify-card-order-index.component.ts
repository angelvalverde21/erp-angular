import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shopify-card-order-index',
  imports: [],
  templateUrl: './shopify-card-order-index.component.html',
  styleUrl: './shopify-card-order-index.component.scss'
})
export class ShopifyCardOrderIndexComponent {

  @Input() pedidos: number = 0; 
}

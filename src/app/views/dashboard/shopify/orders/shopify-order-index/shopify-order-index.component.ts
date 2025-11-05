import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopify-order-index',
  imports: [UpperCasePipe],
  templateUrl: './shopify-order-index.component.html',
  styleUrl: './shopify-order-index.component.scss'
})
export class ShopifyOrderIndexComponent  implements OnInit{

  @Input() orders: any[] = []; 


  ordersPending : any[] = [];

  constructor() {

  }
  ngOnInit(): void {
    // this.ordersPending = this.orders.filter((order) => order.displayFinancialStatus === 'PENDING');
    // this.ordersPending = this.orders.filter((order) => order.displayFulfillmentStatus === 'UNFULFILLED');
  }
}
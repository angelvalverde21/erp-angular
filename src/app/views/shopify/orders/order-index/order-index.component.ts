import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FinancialStatusComponent } from './financial-status/financial-status.component';
import { FillmentStatusComponent } from './fillment-status/fillment-status.component';

@Component({
  selector: 'app-order-index',
  imports: [UpperCasePipe, FinancialStatusComponent, FillmentStatusComponent],
  templateUrl: './order-index.component.html',
  styleUrl: './order-index.component.scss'
})
export class OrderIndexComponent implements OnInit{

  @Input() orders: any[] = []; 


  ordersPending : any[] = [];

  constructor() {

  }
  ngOnInit(): void {
    // this.ordersPending = this.orders.filter((order) => order.displayFinancialStatus === 'PENDING');
    this.ordersPending = this.orders.filter((order) => order.displayFulfillmentStatus === 'UNFULFILLED');
  }
}

import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DateShopifyPipe } from '@shared/pipes/date-shopify.pipe';
import { PenPipe } from '@shared/pipes/pen.pipe';

@Component({
  selector: 'app-order-index',
  imports: [
    DateShopifyPipe,
    PenPipe,
    JsonPipe
  ],
  templateUrl: './order-index.component.html',
  styleUrl: './order-index.component.scss'
})
export class OrderIndexComponent {

  @Input() orders: any[] = [];

  getOrderSum(order: any): number {
    return (order?.lineItems ?? []).reduce(
      (acc: number, item: any) =>
        acc + Number(item?.variant?.price ?? 0),
      0
    );
  }
     
}

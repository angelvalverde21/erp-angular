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

  getOrderTotal(order: any): number {
    return order?.totalPriceSet?.shopMoney?.amount ?? 0;
  }

  getShipping(order: any): number {
    return order?.totalShippingPriceSet?.shopMoney?.amount ?? 0;
  }

  getOrdersSum(orders: any[]): number {
    return orders.reduce((acc, order) => acc + this.getOrderSum(order), 0);
  }

}

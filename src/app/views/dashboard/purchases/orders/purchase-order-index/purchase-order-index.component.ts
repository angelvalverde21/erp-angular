import { Component, Input } from '@angular/core';
import { PurchaseOrderIndexRowComponent } from '../purchase-order-index-row/purchase-order-index-row.component';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-purchase-order-index',
  imports: [
    PurchaseOrderIndexRowComponent,
    DateShopifyPipe,
    NgbProgressbar
  ],
  templateUrl: './purchase-order-index.component.html',
  styleUrl: './purchase-order-index.component.scss'
})
export class PurchaseOrderIndexComponent {

  @Input() purchase_orders: any[] = [];

  reListPurchaseOrders(id: any) {
    this.purchase_orders = this.purchase_orders.filter((purchase) => purchase.id !== id);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  getPurchaseOrderId(purchase_order_id: number = 0) {
    this.router.navigate([purchase_order_id], { relativeTo: this.route });
  }
}

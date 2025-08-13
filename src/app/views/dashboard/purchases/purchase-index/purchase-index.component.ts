import { Component, Input} from '@angular/core';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PurchaseIndexRowComponent } from '../purchase-index-row/purchase-index-row.component';

@Component({
  selector: 'app-purchase-index',
  imports: [LoadingComponent, PurchaseIndexRowComponent],
  templateUrl: './purchase-index.component.html',
  styleUrl: './purchase-index.component.scss'
})
export class PurchaseIndexComponent{

    @Input() purchases: any[] = [];

  
  reListPurchases(id: any) {
    this.purchases = this.purchases.filter((purchase) => purchase.id !== id);
  }


}

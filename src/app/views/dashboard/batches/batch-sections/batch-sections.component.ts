import { Component, Input } from '@angular/core';
import { ButtonPurchaseCreateComponent } from '../../shared/components/buttons/button-purchase-create/button-purchase-create.component';
import { JsonPipe } from '@angular/common';
import { PurchaseIndexComponent } from '../../purchases/purchase-index/purchase-index.component';
@Component({
  selector: 'app-batch-sections',
  imports: [ButtonPurchaseCreateComponent, JsonPipe, PurchaseIndexComponent],
  templateUrl: './batch-sections.component.html',
  styleUrl: './batch-sections.component.scss'
})
export class BatchSectionsComponent {

  @Input() subsection: any; 
  @Input() purchases: any; 

  @Input() purchaseable_id: number = 0;
  
 
  receivePurchaseCreate(purchase: any) {
    console.log(purchase);

    this.purchases = [purchase, ...this.purchases];

  }

}

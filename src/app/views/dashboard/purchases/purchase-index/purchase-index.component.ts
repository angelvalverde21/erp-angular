import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { PurchaseIndexRowComponent } from '../purchase-index-row/purchase-index-row.component';
import { CapitalizePipe } from 'src/app/views/shared/pipes/capitalize.pipe';
import { faEdit, faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { PurchaseEditComponent } from '../purchase-edit/purchase-edit.component';
import { GalleryComponent } from 'src/app/views/shared/components/gallery/gallery.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-purchase-index',
  imports: [
    LoadingComponent,
    PurchaseIndexRowComponent,
    CapitalizePipe,
    ButtonComponent,
    PurchaseEditComponent,
    GalleryComponent,
    CurrencyPipe
  ],
  templateUrl: './purchase-index.component.html',
  styleUrl: './purchase-index.component.scss'
})
export class PurchaseIndexComponent implements OnInit, OnDestroy {

  @Input() purchases: any[] = [];
  @Input() purchaseable_type: string = '';
  @Input() purchaseable_id: number = 0;
  //
  faEdit = faEdit;
  faCashRegister = faCashRegister;

  reListPurchases(id: any) {
    this.purchases = this.purchases.filter((purchase) => purchase.id !== id);
  }


  purchase : any = null;

   sumTotalAmount(): number {
    return this.purchases.reduce(
      (sum, purchase) => sum + Number(purchase.total ?? 0),
      0
    );
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
 

  receivePurchaseUpdated(updatedPurchase: any){
    const index = this.purchases.findIndex(p => p.id === updatedPurchase.id);
    if (index !== -1) {
      this.purchases[index] = updatedPurchase;
    }
  }

  receiveRemovePurchase(purchase_id: number){
    this.purchases = this.purchases.filter(p => p.id !== purchase_id);
  }
}

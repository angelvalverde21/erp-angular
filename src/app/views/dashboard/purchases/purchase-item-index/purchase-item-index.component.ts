import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { PurchaseItemRowComponent } from "../purchase-item-row/purchase-item-row.component";

@Component({
  selector: 'app-purchase-item-index',
  imports: [
    PurchaseItemRowComponent
],
  templateUrl: './purchase-item-index.component.html',
  styleUrl: './purchase-item-index.component.scss'
})
export class PurchaseItemIndexComponent {

    @Input() purchase_items!: FormArray<FormGroup>;

    @Output() emitAddItem = new EventEmitter<boolean>();
    
    addItem(){
        this.emitAddItem.emit(true);
    }

    receivePurchaseItemRemove(index: number){
        this.purchase_items.removeAt(index);
    }

}

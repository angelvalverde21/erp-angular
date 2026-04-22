import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VoidIndexComponent } from 'src/app/views/shared/components/void-index/void-index.component';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';

@Component({
  selector: 'app-inventory-batch-index',
  imports: [
    RouterModule,
    VoidIndexComponent,
    CommonModule,
    DateShopifyPipe
  ],
  templateUrl: './inventory-batch-index.component.html',
  styleUrl: './inventory-batch-index.component.scss'
})
export class InventoryBatchIndexComponent implements OnChanges{

  @Input() inventories: any[] = []; 

  @Output() sumQuantityEmit = new EventEmitter<number>();
  
  ngOnChanges(): void {
    // Asegurar que siempre sea un array
    this.inventories = Array.isArray(this.inventories) ? this.inventories : []; 

    this.sumQuantityEmit.emit(this.sumQuantity());

  }

  sumQuantity(){
    return this.inventories.reduce((sum: number, inventory) => sum + (Number(inventory.sum_quantity) || 0), 0);
  }

}

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VoidIndexComponent } from 'src/app/views/shared/components/void-index/void-index.component';

@Component({
  selector: 'app-inventory-index',
  imports: [
    RouterModule,
    VoidIndexComponent
  ],
  templateUrl: './inventory-index.component.html',
  styleUrl: './inventory-index.component.scss'
})
export class InventoryIndexComponent implements OnChanges{

  @Input() inventories: any[] = []; 
  
  ngOnChanges(): void {
    // Asegurar que siempre sea un array
    this.inventories = Array.isArray(this.inventories) ? this.inventories : []; 

  }

}

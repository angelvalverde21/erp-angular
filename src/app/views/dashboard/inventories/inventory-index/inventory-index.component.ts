import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inventory-index',
  imports: [
    RouterModule
  ],
  templateUrl: './inventory-index.component.html',
  styleUrl: './inventory-index.component.scss'
})
export class InventoryIndexComponent {

  @Input() inventories: any[] = []; 

}

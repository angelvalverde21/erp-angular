import { Component, Input } from '@angular/core';
import { KardexIndexComponent } from '../../kardex/kardex-index/kardex-index.component';

@Component({
  selector: 'app-inventory-edit',
  imports: [
    KardexIndexComponent
  ],
  templateUrl: './inventory-edit.component.html',
  styleUrl: './inventory-edit.component.scss'
})
export class InventoryEditComponent {

  @Input() inventory: any = null;

}

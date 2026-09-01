import { Component, Input } from '@angular/core';
import { KardexIndexComponent } from '../../../kardex/kardex-index/kardex-index.component';

@Component({
  selector: 'app-inventory-batch-edit',
  imports: [
    KardexIndexComponent
  ],
  templateUrl: './inventory-batch-edit.component.html',
  styleUrl: './inventory-batch-edit.component.scss'
})
export class InventoryBatchEditComponent {

  @Input() inventory: any = null;

}

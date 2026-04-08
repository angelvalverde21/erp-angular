import { Component } from '@angular/core';
import { InventoryVariantSearchComponent } from '../variants/inventory-variant-search/inventory-variant-search.component';

@Component({
  selector: 'app-inventory-create',
  imports: [
    InventoryVariantSearchComponent
  ],
  templateUrl: './inventory-create.component.html',
  styleUrl: './inventory-create.component.scss'
})
export class InventoryCreateComponent {

  receiveSearchSelectedVariants(event: any) {
    console.log('Variantes seleccionadas:', event);
    // Aquí puedes manejar las variantes seleccionadas, por ejemplo, agregándolas a un formulario o a una lista.
  }

  

}

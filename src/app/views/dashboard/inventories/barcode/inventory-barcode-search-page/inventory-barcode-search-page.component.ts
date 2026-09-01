import { Component } from '@angular/core';
import { InventoryBarcodeSearchComponent } from '../inventory-barcode-search/inventory-barcode-search.component';
import { HeadPageComponent } from 'src/app/views/shared/components/head-page/head-page.component';
import { ButtonLinkComponent } from 'src/app/views/shared/components/buttons/button-link/button-link.component';

@Component({
  selector: 'app-inventory-barcode-search-page',
  imports: [
    InventoryBarcodeSearchComponent,
    HeadPageComponent,
    ButtonLinkComponent
  ],
  templateUrl: './inventory-barcode-search-page.component.html',
  styleUrl: './inventory-barcode-search-page.component.scss'
})
export class InventoryBarcodeSearchPageComponent {


  barcode: string = '';

}

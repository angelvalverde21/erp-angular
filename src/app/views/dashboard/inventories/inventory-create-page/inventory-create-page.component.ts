import { Component } from '@angular/core';
import { InventoryCreateComponent } from '../inventory-create/inventory-create.component';
import { HeadPageComponent } from 'src/app/views/shared/components/head-page/head-page.component';
import { ButtonBackComponent } from 'src/app/views/shared/components/buttons/button-back/button-back.component';
import { InventoryIndexComponent } from '../inventory-index/inventory-index.component';

@Component({
  selector: 'app-inventory-create-page',
  imports: [
    InventoryCreateComponent,
    ButtonBackComponent,
    HeadPageComponent,
    InventoryIndexComponent
  ],
  templateUrl: './inventory-create-page.component.html',
  styleUrl: './inventory-create-page.component.scss'
})
export class InventoryCreatePageComponent {

}

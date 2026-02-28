import { Component } from '@angular/core';
import { ShopifyOrderCreateComponent } from '../shopify-order-create/shopify-order-create.component';
import { HeadPageComponent } from "@shared/components/head-page/head-page.component";
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { faTruck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-shopify-order-create-page',
  imports: [
    ShopifyOrderCreateComponent,
    HeadPageComponent,
    ButtonBackComponent
  ],
  templateUrl: './shopify-order-create-page.component.html',
  styleUrl: './shopify-order-create-page.component.scss'
})
export class ShopifyOrderCreatePageComponent {

  faTruck = faTruck;
  
}

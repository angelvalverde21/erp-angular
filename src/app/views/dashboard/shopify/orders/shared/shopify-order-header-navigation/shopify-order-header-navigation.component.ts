import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseService } from 'src/app/views/base.service';

@Component({
  selector: 'app-shopify-order-header-navigation',
  imports: [
    RouterModule
  ],
  templateUrl: './shopify-order-header-navigation.component.html',
  styleUrl: './shopify-order-header-navigation.component.scss'
})
export class ShopifyOrderHeaderNavigationComponent {

    store: string = "";
  
    constructor(private _base: BaseService){
      this.store = this._base.storeName!;
    }

}

import { Component } from '@angular/core';
import { faArrowLeft, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { ButtonBackComponent } from '../../../../shared/components/buttons/button-back/button-back.component';
import { PurchaseOrderCreateComponent } from '../purchase-order-create/purchase-order-create.component';

@Component({
  selector: 'app-purchase-order-create-page',
  imports: [
    PurchaseOrderCreateComponent,
    HeadPageComponent,
    ButtonBackComponent
  ],
  templateUrl: './purchase-order-create-page.component.html',
  styleUrl: './purchase-order-create-page.component.scss'
})
export class PurchaseOrderCreatePageComponent {

  faCreditCard = faCreditCard;
  faArrowLeft = faArrowLeft;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
  ) {

  }

  receivePurchaseCreate(purchase_order: any) {
    if (purchase_order) {
      // this.router.navigate(['orders']);

      this._router.navigate(['../', purchase_order.id], { relativeTo: this._route })
        .then(() => {
          console.log('Nueva URL:', this._router.url);
        });

    }
  }

}

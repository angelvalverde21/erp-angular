import { Component } from '@angular/core';
import { faArrowLeft, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { PurchaseCreateComponent } from '../purchase-create/purchase-create.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { Router } from '@angular/router';
import { HeadPageComponent } from "../../../shared/components/head-page/head-page.component";
import { ButtonBackComponent } from '../../../shared/components/buttons/button-back/button-back.component';


@Component({
  selector: 'app-purchase-create-page',
  imports: [
    ButtonLinkComponent,
    PurchaseCreateComponent,
    HeadPageComponent,
    ButtonBackComponent
  ],
  templateUrl: './purchase-create-page.component.html',
  styleUrl: './purchase-create-page.component.scss'
})
export class PurchaseCreatePageComponent {

  faCreditCard = faCreditCard;
  faArrowLeft = faArrowLeft;

  constructor(private router: Router) {

  }

  receivePurchaseCreate(purchase: any) {
    this.router.navigate(['purchases']);
  }
  
}

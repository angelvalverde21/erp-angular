import { Component } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { PurchaseCreateComponent } from '../purchase-create/purchase-create.component';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-create-page',
  imports: [ButtonLinkComponent, PurchaseCreateComponent],
  templateUrl: './purchase-create-page.component.html',
  styleUrl: './purchase-create-page.component.scss'
})
export class PurchaseCreatePageComponent{


  faArrowLeft = faArrowLeft;

  constructor(private router: Router){
  
  }

  receivePurchaseCreate(purchase: any) {
    this.router.navigate(['purchases']);
  }
}

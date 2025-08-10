import { Component } from '@angular/core';
import { ProductCreateComponent } from '../product-create/product-create.component'
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-create-page',
  imports: [ProductCreateComponent, ButtonLinkComponent],
  templateUrl: './product-create-page.component.html',
  styleUrl: './product-create-page.component.scss'
})
export class ProductCreatePageComponent{

    faArrowLeft = faArrowLeft;

    constructor(private _router: Router){
    
    }

    receiveProductCreate(product: any){

      if(product){
        this._router.navigate(['/', 'products', product.id]);
      }

    }

}


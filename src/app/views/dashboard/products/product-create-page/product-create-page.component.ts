import { Component } from '@angular/core';
import { ProductCreateComponent } from '../product-create/product-create.component'
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { StoreService } from '../../../../core/services/store.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-create-page',
  imports: [ProductCreateComponent, ButtonLinkComponent],
  templateUrl: './product-create-page.component.html',
  styleUrl: './product-create-page.component.scss'
})
export class ProductCreatePageComponent{

    faArrowLeft = faArrowLeft;

    constructor(private _router: Router, private _store: StoreService, private _product: ProductService){
    
    }

    path(path: string[] = []){
      return this._product.base_path(path);
    }


    receiveProductCreate(product: any){

      if(product){

        this._router.navigate(this._product.base_path(product.id));
      }

    }

}


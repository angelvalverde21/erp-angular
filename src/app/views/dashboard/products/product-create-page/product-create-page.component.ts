import { Component } from '@angular/core';
import { ProductCreateComponent } from '../product-create/product-create.component'
import { ButtonBackComponent } from '../../../shared/components/buttons/button-back/button-back.component';
import { Router } from '@angular/router';
import { StoreService } from '../../../../core/services/store.service';
import { ProductService } from '../product.service';
import { Product } from '../../../../interfaces/product.interface'
import { HeadPageComponent } from "src/app/views/shared/components/head-page/head-page.component";

@Component({
  selector: 'app-product-create-page',
  imports: [ProductCreateComponent, ButtonBackComponent, HeadPageComponent],
  templateUrl: './product-create-page.component.html',
  styleUrl: './product-create-page.component.scss'
})
export class ProductCreatePageComponent{

    backPath: string[] = [];
    constructor(private _router: Router, private _store: StoreService, private _product: ProductService){
      this.backPath = this._product.base_path()
    }

    // path(path: string[] = []){
    //   return this._product.base_path(path);
    // }

    receiveProductCreate(product: Product){

      console.log(product);
      
      if(product){
        const slug = this._product.base_path([`${product.id}`]);
        console.log(slug);
        this._router.navigate(this._store.getLink(slug));
      }

    }

}


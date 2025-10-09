import { Component } from '@angular/core';
import { FormSearchComponent } from '../../shared/components/form/form-search/form-search.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../shared/services/common.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ProductListTemplateComponent } from '../../shared/templates/product-list-template/product-list-template.component';
import { ProductIndexComponent } from '../product-index-page/product-index/product-index.component';

// import { CardPlaceHolderComponent } from 'src/app/erp/shared/cards/card-place-holder/card-place-holder.component';

@Component({
  selector: 'app-product-search-page',
  imports: [
    FormSearchComponent, 
    LoadingComponent,
    CommonModule,
    ProductIndexComponent
    // CardPlaceHolderComponent
  ],
  templateUrl: './product-search-page.component.html',
  styleUrl: './product-search-page.component.scss'
})
export class ProductSearchPageComponent {

  search: string = "";
  loading: boolean = true;
  products: any[] = [];

  constructor(   
    private route: ActivatedRoute,
    private _product: ProductService,
    private _commom: CommonService
  ){

    this._commom.setIconLoading(true);

    this.route.params.subscribe((params) => {

      this.loading = true;
      console.log('se define el iconLoading en false');
      
      this._commom.setIconLoading(false);

      console.log('imprimiendo parametros from');
      console.log(params);
      this.search = params['search'];
      console.log(this.search);
      
      this._product.search(this.search).subscribe((resp:any) => {
        this.loading = false;
        this.products = resp.products;
        console.log(resp);
        
      });
      
    });
  }

}

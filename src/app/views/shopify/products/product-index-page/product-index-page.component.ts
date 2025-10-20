import { Component, OnDestroy, OnInit } from '@angular/core';
import { RowComponent, ColComponent } from '@coreui/angular';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

import { ProductService } from '../product.service';
// import { LoadingComponent } from '@shared/components/loading/loading.component';
// import { TemplateTableProductComponent } from '@shared/templates/product/template-table-product/template-table-product.component';
// import { FormSearchComponent } from '@shared/form/form-search/form-search.component';
// import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';

import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { FormSearchComponent } from '../../../shared/components/form/form-search/form-search.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { environment } from '../../../../core/environments/environment';
import { ProductListTemplateComponent } from '../../../shared/templates/product-list-template/product-list-template.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ProductIndexComponent } from './product-index/product-index.component';

@Component({
  selector: 'app-product-index-page',
  imports: [
    RowComponent,
    ColComponent,
    CommonModule,
    LoadingComponent,
    FormSearchComponent,
    ButtonLinkComponent,
    ProductListTemplateComponent,
    FontAwesomeModule,
    ProductIndexComponent,
    JsonPipe
  ],
  templateUrl: './product-index-page.component.html',
  styleUrl: './product-index-page.component.scss'
})
export class ProductIndexPageComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  products: any[] = [];
  base_path: string[] = [];
  thumbnail_temp: string = environment.imageThumbnailPlaceHolderVertical;

  faPlus = faPlus;
  createPath: any;

  constructor(private _product: ProductService, private _router: Router) {
    this.createPath = this._product.base_path(['create']);
  }


  // path(path: string[] = []){
  //   const slug = this._product.base_path(path);
  //   console.log(slug);

  //   return slug;
  // }

  ngOnInit(): void {

    console.log(this.createPath);

    // res.data.products.edges.map((edge: any) => edge.node);

    this._product.index().subscribe({

      next: (resp: any) => {
        console.log(resp);

        // this.products = resp.data.products.edges.map((edge: any) => {
        //   const product = edge.node;
        //   // Limpieza de variants: edges -> node
        //   product.variants = product.variants.edges.map((vEdge: any) => vEdge.node);
        //   return product;
        // });

        this.products = resp.products;

        console.log(this.products);

        this.loading = false;
      },

      error: (error: any) => {
        console.error(error);
        if (error.status === 401) {
          this._router.navigate(['/login']);
        }
      },

    });

  }

  create() {

  }

  ngOnDestroy(): void {

  }

  redirectToCreate() {
    console.log('redirectToCreate');
    this._router.navigate(['/create']);
  }


}

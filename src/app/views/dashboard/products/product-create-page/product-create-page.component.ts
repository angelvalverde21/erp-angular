import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductCreateComponent } from '../product-create/product-create.component'
import { ButtonBackComponent } from '../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from "../../../shared/components/head-page/head-page.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../../../../interfaces/product.interface'
import { StoreService } from '../../../stores/store.service';
import { BaseService } from '../../../base.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Category } from '../../../../interfaces/category.interface';
import { Brand } from '../../../../interfaces/brand.interface';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-product-create-page',
  imports: [
    ProductCreateComponent, 
    ButtonBackComponent, 
    HeadPageComponent,
    LoadingComponent
  ],
  templateUrl: './product-create-page.component.html',
  styleUrl: './product-create-page.component.scss'
})
export class ProductCreatePageComponent implements OnInit, OnDestroy {

  backPath: string[] = [];
  constructor(
    private _router: Router,
    private _product: ProductService,
    private _route: ActivatedRoute,
    private _store: StoreService,
    private _base: BaseService
  ) {
    this.backPath = this._product.base_path()
  }
  ngOnInit(): void {  
    this.productSetup();
  }

  // path(path: string[] = []){
  //   return this._product.base_path(path);
  // }

  receiveProductCreate(product: Product) {

    console.log(product);

    if (product) {
      this._router.navigate(['../', product.id], { relativeTo: this._route })
        .then(() => {
          console.log('Nueva URL:', this._router.url);
        });
    }

  }

  setupLoading: boolean = false;

  categories: Category[] = [];
  brands: Brand[] = [];

  productSetup() {

    this.setupLoading = true;

    this._store.get(this._base.store).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.categories = resp.data.categories;
        this.brands = resp.data.brands;
        this.setupLoading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al solicitar la informacion del producto. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}


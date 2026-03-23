import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductIndexComponent } from '../product-index/product-index.component';

import { faMagnifyingGlass, faFilter, faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../product.service'
import Swal from 'sweetalert2';
import { HeadPageComponent } from "@shared/components/head-page/head-page.component";
import { ButtonComponent } from "@shared/components/buttons/button/button.component";
import { ButtonLinkComponent } from "@shared/components/buttons/button-link/button-link.component";
import { Product } from '../../../../interfaces/product.interface';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { HeadTableComponent } from '@shared/components/head-table/head-table.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-index-page',
  imports: [
    ProductIndexComponent,
    ButtonComponent,
    FontAwesomeModule,
    ButtonLinkComponent,
    HeadPageComponent,
    LoadingComponent,
    HeadTableComponent
  ],

  templateUrl: './product-index-page.component.html',
  styleUrl: './product-index-page.component.scss'
})
export class ProductIndexPageComponent implements OnInit, OnDestroy {


  products: Product[] = [];

  loading: boolean = false;


  constructor(
    private _product: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.productsInit();
  }

  productsInit() {

    this._product.index(this.page).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.products = [...this.products, ...resp.data];
        this.loading = false;
        this.loadingMore = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los productos. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  faTag = faTag;

  page: number = 1;
  loadingMore: boolean = false;

  loadMoreProducts() {

    this.page++;
    this.loadingMore = true;
    console.log("Cargando más productos...");
    this.productsInit();

    // this.loading = true;    
    // 
  }

  receiveSearchResult($event: any) {
  }

  receiveParams($event: any) {
    this.router.navigate(['search'], {
      relativeTo: this.route,
      queryParams: $event  // 👈 Angular convierte cada propiedad del objeto en un query param
    }).then(() => {
      console.log('Nueva URL:', this.router.url);
    });
  }

}

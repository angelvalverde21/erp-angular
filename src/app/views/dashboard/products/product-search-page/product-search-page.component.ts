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
  selector: 'app-product-search-page',
  imports: [
    ProductIndexComponent,
    ButtonComponent,
    FontAwesomeModule,
    ButtonLinkComponent,
    HeadPageComponent,
    LoadingComponent,
    HeadTableComponent
  ],
  templateUrl: './product-search-page.component.html',
  styleUrl: './product-search-page.component.scss'
})
export class ProductSearchPageComponent implements OnInit, OnDestroy {

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  faTag = faTag;

  params: any = {};

  constructor(
    private _product: ProductService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });
  }


  products: any[] = [];
  loading: boolean = false;

  ngOnInit() {
    this.initSearch();
  }

  initSearch() {
    this.loading = true;

    this._product.search(this.params).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.products = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveParams($event: any) {
    this.params = $event;
    this.initSearch();
  }

}

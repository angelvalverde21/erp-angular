import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { faMagnifyingGlass, faFilter, faRotate } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ButtonComponent } from '../../../../../shared/components/buttons/button/button.component';
// import { ShopifyProductService } from '../shopify.product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-order-head-table',
  imports: [
    ButtonComponent,
    CommonModule
  ],
  templateUrl: './purchase-order-head-table.component.html',
  styleUrl: './purchase-order-head-table.component.scss'
})
export class PurchaseOrderHeadTableComponent {
  showSearch: boolean = false;
  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  faRotate = faRotate;

  destroy$ = new Subject<void>();

  @Output() emitSearchResult = new EventEmitter<any>();
  @Output() emitStatusProductsSync = new EventEmitter<boolean>();
  @Input() status: string = ''; //Solo el componente padre debe recibir los gets y repartircelos a sus hijos



  private searchSubject = new Subject<string>();

  constructor(
    // private _shopify_product: ShopifyProductService,
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit() {
    this.searchWithDebounce(500);
  }

  searchWithDebounce(time: number) {

    this.searchSubject
      .pipe(
        debounceTime(time),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {

        // this._shopify_product.search(term).subscribe({

        //   next: (resp: any) => this.emitSearchResult.emit(resp.data),
        //   error: () =>
        //     Swal.fire('Error', `Problema al buscar el término: ${term}`, 'error')

        // });

      });
  }

  goToStatus(status: string) {
    this.router.navigate(
      [], // misma ruta
      {
        relativeTo: this.route,
        queryParams: {
          status: status || null,
          page: 1 // ✅ recomendado: resetear página
        },
        queryParamsHandling: 'merge'
      }
    );
  }

  fnShowSearch() { //funcion que activa o desactiva el input de busqueda
    this.showSearch = !this.showSearch;

    //Da el focus apenas se abra el input de busqueda
    if (this.showSearch) {
      setTimeout(() => {
        const input = document.querySelector('input[placeholder="Buscar"]') as HTMLInputElement;
        input?.focus();
      });
    }
  }

  fnSearch(event: any) { //funcion que emite el termino de busqueda al componente padre
    const term = event.target.value;
    this.searchSubject.next(term);
  }


  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  sync() {

    Swal.fire({
      title: 'Espere...',
      html: 'Sincronizando productos de shopify...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })


    // this._shopify_product.syncProducts().subscribe({
    //   next: (resp: any) => {
    //     console.log(resp);

    //     this.emitStatusProductsSync.emit(true);

    //     Swal.fire('Éxito', 'Productos sincronizados correctamente.', 'success');
    //     Swal.close();
    //   },
    //   error: () => {
    //     Swal.fire('Error', 'Hubo un problema al sincronizar los productos.', 'error');
    //   }
    // });

  }
}

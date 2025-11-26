import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ButtonComponent } from '../../../../../shared/components/buttons/button/button.component';
import { ShopifyProductService } from '../../shopify.product.service';

@Component({
  selector: 'app-product-head-table',
  imports: [
    ButtonComponent
  ],
  templateUrl: './product-head-table.component.html',
  styleUrl: './product-head-table.component.scss'
})
export class ProductHeadTableComponent implements OnInit, OnDestroy {

  showSearch: boolean = false;
  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;

  @Output() emitSearchResult = new EventEmitter<any>();

  private searchSubject = new Subject<string>();

  constructor(
    private _shopify_product: ShopifyProductService
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

        this._shopify_product.search(term).subscribe({

          next: (resp: any) => this.emitSearchResult.emit(resp.data),
          error: () =>
            Swal.fire('Error', `Problema al buscar el término: ${term}`, 'error')

        });

      });
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

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}

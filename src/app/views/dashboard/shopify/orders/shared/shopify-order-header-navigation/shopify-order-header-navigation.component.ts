import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ShopifyOrderService } from '../../shopify.order.service';
import { ButtonComponent } from '../../../../../shared/components/buttons/button/button.component';
import { BaseService } from '../../../../../base.service';

@Component({
  selector: 'app-shopify-order-header-navigation',
  imports: [
    RouterModule,
    ButtonComponent
  ],
  templateUrl: './shopify-order-header-navigation.component.html',
  styleUrl: './shopify-order-header-navigation.component.scss'
})
export class ShopifyOrderHeaderNavigationComponent implements OnInit, OnDestroy {

  store: string = "";

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  showSearch: boolean = false;
  @Output() emitSearchResult = new EventEmitter<any>();

  constructor(
    private _base: BaseService,
    private _shopify_order: ShopifyOrderService,
  ) {
    this.store = this._base.storeName!;
  }


  destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

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

        this._shopify_order.search(term).subscribe({

          next: (resp: any) => this.emitSearchResult.emit(resp),
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


}

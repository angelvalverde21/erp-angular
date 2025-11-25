import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Customerservice } from '../../users/customers/Customer.service';
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { SupplierService } from '../../users/suppliers/supplier.service';
import { EmployeeService } from '../../users/employees/employee.service';
import { ShopifyProductService } from '../../shopify/products/shopify.product.service';

@Component({
  selector: 'app-user-head-table',
  imports: [
    ButtonComponent
  ],
  templateUrl: './user-head-table.component.html',
  styleUrl: './user-head-table.component.scss'
})
export class UserHeadTableComponent implements OnInit, OnDestroy {

  showSearch: boolean = false;
  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;

  @Input() type: 'customer' | 'supplier' | 'employee' | 'shopify_product' = 'customer';
  @Output() emitSearchResult = new EventEmitter<any>();

  private searchSubject = new Subject<string>();

  constructor(
    private _customer: Customerservice,
    private _supplier: SupplierService,
    private _employee: EmployeeService,
    private _shopify_product: ShopifyProductService
  ) { }

  ngOnInit() {
    this.searchWithDebounce(500);
  }

  private getService() {
    switch (this.type) {
      case 'supplier': return this._supplier;
      case 'employee': return this._employee;
      case 'shopify_product': return this._employee;
      default: return this._customer;
    }
  }


  searchWithDebounce(time: number) {

    this.searchSubject
      .pipe(
        debounceTime(time),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {

        const service = this.getService();

        service.search(term).subscribe({

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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { CustomerService } from '../../customers/customer.service';
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { SupplierService } from '../../suppliers/supplier.service';
import { EmployeeService } from '../../employees/employee.service';
import { ShopifyProductService } from '../../../shopify/products/shopify.product.service';
import { CourierService } from '../../couriers/courier.service';
import { ManufactureService } from '../../../manufactures/manufacture.service';
import { GatewayService } from '../../../gateways/gateway.service';
import { ManufactureOrderService } from '../../../manufactures/orders/order.service';
import { ManufactureProductionService } from '../../../manufactures/productions/production.service';

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

  @Input() type: 'customer' | 'courier' | 'gateway' | 'petty_cash' | 'supplier' | 'employee' | 'shopify_product' | 'manufacture_production' | 'manufacture_order' |  'manufacture' = 'customer'; //Type por defecto es customer en caso no se le pase nada
  @Input() button_active: boolean = true;
  @Output() emitSearchResult = new EventEmitter<any>();

  private searchSubject = new Subject<string>();

  constructor(
    private _customer: CustomerService,
    private _supplier: SupplierService,
    private _employee: EmployeeService,
    private _courier: CourierService,
    private _manufacture: ManufactureService,
    private _manufacture_order: ManufactureOrderService,
    private _manufacture_production: ManufactureProductionService,
    private _shopify_product: ShopifyProductService,
    private _gateway: GatewayService
  ) { }

  ngOnInit() {
    this.searchWithDebounce(500);
  }

  private getService() {
    switch (this.type) {
      case 'supplier': return this._supplier;
      case 'employee': return this._employee;
      case 'courier': return this._courier;
      case 'manufacture': return this._manufacture;
      case 'shopify_product': return this._shopify_product;
      case 'gateway': return this._gateway;
      case 'manufacture_order': return this._manufacture_order;
      case 'manufacture_production': return this._manufacture_production;
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

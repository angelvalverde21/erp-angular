import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { CustomerService } from '@dashboard/users/customers/customer.service';
// import { CustomerService } from '@dashboard/users/customers/customer.service';
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ButtonComponent } from '@components/buttons/button/button.component';
import { SupplierService } from '@dashboard/users/suppliers/supplier.service';
import { EmployeeService } from '@dashboard/users/employees/employee.service';
import { ShopifyProductService } from '@dashboard/shopify/products/shopify.product.service';
import { CourierService } from '@dashboard/users/couriers/courier.service';
import { ManufactureService } from '@dashboard/manufactures/manufacture.service';
import { GatewayService } from '@dashboard/gateways/gateway.service';
import { ManufactureOrderService } from '@dashboard/manufactures/orders/order.service';
import { ManufactureProductionService } from '@dashboard/manufactures/productions/production.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ProductService } from '@dashboard/products/product.service';

@Component({
  selector: 'app-head-table',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './head-table.component.html',
  styleUrl: './head-table.component.scss'
})
export class HeadTableComponent implements OnInit, OnDestroy {

  showSearch: boolean = false;
  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;

  @Input() type:
    | 'customer'
    | 'courier'
    | 'gateway'
    | 'petty_cash'
    | 'product'
    | 'supplier'
    | 'employee'
    | 'shopify_product'
    | 'manufacture_production'
    | 'manufacture_order'
    | 'manufacture'
    = 'customer';

  @Input() button_active: boolean = true;
  @Output() emitSearchResult = new EventEmitter<any>();
  @Output() emitParams = new EventEmitter<{}>();

  private searchSubject = new Subject<string>();

  form!: FormGroup;

  constructor(
    private _customer: CustomerService,
    private _supplier: SupplierService,
    private _employee: EmployeeService,
    private _courier: CourierService,
    private _manufacture: ManufactureService,
    private _manufacture_order: ManufactureOrderService,
    private _manufacture_production: ManufactureProductionService,
    private _shopify_product: ShopifyProductService,
    private _gateway: GatewayService,
    private _product: ProductService,
    private fb: FormBuilder
  ) { }


  formInit() {


    const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD


    this.form = this.fb.group({
      search: ['', Validators.required],
      start_date: [null],
      end_date: [today],
    });

  }

  // ngOnInit() {

  //   this.formInit();

  //   this.form.valueChanges
  //     .pipe(
  //       debounceTime(500),
  //       switchMap(values => {

  //         if (!values.search?.trim() && !values.start_date && !values.end_date) {
  //           return [];
  //         }

  //         return this.getService().search(values);

  //       }),
  //       takeUntil(this.destroy$)
  //     )
  //     .subscribe(resp => {
  //       // this.emitSearchResult.emit(resp?.data ?? []);
  //     });

  // }


  ngOnInit() {

    this.formInit();

    // this.form.valueChanges
    //   .pipe(
    //     debounceTime(500),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(resp => {

    //   });

  }

  search() {
    this.emitParams.emit(this.form.value);
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
      case 'product': return this._product;
      default: return this._customer;
    }
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


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  fnHideSearch() {
    console.log("blur");
    if (this.form.get('search')?.value === "") {
      this.showSearch = false;
    }
  }
}

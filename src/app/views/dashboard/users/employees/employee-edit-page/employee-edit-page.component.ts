import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from "@shared/components/head-page/head-page.component";
import { Subject, switchMap, takeUntil } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RoleService } from '../../../roles/role.service';
import { HeadTableComponent } from '@shared/components/head-table/head-table.component';
import { OrderIndexComponent } from '../../../orders/order-index/order-index.component';
import { faCalculator, faChartLine, faInbox } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { VoidIndexComponent } from 'src/app/views/shared/components/void-index/void-index.component';
import { PenPipe } from '@shared/pipes/pen.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-edit-page',
  imports: [
    LoadingComponent,
    EmployeeEditComponent,
    HeadPageComponent,
    ButtonBackComponent,
    HeadTableComponent,
    OrderIndexComponent,
    ButtonComponent,
    NgbAccordionModule,
    VoidIndexComponent,
    PenPipe,
    FontAwesomeModule,
    CommonModule
  ],
  templateUrl: './employee-edit-page.component.html',
  styleUrl: './employee-edit-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EmployeeEditPageComponent implements OnInit, OnDestroy {

  is_sales: boolean = false;
  roles: any[] = [];
  loading: boolean = false;
  employee_id: number = 0
  employee: any;

  faCalculator = faCalculator;
  faChartLine = faChartLine;
  faInbox = faInbox;

  constructor(
    private _employee: EmployeeService,
    private route: ActivatedRoute,
    private _role: RoleService,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    this.route.params.subscribe(params => {
      this.employee_id = params['employee_id'];
    });

    config.backdrop = 'static';
    config.keyboard = false;
  }

  modal: any;

  ngOnInit(): void {

    this.employeeInit();
    this.rolesInit();

  }

  orders: any[] = [];

  loadingOrders: boolean = false;

  employeeInit() {

    this.loading = true;

    this._employee.get(this.employee_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        this.employee = resp.data;
        this.is_sales = this.employee.user.roles.includes('sales');
        this.loading = false
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los datos del empleado. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  roles_loading: boolean = false;

  rolesInit() {

    this.roles_loading = true;
    this._role.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.roles = resp.data;
        this.roles_loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al listar los roles del sistema', 'error');
        console.error(error);
      },

    });


  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveParams(event: any) {

    event = {
      ...event,
      tag_sales: this.employee.tag_sales
    }

    console.log(event);

    this.loadingOrders = true;

    Swal.fire({
      title: 'Espere...',
      html: 'Generando reporte de ventas',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._employee.ordersSearch(this.employee_id, event).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        Swal.close();
        console.log(resp);
        this.orders = resp.items;

        this.pricesFinal = this.getPricesFinal(this.orders);
        this.pricesLabel = this.sumPricesLabel(this.orders);
        this.discount = this.getDiscount();
        this.shippingTotal = this.sumShippingPrices(this.orders);
        this.commission = this.getCommission();

        this.loadingOrders = false;
      },

      error: (error: any) => {
        this.loadingOrders = false;
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }

  closeModal() {
    this.modal.close();
  }

  //calculos

  sumPriceLabel(order: any): number {
    return (order?.lineItems ?? []).reduce(
      (acc: number, item: any) =>
        acc + Number(item?.variant?.price ?? 0),
      0
    );
  }

  sumPricesLabel(orders: any[]): number {
    return orders.reduce((acc, order) => acc + this.sumPriceLabel(order), 0);
  }

  // El precio final es el que se le cobra al cliente, el cual puede ser diferente al precio de los productos debido a descuentos, impuestos, etc.


  sumShippingPrice(order: any): number {

    const price = order?.totalShippingPriceSet?.shopMoney?.amount ?? 0
    console.log(price);
    return price;
  }

  sumShippingPrices(orders: any[]): number {
    const final = orders.reduce((acc: number, order) => acc + Number(this.sumShippingPrice(order)), 0);
    console.log(final);
    return final;
  }

  getPriceFinal(order: any): number {

    const price = order?.totalPriceSet?.shopMoney?.amount ?? 0
    // console.log(price);

    return price;
  }


  getPricesFinal(orders: any[]): number {
    return orders.reduce((acc: number, order) => acc + Number(this.getPriceFinal(order)) - this.sumShippingPrice(order), 0);
  }

  //Descuentos

  getDiscount() {
    return this.getPricesFinal(this.orders) - this.sumPricesLabel(this.orders);
  }

  //Comisiones del vendedor

  getCommission() {
    return this.getPricesFinal(this.orders) * (Number(this.employee.comission) / 100);
  }

  pricesFinal: number = 0;
  pricesLabel: number = 0;
  discount: number = 0;
  commission: number = 0;
  shippingTotal: number = 0;

}

import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ManufactureEditComponent } from '../../manufacture-edit/manufacture-edit.component';
import { HeadPageComponent } from '@components/head-page/head-page.component';
import { ButtonLinkComponent } from '@buttons/button-link/button-link.component';
import { ManufactureService } from '../../manufacture.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PurchaseIndexComponent } from '../../../purchases/purchase-index/purchase-index.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseCreateComponent } from '../../../purchases/purchase-create/purchase-create.component';
import { faBarcode, faBoxArchive, faBagShopping, faMoneyBill1, faCommentDollar, faCreditCard, faRightLeft, faMinus, faUser } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '@components/form/input-group/input-group.component';
import { VariantSearchComponent } from '../../../products/variants/variant-search/variant-search.component';
import { ManufactureVariantService } from '../../variants/manufactureVariant.service';
import { ManufactureVariantIndexComponent } from '../../variants/manufacture-variant-index/manufacture-variant-index.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonAddComponent } from '@buttons/button-add/button-add.component';
import { ManufactureWidgetsComponent } from '../../shared/manufacture-widgets/manufacture-widgets.component';
import { WidgetManufacture } from 'src/app/interfaces/widgetManufacture';
import { PaymentIndexComponent } from '../../../payments/payment-index/payment-index.component';
import { KardexIndexComponent } from '../../../kardex/kardex-index/kardex-index.component';
import { VariantIndexComponent } from '../../../products/variants/variant-index/variant-index.component';
// import { PaymentIndexComponent } from '../../payments/payment-edit/payment-index/payment-index.component';
import { KardexRegisterInComponent } from '../../../kardex/kardex-register-in/kardex-register-in.component';
import { KardexRegisterReInComponent } from '../../../kardex/kardex-register-re-in/kardex-register-re-in.component';
import { KardexRegisterOutComponent } from '../../../kardex/kardex-register-out/kardex-register-out.component';
import { ButtonTrashComponent } from '@buttons/button-trash/button-trash.component';
import { WidgetCostComponent } from '../../shared/widgets/widget-cost/widget-cost.component';
import { WidgetProductsComponent } from '../../shared/widgets/widget-products/widget-products.component';
import { WidgetPurchasesComponent } from '../../shared/widgets/widget-purchases/widget-purchases.component';
import { WidgetReceptionsComponent } from '../../shared/widgets/widget-receptions/widget-receptions.component';
import { KardexService } from '../../../kardex/kardex.service';
import { ManufactureProductionService } from '../../productions/production.service';
import { ManufactureOrderService } from '../order.service';
// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-edit-page',
  imports: [
    ManufactureEditComponent,
    LoadingComponent,
    HeadPageComponent,
    ButtonLinkComponent,
    PurchaseIndexComponent,
    PurchaseCreateComponent,
    InputGroupComponent,
    VariantSearchComponent,
    ManufactureVariantIndexComponent,
    NgbAccordionModule,
    FontAwesomeModule,
    ButtonAddComponent,
    ManufactureWidgetsComponent,
    PaymentIndexComponent,
    KardexIndexComponent,
    VariantIndexComponent,
    KardexRegisterInComponent,
    KardexRegisterReInComponent,
    KardexRegisterOutComponent,
    ButtonTrashComponent,
    WidgetCostComponent,
    WidgetProductsComponent,
    WidgetPurchasesComponent,
    WidgetReceptionsComponent,
    // NgbDropdownModule
  ],
  templateUrl: './order-edit-page.component.html',
  styleUrl: './order-edit-page.component.scss',
  encapsulation: ViewEncapsulation.None

})

export class OrderEditPageComponent implements OnInit, OnDestroy {


  loading: boolean = false;
  manufacture: any = null;
  manufacture_id: number = 0;
  purchases: any;
  variants: any;

  widget: WidgetManufacture = {
    cost: 0,
    quantity_total: 0,
    purchase_total: 0,
    quantity_received: 0,
    progress: 0
  };

  widget_summary: any = {
    cost: 0,
    sum_products: 0,
    sum_purchases: 0,
    reception: 0
  };

  faBoxArchive = faBoxArchive;
  faBagShopping = faBagShopping;
  faBarcode = faBarcode;
  faMoneyBill1 = faMoneyBill1;
  faCommentDollar = faCommentDollar;
  faCreditCard = faCreditCard;
  faRightLeft = faRightLeft;
  faMinus = faMinus;
  faUser = faUser;

  modal: any;
  manufacture_variants: any;


  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _manufactureOrder: ManufactureOrderService,
    private route: ActivatedRoute,
    private _kardex: KardexService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.route.params.subscribe(params => {
      this.manufacture_id = params['order_id'];
    });

  }

  ngOnInit(): void {

    this.manufactureInit();

  }

  kardex_summary: any;

  manufactureInit() {

    this.loading = true;

    this._manufactureOrder.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        this.manufacture = resp.data;
        this.manufacture_variants = resp.data.manufacture_variants;
        this.purchases = resp.data.purchases;
        console.log(this.manufacture_variants);

        this.variants = this.manufacture_variants.map((mv: any) => mv.variant);



        this.kardexes = resp.data.kardexes;

        this.kardex_summary = this._kardex.calculate(this.kardexes);

        this.widget_summary = {
          cost: (resp.data.quantity_total > 0) ? resp.data.purchase_total / resp.data.quantity_total : 0,
          sum_products: resp.data.quantity_total ? resp.data.quantity_total : 0,
          sum_purchases: resp.data.purchase_total ? resp.data.purchase_total : 0,
          reception: this.kardex_summary.reception
        };

        this.loading = false;

        // this.calculeCost();
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema guardar. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  // calculeCost() {
  //   this.total_cost = Math.round(this.total_purchases_amount / this.total_products * 100) / 100;
  // }


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  kardexes: any[] = [];

  closeModal() {
    this.modal.close();
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }




  selected_variants: any = {};

  buttonDisabled: boolean = true;

  receiveSelectedVariants(variants: any) {

    console.log("Selected variants:", variants);
    this.selected_variants = variants;

    if (Object.keys(variants).length > 0) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }

  }

  addVariants() {
    if (this.buttonDisabled) {
      return;
    } else {
      console.log("Adding variants:", this.selected_variants);
      // this.emitVariantsSelected.emit(this.selected_variants);
    }
  }


  calculateTotalReceptions() {
    this.total_receptions = this.kardexes.reduce((acc, kardex) => acc + kardex.quantity * (kardex?.direction === 'in' ? 1 : -1), 0);
  }


  receiveKardexes(event: any) {

    this.kardexes = [...this.kardexes, ...event];

    this.kardex_summary = this._kardex.calculate(this.kardexes);

    Swal.close();
    this.closeModal();

  }


  //Data para los widgets

  total_products: number = 0;
  total_purchases_amount: number = 0;
  total_receptions: number = 0;

  receiveSumManufactureVariant(sum_products: number) {

    console.log("received total products:", sum_products);


    this.widget_summary = {
      ...this.widget_summary,
      cost: this.widget_summary.sum_purchases / sum_products,
      sum_products: sum_products,
    };

    // this.widget.progress = this.widget.quantity_received / this.widget.quantity_total * 100;
  }

  receiveSumPurchaseIndex(sum_purchases: number) {

    this.widget_summary = {
      ...this.widget_summary,
      sum_purchases: sum_purchases,
      cost: sum_purchases / this.widget_summary.sum_products,
    };

  }

  // receiveSumReceptionIndex(total: number){
  //   this.total_receptions = total;
  // }

  saldo: number = 0;
  total_cost: number = 0;

  receiveKardexSummary(kardex_summary: any) {
    console.log("Received kardex summary:", kardex_summary);

    this.kardex_summary = kardex_summary;
  }

}
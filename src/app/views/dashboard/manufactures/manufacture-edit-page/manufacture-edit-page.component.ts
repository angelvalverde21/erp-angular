import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ManufactureEditComponent } from '../manufacture-edit/manufacture-edit.component';
import { HeadPageComponent } from '../../../shared/components/head-page/head-page.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { ManufactureService } from '../manufacture.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PurchaseIndexComponent } from '../../purchases/purchase-index/purchase-index.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseCreateComponent } from '../../purchases/purchase-create/purchase-create.component';
import { faBarcode, faBoxArchive, faBagShopping, faMoneyBill1, faCommentDollar, faCreditCard, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { VariantSearchComponent } from '../../products/variants/variant-search/variant-search.component';
import { ManufactureVariantService } from '../variants/manufactureVariant.service';
import { ManufactureVariantIndexComponent } from '../variants/manufacture-variant-index/manufacture-variant-index.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonAddComponent } from 'src/app/views/shared/components/buttons/button-add/button-add.component';
import { ManufactureWidgetsComponent } from '../shared/manufacture-widgets/manufacture-widgets.component';
import { WidgetManufacture } from 'src/app/interfaces/widgetManufacture';
import { PaymentIndexComponent } from '../../payments/payment-index/payment-index.component';
// import { PaymentIndexComponent } from '../../payments/payment-edit/payment-index/payment-index.component';

@Component({
  selector: 'app-manufacture-edit-page',
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
    PaymentIndexComponent
  ],
  templateUrl: './manufacture-edit-page.component.html',
  styleUrl: './manufacture-edit-page.component.scss',
  encapsulation: ViewEncapsulation.None

})

export class ManufactureEditPageComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  manufacture: any = null;
  manufacture_id: number = 0;
  purchases: any;

  widget: WidgetManufacture = {
    cost: 0,
    quantity_total: 0,
    purchase_total: 0,
    quantity_received: 0,
    progress: 0
  };

  faBoxArchive = faBoxArchive;
  faBagShopping = faBagShopping;
  faBarcode = faBarcode;
  faMoneyBill1 = faMoneyBill1;
  faCommentDollar = faCommentDollar;
  faCreditCard = faCreditCard;
  faRightLeft = faRightLeft;
  
  modal: any;
  manufacture_variants: any;


  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _manufacture: ManufactureService,
    private route: ActivatedRoute,
    private _manufactureVariant: ManufactureVariantService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.route.params.subscribe(params => {
      this.manufacture_id = params['manufacture_id'];
    });

  }
  ngOnInit(): void {
    this.manufactureInit();
  }

  manufactureInit() {

    this.loading = true;

    this._manufacture.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        this.manufacture = resp.data;
        this.manufacture_variants = resp.data.manufacture_variants;
        this.purchases = resp.data.purchases;
        console.log(this.manufacture_variants);

        this.widget.quantity_total = resp.data.quantity_total;
        this.widget.purchase_total = resp.data.purchase_total;

        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema guardar. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  closeModal() {
    this.modal.close();
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }


  receiveSelectedVariants(variants: any) {

    this.modal.close();

    console.log("Received variants in manufacture edit page:", variants);

    Swal.fire({
      title: 'Espere...',
      html: 'Mientras agregamos sus variantes',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._manufactureVariant.batch(this.manufacture.id, variants).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'Las variantes han sido agregadas', 'success');
        console.log(resp);
        this.manufacture_variants = [...this.manufacture_variants, ...resp.data];
        this.loading = false;
        this.modal.close();
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al insertar los registros. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  receivePurchaseCreate(purchase: any) {

    this.purchases = [purchase, ...this.purchases];

    this.modal.close();

  }
}



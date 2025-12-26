
import { faArrowLeft, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { ButtonBackComponent } from '../../../../shared/components/buttons/button-back/button-back.component';
import { PurchaseOrderEditComponent } from '../purchase-order-edit/purchase-order-edit.component';
import { PurchaseCreateComponent } from '../../purchase-create/purchase-create.component';
import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseOrderService } from '../purchase_order.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { InputGroupComponent } from '../../../../shared/components/form/input-group/input-group.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-purchase-order-edit-page',
  imports: [
    HeadPageComponent,
    PurchaseOrderEditComponent,
    ButtonBackComponent,
    PurchaseCreateComponent,
    LoadingComponent,
    InputGroupComponent,
    CommonModule
  ],
  templateUrl: './purchase-order-edit-page.component.html',
  styleUrl: './purchase-order-edit-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PurchaseOrderEditPageComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();
  modal: any;


  faCreditCard = faCreditCard;
  faArrowLeft = faArrowLeft;

  purchase_order_id: number = 0;
  // faPenToSquare = faPenToSquare;

  constructor(
    private route: ActivatedRoute,
    private _purchase_order: PurchaseOrderService,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.route.params.subscribe((params) => {
      this.purchase_order_id = params['purchase_order_id'];
    });

  }

  purchase_order: any;

  loading: boolean = false;

  ngOnInit(): void {

    this.purchaseOrderInit();
  }

  purchaseOrderInit() {

    this.loading = true;

    this._purchase_order.get(this.purchase_order_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp.data);
        this.purchase_order = resp.data;
        //  console.log(this.purchase.category);
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los datos de la orden de compra.', 'error');
        console.error(error);
        this.loading = false;
      },

    });

  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }


  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }


  closeModal() {
    this.modal.close();
  }

  formActive: boolean = true;

}



import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { faEdit, faTrash, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DateShopifyPipe } from '../../../shared/pipes/date-shopify.pipe';
import { PaymentEditComponent } from '../payment-edit/payment-edit.component';
import { Subject, takeUntil } from 'rxjs';
import { PaymentService } from '../payment.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PurchaseCardComponent } from '../../purchases/purchase-card/purchase-card.component';
import { ButtonEditComponent } from 'src/app/views/shared/components/buttons/button-edit/button-edit.component';
@Component({
  selector: 'tr[app-payment-index-row]',
  imports: [
    ButtonComponent,
    CurrencyPipe,
    DateShopifyPipe,
    PaymentEditComponent,
    LoadingComponent,
    FontAwesomeModule,
    PurchaseCardComponent,
    CommonModule,
    ButtonEditComponent
  ],
  templateUrl: './payment-index-row.component.html',
  styleUrl: './payment-index-row.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PaymentIndexRowComponent {

  faEdit = faEdit;
  faTrash = faTrash;
  faReceipt = faReceipt;

  @Input() payment: any;
  @Input() paymentable_type: string = "";
  @Input() paymentable_id: number = 0;
  @Input() edit: boolean = true;

  removeLoading: boolean = false;

  @Output() emitRemovePayment = new EventEmitter<any>();


  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _paymentService: PaymentService
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  receiveUpdatePayment(event: any) {
    this.payment = event;
    this.modal.close();
  }

  removePayment(payment_id: number = 0) {

    this.removeLoading = true;
    this._paymentService.destroy(payment_id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        this.removeLoading = false;
        this.payment = resp.data;
        this.emitRemovePayment.emit(this.payment);
      },
      error: (error: any) => {
        console.error(error);
        this.removeLoading = false;
      }
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

}


import { Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PaymentIndexRowComponent } from '../payment-index-row/payment-index-row.component';
import { ButtonAddComponent } from 'src/app/views/shared/components/buttons/button-add/button-add.component';
import { PaymentCreateComponent } from '../payment-create/payment-create.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoneyBill1 } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-index',
  imports: [
    PaymentIndexRowComponent,
    ButtonAddComponent,
    PaymentCreateComponent,
    FontAwesomeModule,
    CommonModule
  ],
  templateUrl: './payment-index.component.html',
  styleUrl: './payment-index.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PaymentIndexComponent implements OnChanges{

  @Input() paymentable_type: string = "";
  @Input() paymentable_id: number = 0;

  @Input() payments: any[] = [];
  faMoneyBill1 = faMoneyBill1;
  modal: any;

  sum_payments: number = 0;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payments']) {
      this.sum_payments = this.payments.reduce((acc, payment) => acc + Number(payment.amount), 0);
    }
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  closeModal() {
    this.modal.close();
  }

  receiveCreatePayment(event: any) {
    this.payments.unshift(event);
    this.closeModal();
  }

  receiveRemovePayment(payment: any) {
    this.payments = this.payments.filter((p: any) => p.id !== payment.id);
  }

}
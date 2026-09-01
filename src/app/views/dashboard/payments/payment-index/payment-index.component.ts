
import { Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PaymentIndexRowComponent } from '../payment-index-row/payment-index-row.component';
import { ButtonAddComponent } from 'src/app/views/shared/components/buttons/button-add/button-add.component';
import { PaymentCreateComponent } from '../payment-create/payment-create.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoneyBill1 } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { VoidIndexComponent } from 'src/app/views/shared/components/void-index/void-index.component';

@Component({
  selector: 'app-payment-index',
  imports: [
    PaymentIndexRowComponent,
    ButtonAddComponent,
    PaymentCreateComponent,
    FontAwesomeModule,
    CommonModule,
    VoidIndexComponent
  ],
  templateUrl: './payment-index.component.html',
  styleUrl: './payment-index.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PaymentIndexComponent implements OnChanges {

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
      
      // Asegurar que siempre sea un array
      const paymentsArray = Array.isArray(this.payments) ? this.payments : [];
      
      // Normalizar la propiedad
      this.payments = paymentsArray;
      
      console.log(this.payments);
      // Calcular suma
      this.sum_payments = paymentsArray.reduce(
        (acc: number, payment: any) => acc + Number(payment?.amount * (payment?.direction === 'in' ? 1 : -1) || 0),
        0
      );
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
import { Component, EventEmitter, Input, OnChanges, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentIndexRowComponent } from '../payment-index-row/payment-index-row.component';
import { PaymentCreateComponent } from '../payment-create/payment-create.component';

@Component({
  selector: 'app-payment-index', imports: [CurrencyPipe, PaymentIndexRowComponent, PaymentCreateComponent],
  templateUrl: './payment-index.component.html', styleUrl: './payment-index.component.scss', encapsulation: ViewEncapsulation.None,
})
export class PaymentIndexComponent implements OnChanges {
  @Input() paymentable_type = '';
  @Input() paymentable_id = 0;
  @Input() payments: any[] = [];
  @Input() title = 'Pagos y movimientos';
  @Output() paymentsChange = new EventEmitter<any[]>();
  modal?: NgbModalRef;
  creating = false;
  sum_payments = 0;
  constructor(config: NgbModalConfig, private modalService: NgbModal) { config.backdrop = 'static'; config.keyboard = false; }
  ngOnChanges(): void { this.payments = Array.isArray(this.payments) ? this.payments : []; this.calculate(); }
  private calculate(): void {
    this.sum_payments = this.payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0) * (payment.direction === 'in' ? 1 : -1), 0);
  }
  private publish(): void { this.calculate(); this.paymentsChange.emit(this.payments); }
  openVerticallyCentered(content: TemplateRef<any>): void { this.modal = this.modalService.open(content, { centered: true, size: 'lg', scrollable: true }); }
  closeModal(): void { this.modal?.close(); }
  receiveCreatePayment(payment: any): void { this.payments = [payment, ...this.payments]; this.publish(); this.closeModal(); }
  receiveUpdatePayment(payment: any): void { this.payments = this.payments.map(item => item.id === payment.id ? payment : item); this.publish(); }
  receiveRemovePayment(payment: any): void { this.payments = this.payments.filter(item => item.id !== payment.id); this.publish(); }
}

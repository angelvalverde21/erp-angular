import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { CurrencyPipe } from '@angular/common';
import { DateShopifyPipe } from '../../../shared/pipes/date-shopify.pipe';
import { PaymentEditComponent } from '../payment-edit/payment-edit.component';

@Component({
  selector: 'tr[app-payment-index-row]',
  imports: [
    ButtonComponent,
    CurrencyPipe,
    DateShopifyPipe,
    PaymentEditComponent
  ],
  templateUrl: './payment-index-row.component.html',
  styleUrl: './payment-index-row.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PaymentIndexRowComponent {

  faEdit = faEdit;

  @Input() payment: any;
  @Input() paymentable_type: string = "";
  @Input() paymentable_id: number = 0;

  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }

}
import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PaymentEditComponent } from '../payment-edit/payment-edit.component';
import { PaymentService } from '../payment.service';
import { ImagePreviewComponent } from 'src/app/views/shared/components/image-preview/image-preview.component';

@Component({
  selector: 'tr[app-payment-index-row]', imports: [CommonModule, PaymentEditComponent, ImagePreviewComponent],
  templateUrl: './payment-index-row.component.html', styleUrl: './payment-index-row.component.scss', encapsulation: ViewEncapsulation.None,
})
export class PaymentIndexRowComponent implements OnDestroy {
  @Input() payment: any;
  @Input() paymentable_type = '';
  @Input() paymentable_id = 0;
  @Input() edit = true;
  @Output() emitRemovePayment = new EventEmitter<any>();
  @Output() emitUpdatePayment = new EventEmitter<any>();
  removeLoading = false;
  editing = false;
  error = '';
  modal?: NgbModalRef;
  private readonly destroy$ = new Subject<void>();
  constructor(config: NgbModalConfig, private modalService: NgbModal, private service: PaymentService) { config.backdrop = 'static'; config.keyboard = false; }
  openVerticallyCentered(content: TemplateRef<any>): void { this.modal = this.modalService.open(content, { centered: true, size: 'lg', scrollable: true }); }
  receiveUpdatePayment(payment: any): void { this.payment = payment; this.emitUpdatePayment.emit(payment); this.modal?.close(); }
  receiveAttachmentsUpdated(payment: any): void { this.payment = payment; this.emitUpdatePayment.emit(payment); }
  closeModal(): void { this.modal?.close(); }
  removePayment(id = this.payment.id): void {
    if (this.removeLoading) return;
    this.removeLoading = true; this.error = '';
    this.service.destroy(id).pipe(takeUntil(this.destroy$), finalize(() => this.removeLoading = false)).subscribe({
      next: () => this.emitRemovePayment.emit(this.payment),
      error: () => this.error = 'No se pudo eliminar el pago. Intenta nuevamente.',
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

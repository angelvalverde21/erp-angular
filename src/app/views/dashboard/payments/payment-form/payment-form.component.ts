import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GatewaySelectedComponent } from '../../gateways/gateway-selected/gateway-selected.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TwoDecimalsDirective } from 'src/app/core/directives/two-decimals.directive';
import { ImageIndexComponent } from '../../images/image-index/image-index.component';

@Component({
  selector: 'app-payment-form', imports: [ReactiveFormsModule, GatewaySelectedComponent, NgxDropzoneModule, TwoDecimalsDirective, ImageIndexComponent],
  templateUrl: './payment-form.component.html', styleUrl: './payment-form.component.scss',
})
export class PaymentFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() payment: any;
  @Input() disabled = false;
  @Output() emitUpdatePayment = new EventEmitter<any>();
  images: File[] = [];
  fileError = '';

  onSelect(event: any): void {
    if (this.disabled) return;
    this.fileError = event.rejectedFiles?.length ? 'Usa imágenes de hasta 2 MB por archivo.' : '';
    this.images = [...this.images, ...event.addedFiles];
    this.form.patchValue({ images: this.images });
  }
  onRemove(file: File): void {
    if (this.disabled) return;
    this.images = this.images.filter(image => image !== file);
    this.form.patchValue({ images: this.images });
  }
  receiveImages(images: any[]): void {
    this.payment.images = images;
    this.emitUpdatePayment.emit(this.payment);
  }
}

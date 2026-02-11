import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupComponent } from 'src/app/views/shared/components/form/input-group/input-group.component';
import { GatewaySelectedComponent } from '../../gateways/gateway-selected/gateway-selected.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { faCloud, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@Component({
  selector: 'app-payment-form',
  imports: [
    InputGroupComponent,
    ReactiveFormsModule,
    GatewaySelectedComponent,
    NgxDropzoneModule,
    FontAwesomeModule,
  ],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss'
})
export class PaymentFormComponent {

  @Input({ required: true }) form!: FormGroup;

  @Input() formCreate: boolean = true;

  images: File[] = [];
  faFileCirclePlus = faFileCirclePlus;

  onSelect(event: any) {
    this.images.push(...event.addedFiles);
    this.syncForm();
  }

  onRemove(file: any) {
    this.images = this.images.filter(f => f !== file);
    this.syncForm();
    console.log("click en remove");

  }

  private syncForm() {
    this.form.patchValue({
      images: this.images
    });
  }

  STATUS = [
    {
      id: 1,
      name: 'unpaid',
      title: 'Pago no realizado',
    },
    {
      id: 2,
      name: 'pending',
      title: 'Pendiente de pago',
    },
    {
      id: 3,
      name: 'failed',
      title: 'Error al hacer el pago',
    },
    {
      id: 4,
      name: 'expired',
      title: 'Expirado',
    },
    {
      id: 5,
      name: 'paid',
      title: 'Pagado',
    },
    {
      id: 6,
      name: 'refunding',
      title: 'En proceso de reembolso',
    },
    {
      id: 7,
      name: 'refunded',
      title: 'Reembolsado',
    },
  ];

  METHODS = [
    {
      id: 1,
      name: 'cash',
      title: 'Efectivo',
    },
    {
      id: 2,
      name: 'yape',
      title: 'Yape',
    },
    {
      id: 3,
      name: 'plin',
      title: 'Plin',
    },
    {
      id: 4,
      name: 'credit_card',
      title: 'Tarjeta de crédito',
    },
    {
      id: 5,
      name: 'bank_transfer',
      title: 'Transferencia bancaria',
    },
    {
      id: 6,
      name: 'paypal',
      title: 'PayPal',
    },
  ];

}

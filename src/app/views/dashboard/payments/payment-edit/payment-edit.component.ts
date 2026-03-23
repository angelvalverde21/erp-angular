import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import { Subject, takeUntil } from 'rxjs';
import { PaymentService } from '../payment.service';
import Swal from 'sweetalert2';
import { JsonPipe } from '@angular/common';
import { ImageIndexComponent } from '../../images/image-index/image-index.component';

@Component({
  selector: 'app-payment-edit',
  imports: [
    PaymentFormComponent,
    ButtonSaveComponent,
    JsonPipe,
    ImageIndexComponent
  ],
  templateUrl: './payment-edit.component.html',
  styleUrl: './payment-edit.component.scss'
})
export class PaymentEditComponent {

  @Input() payment: any = {};
  form!: FormGroup;
  @Input() paymentable_type: string = "";
  @Input() paymentable_id: number = 0;

  @Output() emitUpdatePayment = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private _paymentService: PaymentService,
  ) {

  }

  ngOnInit(): void {
    this.formInit();

    this.form.valueChanges.subscribe(v => console.log(v));
  }

  formInit() {

    this.form = this.fb.group({
      amount: ['', [Validators.required]],
      gateway_id: [null, [Validators.required]],
      date: ['', [Validators.required]],
      direction: ['', [Validators.required]],
      images: [[]],
      paymentable_type: [this.paymentable_type, [Validators.required]],
      paymentable_id: [this.paymentable_id, [Validators.required]],
    });

    console.log(this.payment);


    this.form.patchValue(this.payment);

  }

  loading: boolean = false;

  updatePayment() {

    this.loading = true;

    Swal.fire({
      title: 'Espere...',
      html: 'Guardando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._paymentService.update(this.payment.id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'EL pago ha sido actualizado', 'success');
        console.log(resp);
        this.payment = resp.data;
        this.loading = false;
        this.emitUpdatePayment.emit(this.payment);
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear el pago. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });


  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveImage(image: any) {

    console.log("imagen actualizada", image);

    this.payment.images = [image, ...this.payment.images];
    this.emitUpdatePayment.emit(this.payment);

    console.log(this.payment);
    

  }
  
}

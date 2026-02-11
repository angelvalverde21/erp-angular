import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import { Subject, takeUntil } from 'rxjs';
import { PaymentService } from '../payment.service';
import Swal from 'sweetalert2';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-payment-create',
  imports: [
    PaymentFormComponent,
    ButtonSaveComponent,
    JsonPipe
  ],
  templateUrl: './payment-create.component.html',
  styleUrl: './payment-create.component.scss'
})
export class PaymentCreateComponent implements OnInit, OnDestroy {

  disabledButton: boolean = true;
  form!: FormGroup;
  @Input() paymentable_type: string = "";
  @Input() paymentable_id: number = 0;

  @Output() emitCreatePayment = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private _paymentService: PaymentService,
  ) {

  }

  ngOnInit(): void {

    this.formInit();

    this.form.valueChanges.subscribe(v => console.log(v));

    this.form.statusChanges.subscribe((status) => {
      console.log(status);

      if (status === 'VALID') {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });

  }

  formInit() {

    const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      amount: ['', [Validators.required]],
      date: [today, [Validators.required]],
      direction: ['in', [Validators.required]],
      gateway_id: [null, [Validators.required]],
      images: [[]],
      paymentable_type: [this.paymentable_type, [Validators.required]],
      paymentable_id: [this.paymentable_id, [Validators.required]],
    });

  }

  loading: boolean = false;
  payment: any;

  createPayment() {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    Swal.fire({
      title: 'Espere...',
      html: 'Guardando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    //Crear FormData para enviar archivos
    const data = new FormData();

    Object.entries(this.form.value).forEach(([key, value]: any) => {

      //las imágenes
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file: File) => {
          data.append('images[]', file);
        });
        return;
      }

      //resto de campos normales
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }

    });

    (data as any).forEach((value: any, key: string) => {
      console.log(key, value);
    });


    this._paymentService.store(data).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'EL pago ha sido guardado', 'success');
        console.log(resp);
        this.payment = resp.data;
        this.loading = false;
        this.emitCreatePayment.emit(this.payment);
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

}

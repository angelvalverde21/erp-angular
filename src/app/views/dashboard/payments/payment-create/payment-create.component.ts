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
  }

  formInit() {

    this.form = this.fb.group({
      amount: [0, [Validators.required]],
      method: ['yape', [Validators.required]],
      status: ['pending', [Validators.required]],
      direction: ["in", [Validators.required]],
      paymentable_type: [this.paymentable_type, [Validators.required]],
      paymentable_id: [this.paymentable_id, [Validators.required]],
    });

  }

  loading: boolean = false;
  payment: any;

  createPayment() {

    this.loading = true;

    Swal.fire({
      title: 'Espere...',
      html: 'Guardando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._paymentService.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

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

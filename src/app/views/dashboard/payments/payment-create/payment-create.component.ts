import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { PaymentService } from '../payment.service';
import { buildPaymentForm, paymentError, paymentFormData } from '../payment-editor.model';

@Component({
  selector: 'app-payment-create', imports: [PaymentFormComponent, ReactiveFormsModule],
  templateUrl: './payment-create.component.html', styleUrl: './payment-create.component.scss',
})
export class PaymentCreateComponent implements OnInit, OnDestroy {
  @Input() paymentable_type = '';
  @Input() paymentable_id = 0;
  payment: any;
  @Output() emitCreatePayment = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() saving = new EventEmitter<boolean>();
  form!: FormGroup;
  loading = false;
  completed = false;
  error = '';
  private readonly destroy$ = new Subject<void>();
  constructor(private fb: FormBuilder, private service: PaymentService) {}
  get disabledButton(): boolean { return this.loading || this.completed || !this.form || this.form.invalid; }
  ngOnInit(): void { this.form = buildPaymentForm(this.fb, this.paymentable_type, this.paymentable_id); }

  createPayment(): void {
    if (this.loading || this.completed) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = paymentFormData(this.form.getRawValue());
    this.loading = true; this.error = ''; this.saving.emit(true);
    this.form.disable({ emitEvent: false });
    this.service.store(payload).pipe(
      takeUntil(this.destroy$),
      finalize(() => { this.loading = false; this.form.enable({ emitEvent: false }); this.saving.emit(false); }),
    ).subscribe({
      next: (response: any) => { this.payment = response.data; this.completed = true; this.emitCreatePayment.emit(this.payment); },
      error: response => this.error = paymentError(response),
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

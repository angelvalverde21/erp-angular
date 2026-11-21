import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { PaymentService } from '../payment.service';
import { buildPaymentForm, paymentError } from '../payment-editor.model';

@Component({
  selector: 'app-payment-edit', imports: [PaymentFormComponent, ReactiveFormsModule],
  templateUrl: './payment-edit.component.html', styleUrl: './payment-edit.component.scss',
})
export class PaymentEditComponent implements OnInit, OnDestroy {
  @Input() paymentable_type = '';
  @Input() paymentable_id = 0;
  @Input() payment: any = {};
  @Output() emitUpdatePayment = new EventEmitter<any>();
  @Output() attachmentsChanged = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() saving = new EventEmitter<boolean>();
  form!: FormGroup;
  loading = false;
  completed = false;
  error = '';
  private readonly destroy$ = new Subject<void>();
  constructor(private fb: FormBuilder, private service: PaymentService) {}
  get disabledButton(): boolean { return this.loading || this.completed || !this.form || this.form.invalid; }
  ngOnInit(): void { this.form = buildPaymentForm(this.fb, this.paymentable_type, this.paymentable_id, this.payment); }

  attachmentsUpdated(payment: any): void { this.payment = payment; this.attachmentsChanged.emit(payment); }
  updatePayment(): void {
    if (this.loading || this.completed) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.getRawValue();
    this.loading = true; this.error = ''; this.saving.emit(true);
    this.form.disable({ emitEvent: false });
    this.service.update(this.payment.id, payload).pipe(
      takeUntil(this.destroy$),
      finalize(() => { this.loading = false; this.form.enable({ emitEvent: false }); this.saving.emit(false); }),
    ).subscribe({
      next: (response: any) => { this.payment = response.data; this.completed = true; this.emitUpdatePayment.emit(this.payment); },
      error: response => this.error = paymentError(response),
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

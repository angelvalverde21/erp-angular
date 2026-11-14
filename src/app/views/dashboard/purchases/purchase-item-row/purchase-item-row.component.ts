import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UnitSelectedComponent } from '../../units/unit-selected/unit-selected.component';
import { TwoDecimalsDirective } from 'src/app/core/directives/two-decimals.directive';

@Component({
  selector: 'tr[app-purchase-item-row]',
  imports: [
    UnitSelectedComponent,
    ReactiveFormsModule,
    TwoDecimalsDirective
  ],
  templateUrl: './purchase-item-row.component.html',
  styleUrl: './purchase-item-row.component.scss'
})
export class PurchaseItemRowComponent implements OnInit {


  @Output() emitPurchaseItemRemove = new EventEmitter<void>();


  @Input() formGroup!: FormGroup;
  @Input() index!: number;


  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {

    this.form.get('quantity')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.calculateTotal();
    });

    this.form.get('price')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.calculateTotal();
    });

    this.form.get('subtotal')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.calculatePrice();
    });

  }

  get form() {
    return this.formGroup;
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  calculateTotal() {

    const qty = Number(this.form.get('quantity')?.value) || 0;
    const price = Number(this.form.get('price')?.value) || 0;

    const subtotal = qty * price;

    this.form.patchValue({
      subtotal: this.round2(subtotal)
    }, { emitEvent: false });

  }

  calculatePrice() {

    const qty = Number(this.form.get('quantity')?.value) || 0;
    const subtotal = Number(this.form.get('subtotal')?.value) || 0;

    if (qty > 0) {

      const price = subtotal / qty;

      this.form.patchValue({
        price: this.round2(price)
      }, { emitEvent: false });

    }

  }

  removeItem() {
    this.emitPurchaseItemRemove.emit();
  }

  round2(value: number): number {
    return Number(value.toFixed(2));
  }

}

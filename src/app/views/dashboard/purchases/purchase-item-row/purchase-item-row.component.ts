import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { UnitSelectedComponent } from '../../units/unit-selected/unit-selected.component';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonTrashComponent } from 'src/app/views/shared/components/buttons/button-trash/button-trash.component';

@Component({
  selector: 'tr[app-purchase-item-row]',
  imports: [
    InputGroupComponent,
    UnitSelectedComponent,
    ReactiveFormsModule,
    ButtonComponent,
    ButtonTrashComponent
  ],
  templateUrl: './purchase-item-row.component.html',
  styleUrl: './purchase-item-row.component.scss'
})
export class PurchaseItemRowComponent implements OnInit {


  @Output() emitPurchaseItemRemove = new EventEmitter<void>();
  

  @Input() formGroup!: FormGroup;
  @Input() index!: number;

  faPlus = faPlus;

  constructor(private controlContainer: ControlContainer) { }

  ngOnInit() {

    this.form.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    this.form.get('price')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    this.form.get('subtotal')?.valueChanges.subscribe(() => {
      this.calculatePrice();
    });

  }

  addItem() {

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
      subtotal: subtotal
    }, { emitEvent: false });

  }

  calculatePrice() {

    const qty = Number(this.form.get('quantity')?.value) || 0;
    const subtotal = Number(this.form.get('subtotal')?.value) || 0;

    if (qty > 0) {

      const price = subtotal / qty;

      this.form.patchValue({
        price: price
      }, { emitEvent: false });

    }

  }

  removeItem(){
    this.emitPurchaseItemRemove.emit();
  }

}

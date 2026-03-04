import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TwoDecimalsDirective } from 'src/app/core/directives/two-decimals.directive';
import { ButtonTrashComponent } from '@shared/components/buttons/button-trash/button-trash.component';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tr[app-order-variant-row]',
  imports: [
    CommonModule,
    ButtonTrashComponent,
    TwoDecimalsDirective,
    ReactiveFormsModule
  ],
  templateUrl: './order-variant-row.component.html',
  styleUrl: './order-variant-row.component.scss'
})
export class OrderVariantRowComponent {

  @Input() formGroup!: FormGroup;
  @Input() index!: number;


  removeVariant(variant: any) {
    // Aquí puedes emitir un evento para que el componente padre sepa que se ha eliminado este variant  
    console.log('Variant removed:', variant);
  }
  get data() {
    return this.formGroup.value;
  }

  get total(): number {
    const quantity = this.formGroup.get('quantity')?.value || 0;
    const price = this.formGroup.get('price')?.value || 0;

    return quantity * price;
  }
}

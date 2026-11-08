import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { OrderVariantRowComponent } from '../order-variant-row/order-variant-row.component';
import { FormArray, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-variant-index',
  imports: [
    OrderVariantRowComponent,

  ],
  templateUrl: './order-variant-index.component.html',
  styleUrl: './order-variant-index.component.scss'
})
export class OrderVariantIndexComponent implements OnChanges, OnDestroy {

  // @Input() variants: any[] = [];

  @Input() variants!: FormArray<FormGroup>;
  @Output() totalChange = new EventEmitter<number>();

  private variantsSubscription?: Subscription;

  ngOnChanges(): void {
    this.variantsSubscription?.unsubscribe();
    this.emitTotal();
    this.variantsSubscription = this.variants.valueChanges.subscribe(() => this.emitTotal());
  }

  private emitTotal(): void {
    const total = this.variants.controls.reduce((sum, control) => {
      const quantity = Number(control.get('quantity')?.value) || 0;
      const price = Number(control.get('price')?.value) || 0;
      return sum + quantity * price;
    }, 0);

    this.totalChange.emit(Math.round((total + Number.EPSILON) * 100) / 100);
  }

  ngOnDestroy(): void {
    this.variantsSubscription?.unsubscribe();
  }
}

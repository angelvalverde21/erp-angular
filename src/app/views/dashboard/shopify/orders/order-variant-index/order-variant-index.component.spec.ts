import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { OrderVariantIndexComponent } from './order-variant-index.component';

describe('OrderVariantIndexComponent totals', () => {
  let component: OrderVariantIndexComponent;
  let totals: number[];
  const row = (quantity: number | string | null, price: number | string | null) =>
    new FormGroup({ quantity: new FormControl(quantity), price: new FormControl(price) });

  beforeEach(() => {
    component = new OrderVariantIndexComponent();
    totals = [];
    component.totalChange.subscribe(total => totals.push(total));
    component.variants = new FormArray<FormGroup>([]);
  });

  afterEach(() => component.ngOnDestroy());

  it('emits initial and updated totals for edits, additions and removal', () => {
    component.variants.push(row(2, 10));
    component.ngOnChanges();
    component.variants.at(0).get('quantity')!.setValue(3);
    component.variants.at(0).get('price')!.setValue(12.5);
    component.variants.push(row(1, 5));
    component.variants.removeAt(0);
    component.variants.clear();
    expect(totals).toEqual([20, 30, 37.5, 42.5, 5, 0]);
  });

  it('handles empty fields, numeric strings and decimal rounding', () => {
    component.variants.push(row('3', '0.1'));
    component.ngOnChanges();
    component.variants.at(0).get('price')!.setValue(null);
    expect(totals).toEqual([0.3, 0]);
  });

  it('unsubscribes from replaced arrays and on destruction', () => {
    const previous = component.variants;
    component.ngOnChanges();
    component.variants = new FormArray<FormGroup>([row(2, 8)]);
    component.ngOnChanges();
    previous.push(row(1, 99));
    component.ngOnDestroy();
    component.variants.push(row(1, 99));
    expect(totals).toEqual([0, 16]);
  });
});

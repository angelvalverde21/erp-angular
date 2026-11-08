import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { ProductService } from '../product.service';
import { ProductPricesComponent } from './product-prices.component';

describe('ProductPricesComponent', () => {
  let component: ProductPricesComponent;
  let service: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('ProductService', ['getPrices', 'getPriceLabels', 'savePrice', 'deletePrice']);
    service.getPriceLabels.and.returnValue(of({ data: [] }));
    service.getPrices.and.returnValue(of({ data: [] }));
    TestBed.configureTestingModule({ providers: [{ provide: ProductService, useValue: service }] });
    component = TestBed.runInInjectionContext(() => new ProductPricesComponent());
    component.productId = 10;
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('calculates and sends all four fields, then updates the same saved row', () => {
    component.add();
    const row = component.rows[0];
    row.form.patchValue({ name: 'Mayorista', quantity: 3, price: 4 });
    expect(row.form.value.total).toBe(12);
    service.savePrice.and.returnValue(of({ data: { id: 7, ...row.form.value } }));
    component.save(row);
    expect(service.savePrice).toHaveBeenCalledWith(10, { name: 'Mayorista', quantity: 3, price: 4, total: 12 }, undefined);
    expect(row.id).toBe(7);
    row.form.patchValue({ quantity: 1.005, price: 1 });
    expect(row.form.value.total).toBe(1.01);
    component.save(row);
    expect(service.savePrice.calls.mostRecent().args[2]).toBe(7);
  });

  it('shows a check only after saving and restores the save icon when the row is edited', () => {
    const response = new Subject<any>();
    service.savePrice.and.returnValue(response);
    const fixture = TestBed.createComponent(ProductPricesComponent);
    fixture.componentRef.setInput('productId', 10);
    fixture.detectChanges();
    fixture.componentInstance.add();
    fixture.componentInstance.rows[0].form.patchValue({ name: 'Normal', quantity: 1, price: 6 });
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.price-save');
    expect(button.querySelector('.fa-floppy-disk')).not.toBeNull();
    button.click();
    fixture.detectChanges();
    expect(button.querySelector('.spinner-border')).not.toBeNull();
    response.next({ data: { id: 8, name: 'Normal', quantity: 1, price: 6, total: 6 } });
    response.complete();
    fixture.detectChanges();
    expect(button.querySelector('.fa-check')).not.toBeNull();
    expect(button.textContent).toContain('Listo');
    expect(button.disabled).toBeTrue();
    const quantity: HTMLInputElement = fixture.nativeElement.querySelector('#price-quantity-0');
    quantity.value = '2';
    quantity.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(button.querySelector('.fa-check')).toBeNull();
    expect(button.querySelector('.fa-floppy-disk')).not.toBeNull();
    expect(button.disabled).toBeFalse();
    fixture.destroy();
  });

  it('rejects missing names, zero quantities and excess price precision', () => {
    component.add();
    const row = component.rows[0];
    for (const values of [
      { name: ' ', quantity: 3, price: 4 },
      { name: 'Normal', quantity: 0, price: 4 },
      { name: 'Normal', quantity: 1, price: 4.001 },
    ]) {
      row.form.patchValue(values);
      component.save(row);
    }
    expect(service.savePrice).not.toHaveBeenCalled();
  });

  it('keeps edits on a save failure and keeps the row on a delete failure', () => {
    component.add();
    const row = component.rows[0];
    row.form.patchValue({ name: 'Normal', quantity: 1, price: 6 });
    service.savePrice.and.returnValue(throwError(() => ({ error: { errors: { name: ['Nombre duplicado'] } } })));
    component.save(row);
    expect(row.error).toContain('Nombre duplicado');
    expect(row.form.value.total).toBe(6);
    expect(row.busy).toBeFalse();
    row.id = 7;
    service.deletePrice.and.returnValue(throwError(() => new Error('offline')));
    component.remove(row);
    expect(component.rows).toContain(row);
    service.deletePrice.and.returnValue(of({}));
    component.remove(row);
    expect(component.rows).toEqual([]);
  });

  it('looks up label suggestions from a partial name', fakeAsync(() => {
    const label = { id: 5, name: 'precio etiqueta', code: 'precio_etiqueta' };
    service.getPriceLabels.and.returnValue(of({ data: [label] }));
    component.searchLabels('etiqueta');
    tick(200);
    expect(service.getPriceLabels.calls.mostRecent().args).toEqual(['etiqueta']);
    expect(component.labelSuggestions).toEqual([label]);
  }));

  it('keeps the canonical label after saving and makes it available for filtering', () => {
    component.add();
    const row = component.rows[0];
    row.form.patchValue({ name: 'PRECIO ETIQUETA', quantity: 1, price: 6 });
    const label = { id: 5, name: 'precio etiqueta', code: 'precio_etiqueta' };
    service.savePrice.and.returnValue(of({ data: {
      id: 8, name: label.name, quantity: 1, price: 6, total: 6, price_label_id: label.id, label,
    } }));
    component.save(row);
    expect(row.form.value.name).toBe('precio etiqueta');
    expect(component.availableLabels).toEqual([label]);
    component.selectedLabelCode = label.code;
    component.add();
    expect(component.selectedLabelCode).toBe('');
    expect(component.rows[0].id).toBeUndefined();
  });
});

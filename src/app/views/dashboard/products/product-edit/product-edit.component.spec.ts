import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductService } from '../product.service';
import { ProductEditComponent } from './product-edit.component';

describe('ProductEditComponent', () => {
  let component: ProductEditComponent;
  let update: jasmine.Spy;
  let response: Subject<unknown>;

  beforeEach(() => {
    response = new Subject();
    update = jasmine.createSpy('update').and.returnValue(response);
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDenied: false, isDismissed: false });
    spyOn(console, 'error');
    TestBed.configureTestingModule({
      imports: [ProductEditComponent],
      providers: [{ provide: ProductService, useValue: { update } }],
    }).overrideComponent(ProductEditComponent, { set: { imports: [], template: '' } });
    component = TestBed.createComponent(ProductEditComponent).componentInstance;
    const product = {
      id: 7, name: 'Polo', status: 1 as const, slug: 'polo', price: 90, material: 'Algodon',
      model: 'Clasico', brand_id: 2, sizes: [], colors: [], options: [], variants: [],
    };
    component.product = product;
    component.ngOnInit();
  });

  it('loads the product without flagging pending changes', () => {
    expect(component.form.get('name')!.value).toBe('Polo');
    expect(component.form.valid).toBeTrue();
    expect(component.form.pristine).toBeTrue();
  });

  it('blocks invalid data before contacting the API', () => {
    component.form.get('name')!.setValue('');
    component.update();
    expect(update).not.toHaveBeenCalled();
    expect(component.form.touched).toBeTrue();
  });

  it('saves once and notifies the page of the updated product', () => {
    const updated = jasmine.createSpy('updated');
    component.emitProductUpdated.subscribe(updated);
    component.form.get('name')!.setValue('Polo actualizado');
    component.form.markAsDirty();
    component.update();
    component.update();
    expect(update).toHaveBeenCalledTimes(1);
    expect(update.calls.mostRecent().args[0]).toBe(7);
    expect(update.calls.mostRecent().args[1].name).toBe('Polo actualizado');
    expect(component.loadingIcon).toBeTrue();
    expect(component.form.disabled).toBeTrue();
    response.next({ data: { id: 7, name: 'Polo actualizado' } });
    response.complete();
    expect(updated).toHaveBeenCalledWith(jasmine.objectContaining({ id: 7, name: 'Polo actualizado' }));
    expect(component.loadingIcon).toBeFalse();
    expect(component.form.enabled).toBeTrue();
    expect(component.form.pristine).toBeTrue();
    expect(component.success).toBeTrue();
  });

  it('preserves edits and restores controls after an API error', () => {
    component.form.get('name')!.setValue('Nuevo nombre');
    component.form.markAsDirty();
    component.update();
    response.error(new Error('Network error'));
    expect(component.form.get('name')!.value).toBe('Nuevo nombre');
    expect(component.form.dirty).toBeTrue();
    expect(component.form.enabled).toBeTrue();
    expect(component.disabledButton).toBeFalse();
    expect(component.loadingIcon).toBeFalse();
  });

  it('turns comma-separated values into tags while keeping an unfinished draft', () => {
    const input = document.createElement('input');
    input.value = 'verano, algod\u00f3n, Azul';
    component.onTagInput(input);
    expect(component.tagItems).toEqual(['verano', 'algod\u00f3n']);
    expect(input.value).toBe(' Azul');
    component.commitTags(input);
    expect(component.tagItems).toEqual(['verano', 'algod\u00f3n', 'Azul']);
    expect(input.value).toBe('');
    expect(component.form.dirty).toBeTrue();
  });

  it('loads existing tags without marking changes and ignores empty or duplicate tags', () => {
    const product = { ...component.product, tags: 'verano, oferta' };
    component.product = product;
    component.ngOnInit();
    expect(component.tagItems).toEqual(['verano', 'oferta']);
    expect(component.form.pristine).toBeTrue();
    const input = document.createElement('input');
    input.value = 'verano, ,oferta,';
    component.onTagInput(input);
    expect(component.tagItems).toEqual(['verano', 'oferta']);
  });

  it('supports Enter and tag removal', () => {
    const input = document.createElement('input');
    input.value = 'oferta';
    const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    component.confirmTag(event, input);
    expect(event.defaultPrevented).toBeTrue();
    expect(component.tagItems).toEqual(['oferta']);
    component.removeTag('oferta');
    expect(component.form.get('tags')!.value).toBe('');
  });

  it('includes an unfinished tag when saving and sends tags as a comma-separated string', () => {
    const input = document.createElement('input');
    input.value = 'verano, oferta';
    component.onTagInput(input);
    component.update();
    expect(update.calls.mostRecent().args[1].tags).toBe('verano, oferta');
  });
});

import Swal from 'sweetalert2';
import { fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { OptionValueService } from '../option_value.service';
import { OptionValueIndexComponent } from './option-value-index.component';

describe('Option value deletion confirmation', () => {
  let component: OptionValueIndexComponent;
  let service: jasmine.SpyObj<OptionValueService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('OptionValueService', ['destroy']);
    service.destroy.and.returnValue(of({ data: { option_id: 10, option_value_id: 1, deleted_variant_ids: [20, 21] } }));
    component = new OptionValueIndexComponent(service);
    component.product_id = 7;
    component.option_id = 10;
    component.label = 'Tallas';
    component.option_values = [{ id: 1, value: '26' }, { id: 2, value: '28' }];
  });

  afterEach(() => component.ngOnDestroy());

  it('keeps all values when the user cancels', async () => {
    const dialog = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDenied: false, isDismissed: true });
    await component.removeOptionValue(1);
    expect(dialog).toHaveBeenCalledWith(jasmine.objectContaining({ text: jasmine.stringContaining('"26" de Tallas y sus variantes asociadas'), showCancelButton: true, focusCancel: true }));
    expect(service.destroy).not.toHaveBeenCalled();
    expect(component.option_values.length).toBe(2);
  });

  it('removes only the selected value after confirmation', async () => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDenied: false, isDismissed: false });
    await component.removeOptionValue(1);
    expect(service.destroy).toHaveBeenCalledOnceWith(7, 10, 1);
    expect(component.option_values).toEqual([{ id: 2, value: '28' }]);
    expect(component.confirmingDelete).toBeFalse();
  });

  it('leaves the list unchanged while waiting and prevents overlapping dialogs', async () => {
    let confirm!: (result: { isConfirmed: boolean; isDenied: boolean; isDismissed: boolean }) => void;
    const dialog = spyOn(Swal, 'fire').and.returnValue(new Promise(resolve => { confirm = resolve; }));
    const pending = component.removeOptionValue(1);
    await component.removeOptionValue(2);
    expect(dialog).toHaveBeenCalledTimes(1);
    expect(component.option_values.length).toBe(2);
    confirm({ isConfirmed: true, isDenied: false, isDismissed: false });
    await pending;
    expect(component.option_values).toEqual([{ id: 2, value: '28' }]);
  });

  it('waits for database confirmation before removing the value and notifies the page of deleted variants', async () => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDenied: false, isDismissed: false });
    const response = new Subject<{ data: { option_id: number; option_value_id: number; deleted_variant_ids: number[] } }>();
    service.destroy.and.returnValue(response);
    const emitted = spyOn(component.valueDeleted, 'emit');
    const pending = component.removeOptionValue(1);
    await Promise.resolve();
    expect(component.option_values.length).toBe(2);
    expect(emitted).not.toHaveBeenCalled();
    response.next({ data: { option_id: 10, option_value_id: 1, deleted_variant_ids: [20, 21] } });
    await pending;
    expect(component.option_values).toEqual([{ id: 2, value: '28' }]);
    expect(emitted).toHaveBeenCalledWith({ option_id: 10, option_value_id: 1, deleted_variant_ids: [20, 21] });
  });

  it('keeps the value and displays the reason when stock or history prevents deletion', async () => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDenied: false, isDismissed: false });
    service.destroy.and.returnValue(throwError(() => ({ error: { errors: { value: ['La variante tiene stock.'] } } })));
    const emitted = spyOn(component.valueDeleted, 'emit');
    await component.removeOptionValue(1);
    expect(component.option_values.length).toBe(2);
    expect(component.deletionError).toContain('tiene stock');
    expect(component.confirmingDelete).toBeFalse();
    expect(component.deletingId).toBeNull();
    expect(emitted).not.toHaveBeenCalled();
  });

  it('stops waiting after 20 seconds without claiming that the value was deleted', fakeAsync(() => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDenied: false, isDismissed: false });
    const response = new Subject<{ data: { option_id: number; option_value_id: number; deleted_variant_ids: number[] } }>();
    service.destroy.and.returnValue(response);
    const emitted = spyOn(component.valueDeleted, 'emit');
    void component.removeOptionValue(1);
    flushMicrotasks();
    expect(component.deletingId).toBe(1);
    tick(20000);
    flushMicrotasks();
    expect(component.deletingId).toBeNull();
    expect(component.confirmingDelete).toBeFalse();
    expect(component.option_values.length).toBe(2);
    expect(component.deletionError).toContain('comprobar si el valor se eliminó');
    expect(emitted).not.toHaveBeenCalled();
    expect(response.observed).toBeFalse();
  }));
});

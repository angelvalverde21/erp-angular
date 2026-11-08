import Swal from 'sweetalert2';
import { of, Subject, throwError } from 'rxjs';
import { OptionService, OptionRemoval } from '../option.service';
import { OptionIndexComponent } from './option-index.component';

describe('Remove product option block', () => {
  let component: OptionIndexComponent;
  let service: jasmine.SpyObj<OptionService>;
  const color = { id: 1, name: 'color', label: 'Colores', option_values: [{ id: 8, value: 'Azul' }] };
  const result: OptionRemoval = { option_id: 1, archived: true, hidden_variant_ids: [20, 21] };

  beforeEach(() => {
    service = jasmine.createSpyObj('OptionService', ['destroy']);
    service.destroy.and.returnValue(of({ data: result }));
    component = new OptionIndexComponent(service);
    component.product_id = 7;
    component.options = [color, { id: 2, name: 'size', label: 'Tallas' }];
    component.options_init = [];
  });
  afterEach(() => component.ngOnDestroy());

  it('does not remove the block when confirmation is cancelled', async () => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDismissed: true, isDenied: false });
    await component.removeOption(color);
    expect(service.destroy).not.toHaveBeenCalled();
    expect(component.options.length).toBe(2);
  });

  it('removes the block after persistence and makes a fresh color option available', async () => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDismissed: false, isDenied: false });
    const emitted = spyOn(component.blockRemoved, 'emit');
    await component.removeOption(color);
    expect(service.destroy).toHaveBeenCalledOnceWith(1, 7);
    expect(component.options.map((option: any) => option.name)).toEqual(['size']);
    expect(component.options_init).toEqual([{ name: 'color', label: 'Colores' }]);
    expect(emitted).toHaveBeenCalledWith(result);
    expect(component.removingOptionId).toBeNull();
  });

  it('preserves the block if the server fails', async () => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDismissed: false, isDenied: false });
    service.destroy.and.returnValue(throwError(() => new Error('offline')));
    await component.removeOption(color);
    expect(component.options.length).toBe(2);
    expect(component.removalError).toContain('No se pudo quitar');
    expect(component.removing).toBeFalse();
  });

  it('shows progress and keeps data unchanged until the server responds', async () => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDismissed: false, isDenied: false });
    const response = new Subject<{ data: OptionRemoval }>();
    service.destroy.and.returnValue(response);
    const pending = component.removeOption(color);
    await Promise.resolve();
    expect(component.removing).toBeTrue();
    expect(component.options.length).toBe(2);
    response.next({ data: result });
    await pending;
    expect(component.options.length).toBe(1);
  });

  it('also removes sizes and warns about inventory and sales before confirming', async () => {
    const dialog = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDismissed: false, isDenied: false });
    service.destroy.and.returnValue(of({ data: { ...result, option_id: 2 } }));
    await component.removeOption(component.options[1]);
    expect(dialog).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Quitar opción', text: jasmine.stringMatching(/Tallas.*inventario o ventas.*conservando el stock/),
      confirmButtonText: 'Quitar opción', showCancelButton: true,
    }));
    expect(service.destroy).toHaveBeenCalledOnceWith(2, 7);
    expect(component.options.map((option: any) => option.name)).toEqual(['color']);
    expect(component.options_init).toEqual([{ name: 'size', label: 'Tallas' }]);
  });
});

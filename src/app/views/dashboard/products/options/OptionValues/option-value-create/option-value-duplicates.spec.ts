import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';
import { OptionValueService } from '../option_value.service';
import { OptionValueCreateComponent } from './option-value-create.component';

describe('Option value duplicate validation', () => {
  let component: OptionValueCreateComponent;
  let service: jasmine.SpyObj<OptionValueService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('OptionValueService', ['store']);
    TestBed.configureTestingModule({});
    component = new OptionValueCreateComponent(TestBed.inject(FormBuilder), service);
    component.option_id = 1;
    component.existingValues = [{ value: '26' }, { value: 'M' }];
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('rejects matching sizes, case variants and surrounding spaces without sending requests', () => {
    const emitted = spyOn(component.emitOptionValue, 'emit');
    for (const value of ['26', ' 26 ', 'm', ' M ']) {
      component.form.patchValue({ value });
      component.create();
      expect(component.form.get('value')?.hasError('duplicate')).toBeTrue();
    }
    expect(service.store).not.toHaveBeenCalled();
    expect(emitted).not.toHaveBeenCalled();
  });

  it('adds a new value once and rejects it when the updated list includes it', () => {
    service.store.and.returnValue(of({ data: { id: 8, value: '28' } }));
    const emitted = spyOn(component.emitOptionValue, 'emit');
    component.form.patchValue({ value: ' 28 ' });
    component.create();
    expect(service.store).toHaveBeenCalledOnceWith(null, null, { option_id: 1, value: '28' });
    expect(emitted).toHaveBeenCalledTimes(1);
    component.existingValues = [...component.existingValues, { value: '28' }];
    component.form.patchValue({ value: '28' });
    component.create();
    expect(service.store).toHaveBeenCalledTimes(1);
  });

  it('shows server rejection without emitting another row or clearing the input', () => {
    service.store.and.returnValue(throwError(() => ({ status: 422, error: { errors: { value: ['Este valor ya existe en esta opción.'] } } })));
    const emitted = spyOn(component.emitOptionValue, 'emit');
    component.form.patchValue({ value: '28' });
    component.create();
    expect(component.form.get('value')?.getError('server')).toContain('ya existe');
    expect(component.form.value.value).toBe('28');
    expect(component.loading).toBeFalse();
    expect(emitted).not.toHaveBeenCalled();
  });

  it('ignores repeated clicks while saving', () => {
    const request = new Subject();
    service.store.and.returnValue(request);
    component.form.patchValue({ value: '28' });
    component.create();
    component.create();
    expect(service.store).toHaveBeenCalledTimes(1);
  });
});

import { FormBuilder } from '@angular/forms';
import { BranchCreateComponent } from './branch-create/branch-create.component';
import { WarehouseCreateComponent } from '../warehouses/warehouse-create/warehouse-create.component';
import { LocationCreateComponent } from '../locations/location-create/location-create.component';
import { snakeCaseCode } from './automatic-code';

describe('Automatic organization codes', () => {
  for (const Component of [BranchCreateComponent, WarehouseCreateComponent, LocationCreateComponent]) {
    it('fills ' + Component.name + ' from the name and preserves a manual override', () => {
      const component = new Component(new FormBuilder());
      component.form.controls.name.setValue('  Almacén Ñandú / Lima 02  ');
      expect(component.form.controls.code.value).toBe('almacen_nandu_lima_02');

      component.form.controls.name.setValue('Almacén Central');
      expect(component.form.controls.code.value).toBe('almacen_central');

      component.form.controls.code.setValue('codigo_personalizado');
      component.form.controls.name.setValue('Otro nombre');
      expect(component.form.controls.code.value).toBe('codigo_personalizado');

      component.ngOnDestroy();
      component.form.controls.code.setValue('');
      component.form.controls.name.setValue('Sin suscripción');
      expect(component.form.controls.code.value).toBe('');
    });
  }

  it('respects the database length and removes trailing separators', () => {
    const code = snakeCaseCode('Sucursal ' + 'Central '.repeat(30));
    expect(code.length).toBeLessThanOrEqual(50);
    expect(code.endsWith('_')).toBeFalse();
  });
});

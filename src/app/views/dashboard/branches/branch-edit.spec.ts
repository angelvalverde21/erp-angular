import { FormBuilder } from '@angular/forms';
import { SimpleChange } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { Location } from 'src/app/interfaces/location.interface';
import { BranchEditComponent } from './branch-edit/branch-edit.component';
import { LocationEditPageComponent } from '../locations/location-edit-page/location-edit-page.component';
import { LocationService } from '../locations/location.service';
import { WarehouseService } from '../warehouses/warehouse.service';

describe('Branch structure editing', () => {
  it('loads the existing branch values and emits edits without changing its identity', () => {
    const component = new BranchEditComponent(new FormBuilder());
    component.record = { id: 3, store_id: 1, address_id: 8, name: 'Lima', code: 'LIM', is_main: true, is_active: true };
    component.ngOnChanges({ record: new SimpleChange(null, component.record, true) });
    expect(component.form.controls.address_id.value).toBe(8);
    expect(component.form.controls.is_main.value).toBeTrue();
    component.form.controls.name.setValue('Lima centro');
    component.ngOnChanges({ saving: new SimpleChange(false, true, false) });
    expect(component.form.controls.name.value).toBe('Lima centro');
    const save = spyOn(component.save, 'emit');
    component.submit();
    expect(save).toHaveBeenCalledWith({ name: 'Lima centro', code: 'LIM', address_id: 8, is_main: true, is_active: true });
    expect(component.submitLabel).toBe('Guardar cambios');
  });

  it('excludes a location and its descendants from parent options and updates the selected record', () => {
    const records: Location[] = [
      { id: 1, warehouse_id: 5, parent_id: null, name: 'Zona', code: null, is_active: true },
      { id: 2, warehouse_id: 5, parent_id: 1, name: 'Estante', code: null, is_active: true },
      { id: 3, warehouse_id: 5, parent_id: 2, name: 'Nivel', code: null, is_active: true },
      { id: 4, warehouse_id: 5, parent_id: null, name: 'Otra zona', code: null, is_active: true },
    ];
    const locations = jasmine.createSpyObj<LocationService>('LocationService', ['show', 'options', 'saveChanges']);
    locations.show.and.returnValue(of({ data: records[0] }));
    locations.options.and.returnValue(of({ data: records }));
    locations.saveChanges.and.returnValue(of({ data: records[0] }));
    const warehouses = jasmine.createSpyObj<WarehouseService>('WarehouseService', ['show']);
    warehouses.show.and.returnValue(of({ data: { id: 5, branch_id: 9, name: 'Central', code: 'ALM', address: null, is_active: true } }));
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const route = { snapshot: { paramMap: convertToParamMap({ branch_id: '9', warehouse_id: '5', location_id: '1' }) } } as ActivatedRoute;
    const component = new LocationEditPageComponent(locations, warehouses, router, route);
    component.ngOnInit();
    expect(component.parents.map(parent => parent.id)).toEqual([4]);
    const payload = { warehouse_id: 5, parent_id: 4, name: 'Zona actualizada', code: null, is_active: true };
    component.save(payload);
    expect(locations.saveChanges).toHaveBeenCalledWith(1, payload);
    expect(router.navigate).toHaveBeenCalledWith(['../../'], { relativeTo: route, queryParams: { location_id: 1 } });
    component.ngOnDestroy();
  });
});

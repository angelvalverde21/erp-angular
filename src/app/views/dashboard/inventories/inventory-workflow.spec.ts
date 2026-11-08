import { SimpleChange } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Inventory } from 'src/app/interfaces/inventory.interface';
import { InventoryCreateComponent } from './inventory-create/inventory-create.component';
import { InventoryEditComponent } from './inventory-edit/inventory-edit.component';
import { InventorySessionCreateComponent } from './sessions/inventory-session-create/inventory-session-create.component';
import { InventorySessionEditComponent } from './sessions/inventory-session-edit/inventory-session-edit.component';
import { inventoryTransitions } from './inventory-workflow';

describe('Inventory workflow forms', () => {
  const fb = new FormBuilder();
  const record: Inventory = { id: 1, store_id: 1, created_user_id: 2, name: 'Noviembre', comment: 'Revisar', status: 'in_progress', scope_type: 'warehouse', inventoriable_id: 7, sessions_count: 1, started_at: null, completed_at: null, created_at: '2026-11-03T12:00:00Z' };

  it('requires an actual scope target and clears an old target when the scope changes', () => {
    const component = new InventoryCreateComponent(fb);
    component.form.controls.name.setValue('  Conteo mensual  ');
    component.form.controls.inventoriable_type.setValue('warehouse');
    const saved = spyOn(component.save, 'emit');
    component.submit();
    expect(saved).not.toHaveBeenCalled();
    component.form.controls.inventoriable_id.setValue(7);
    component.submit();
    expect(saved).toHaveBeenCalledWith({ name: 'Conteo mensual', comment: null, inventoriable_type: 'warehouse', inventoriable_id: 7 });
    component.form.controls.inventoriable_type.setValue('location');
    expect(component.form.controls.inventoriable_id.value).toBeNull();
    component.ngOnDestroy();
  });

  it('preserves scope and edits while saving an inventory with existing sessions', () => {
    const component = new InventoryEditComponent(fb);
    component.inventory = record;
    component.ngOnChanges({ inventory: new SimpleChange(null, record, true) });
    expect(component.form.controls.inventoriable_id.disabled).toBeTrue();
    expect(component.form.getRawValue().inventoriable_id).toBe(7);
    component.form.controls.name.setValue('Actualizado');
    component.ngOnChanges({ saving: new SimpleChange(false, true, false) });
    const saved = spyOn(component.save, 'emit');
    component.submit();
    expect(saved).toHaveBeenCalledWith({ name: 'Actualizado', comment: 'Revisar', inventoriable_type: 'warehouse', inventoriable_id: 7, status: 'in_progress' });
    component.ngOnDestroy();
  });

  it('limits transitions for terminal inventories', () => {
    expect(inventoryTransitions('completed')).toEqual(['completed']);
    expect(inventoryTransitions('cancelled')).toEqual(['cancelled']);
    expect(inventoryTransitions('draft')).not.toContain('completed');
  });

  it('preselects the current operator and blocks duplicate submission while saving', () => {
    const component = new InventorySessionCreateComponent(fb);
    component.defaultUserId = 4;
    const saved = spyOn(component.save, 'emit');
    component.submit();
    expect(saved).not.toHaveBeenCalled();
    component.form.controls.warehouse_id.setValue(8);
    component.submit();
    expect(saved).toHaveBeenCalledWith({ warehouse_id: 8, user_id: 4, comment: null });
    component.saving = true;
    component.submit();
    expect(saved).toHaveBeenCalledTimes(1);
  });

  it('keeps closed sessions read-only', () => {
    const component = new InventorySessionEditComponent(fb);
    component.session = { id: 3, inventory_id: 1, warehouse_id: 8, user_id: 4, status: 'closed', comment: 'Terminado', started_at: '2026-11-03T12:00:00Z', ended_at: '2026-11-03T13:00:00Z' };
    component.ngOnChanges({ session: new SimpleChange(null, component.session, true) });
    component.readOnly = true;
    const saved = spyOn(component.save, 'emit');
    component.submit();
    expect(saved).not.toHaveBeenCalled();
    expect(component.form.controls.user_id.value).toBe(4);
    expect(component.form.controls.warehouse_id.disabled).toBeTrue();
    expect(component.form.getRawValue().warehouse_id).toBe(8);
  });
});

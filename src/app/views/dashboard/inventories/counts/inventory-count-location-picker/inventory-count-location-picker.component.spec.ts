import { TestBed } from '@angular/core/testing';
import { InventoryCountLocationPickerComponent } from './inventory-count-location-picker.component';
import { InventorySessionCreateComponent } from '../../sessions/inventory-session-create/inventory-session-create.component';
import { provideRouter } from '@angular/router';

describe('Session warehouse selection', () => {
  function setup(fixedBranchId: number | null) {
    const fixture = TestBed.createComponent(InventoryCountLocationPickerComponent);
    fixture.componentRef.setInput('warehouseOnly', true);
    fixture.componentRef.setInput('fixedBranchId', fixedBranchId);
    fixture.componentRef.setInput('options', {
      branches: [{ id: 1, name: 'Central' }, { id: 2, name: 'Norte' }],
      warehouses: [{ id: 5, branch_id: 1, name: 'Tienda 420' }, { id: 6, branch_id: 2, name: 'Tienda Norte' }],
      locations: [],
    });
    fixture.detectChanges();
    return fixture;
  }

  it('inherits the inventory branch and only asks for its warehouse', () => {
    const fixture = setup(1);
    expect(fixture.nativeElement.querySelector('#count-list-branch')).toBeNull();
    expect(fixture.nativeElement.querySelector('.fixed-branch').textContent).toContain('Central');
    expect(fixture.componentInstance.warehouses.map(item => item.id)).toEqual([5]);
    expect(fixture.nativeElement.querySelector('#count-list-warehouse').disabled).toBeFalse();
    expect(fixture.nativeElement.querySelector('#count-list-location')).toBeNull();
  });

  it('requires a branch before selecting a warehouse for a company inventory', async () => {
    const fixture = setup(null);
    await fixture.whenStable();
    fixture.detectChanges();
    const branch: HTMLSelectElement = fixture.nativeElement.querySelector('#count-list-branch');
    expect(fixture.nativeElement.querySelector('#count-list-warehouse').disabled).toBeTrue();
    branch.value = '2';
    branch.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.warehouses.map(item => item.id)).toEqual([6]);
    expect(fixture.nativeElement.querySelector('#count-list-warehouse').disabled).toBeFalse();
  });

  it('keeps the clicked warehouse in the session form and emits it on submit', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(InventorySessionCreateComponent);
    fixture.componentRef.setInput('workspaceOptions', {
      branches: [{ id: 1, name: 'Central' }],
      warehouses: [{ id: 5, branch_id: 1, name: 'Tienda 420', subtitle: 'Showroom' }],
      locations: [],
    });
    fixture.componentRef.setInput('defaultUserId', 1);
    fixture.detectChanges();
    await fixture.whenStable();
    const branch: HTMLSelectElement = fixture.nativeElement.querySelector('#count-list-branch');
    branch.value = '1';
    branch.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.ng-select-container').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();
    const option: HTMLElement = fixture.nativeElement.querySelector('.ng-option');
    option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ng-option')).toBe(option);
    option.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    option.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.warehouse_id.value).toBe(5);
    expect(fixture.nativeElement.querySelector('.ng-value').textContent).toContain('Tienda 420');
    const save = spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(jasmine.objectContaining({ warehouse_id: 5, user_id: 1 }));
  });
});

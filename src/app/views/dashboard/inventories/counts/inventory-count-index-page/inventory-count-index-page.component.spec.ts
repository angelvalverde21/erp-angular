import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { InventoryCountIndexPageComponent } from './inventory-count-index-page.component';
import { InventoryService } from '../../inventory.service';
import { InventoryWorkspaceService } from '../../inventory-workspace.service';
import { InventorySessionService } from '../../sessions/inventory-session.service';
import { InventoryCountService } from '../inventory-count.service';

describe('Count zone and rack row selection', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [
      provideRouter([]),
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ inventory_id: '1', session_id: '1' }) } } },
      ...[InventoryService, InventoryWorkspaceService, InventorySessionService, InventoryCountService].map(provide => ({ provide, useValue: {} })),
    ] });
    TestBed.overrideComponent(InventoryCountIndexPageComponent, { set: { imports: [], schemas: [NO_ERRORS_SCHEMA] } });
    const fixture = TestBed.createComponent(InventoryCountIndexPageComponent);
    const component = fixture.componentInstance;
    spyOn(component, 'load');
    component.inventory = { id: 1, status: 'in_progress' } as any;
    component.session = { id: 1, status: 'open', warehouse_id: 4 } as any;
    const zone = { id: 10, parent_id: null, warehouse_id: 4, name: 'ZONA A', code: 'zona_a', is_active: true };
    const rows = Array.from({ length: 5 }, (_, index) => ({
      id: 11 + index, parent_id: 10, warehouse_id: 4, name: `Fila ${index + 1}`, code: `fila_${index + 1}`, is_active: true,
    }));
    component.options = { locations: rows, location_tree: [zone, ...rows,
      { ...zone, id: 99, warehouse_id: 8, name: 'Otra tienda' },
    ] };
    fixture.detectChanges();
    return { fixture, component };
  }

  it('requires selecting the rack row before enabling capture and filters out other warehouses', () => {
    const { fixture, component } = setup();
    const zone: HTMLSelectElement = fixture.nativeElement.querySelector('#count-capture-location-0');
    expect(zone.options.length).toBe(2);
    zone.value = '10';
    zone.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.locationLocked).toBeFalse();
    expect(component.selectedLocationId).toBeNull();
    expect(fixture.nativeElement.querySelector('app-inventory-count-entry').locationId).toBeNull();
    const row: HTMLSelectElement = fixture.nativeElement.querySelector('#count-capture-location-1');
    expect(row.options.length).toBe(6);
    row.value = '13';
    row.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.selectedLocationId).toBe(13);
    expect(component.locationLocked).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-inventory-count-entry').locationId).toBe(13);
    expect(fixture.nativeElement.querySelector('.capture-location').textContent).toContain('ZONA A / Fila 3');
    component.chooseLocation('11', 1);
    expect(component.selectedLocationId).toBe(13);
  });

  it('resets the hierarchy on finishing and does not accept a row from another zone', () => {
    const { fixture, component } = setup();
    component.chooseLocation('13', 0);
    expect(component.selectedLocationId).toBeNull();
    component.chooseLocation('10', 0);
    component.chooseLocation('13', 1);
    component.savingCount = true;
    component.finishCount();
    expect(component.locationLocked).toBeTrue();
    component.savingCount = false;
    component.finishCount();
    fixture.detectChanges();
    expect(component.selectedLocationPath).toEqual([]);
    expect(component.selectedLocationId).toBeNull();
    expect(component.locationLevels.length).toBe(1);
  });
});

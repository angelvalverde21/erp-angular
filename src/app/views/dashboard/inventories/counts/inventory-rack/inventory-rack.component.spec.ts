import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { InventoryRackResponse, InventoryWorkspaceLocation } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryCountService } from '../inventory-count.service';
import { InventoryRackComponent } from './inventory-rack.component';

const node = (id: number, name: string, parent_id: number | null): InventoryWorkspaceLocation => ({
  id, name, parent_id, warehouse_id: 4, code: name.toLowerCase(), is_active: true,
});
const zoneA = node(1, 'ZONA A', null);
const zoneB = node(2, 'ZONA B', null);
const levels = [node(7, 'FILA 1', 1), node(8, 'FILA 2', 1), node(9, 'FILA 3', 1), node(10, 'FILA 4', 1), node(31, 'SUPERIOR', 1)];
const other = node(11, 'FILA 1', 2);
const result = (units = 0, variantId?: number): InventoryRackResponse => ({
  data: variantId ? [{ variant_id: variantId, counted_quantity: units, capture_count: 1, variant: {
    id: variantId, sku: 'SKU', stock: 0, product: { id: 1, name: 'Falda Maddie' },
    variant_option_values: [{ id: 1, option: { name: 'size', label: 'Tallas' }, option_value: { value: 's' } }],
  } }] : [],
  summary: { units, captures: variantId ? 1 : 0, variants: variantId ? 1 : 0 },
  current_page: 1, last_page: 1, total: variantId ? 1 : 0,
});

describe('Virtual rack by physical location', () => {
  let service: jasmine.SpyObj<InventoryCountService>;
  beforeEach(() => {
    service = jasmine.createSpyObj('InventoryCountService', ['rack', 'list']);
    service.rack.and.callFake((_inventory, _session, locationId) => of(
      locationId === 31 ? result(5, 7) : locationId === 7 ? result(3, 7) : locationId === 8 ? result(0, 8) : result(),
    ));
    service.list.and.returnValue(of({ data: [], current_page: 1, last_page: 1 }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: InventoryCountService, useValue: service }] });
  });

  function setup() {
    const fixture = TestBed.createComponent(InventoryRackComponent);
    fixture.componentRef.setInput('inventoryId', 3);
    fixture.componentRef.setInput('sessionId', 1);
    fixture.componentRef.setInput('warehouseId', 4);
    fixture.componentRef.setInput('activeLocationId', 7);
    fixture.componentRef.setInput('options', { locations: [...levels, other], location_tree: [zoneA, zoneB, ...levels, other] });
    fixture.detectChanges();
    return fixture;
  }

  it('shows Superior above rows 1–4, with each variant counted separately on each level', () => {
    const fixture = setup();
    expect(fixture.componentInstance.shelves.map(shelf => shelf.label)).toEqual(['SUPERIOR', 'FILA 1', 'FILA 2', 'FILA 3', 'FILA 4']);
    expect(fixture.componentInstance.totalUnits).toBe(8);
    expect(fixture.nativeElement.querySelectorAll('.rack-product').length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('.shelf-empty').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.shelf-active h3').textContent).toBe('FILA 1');
    expect(fixture.nativeElement.textContent).toContain('Contado en cero');
    expect(fixture.nativeElement.querySelector('.rack-product-options').textContent).toContain('Tallas: S');
    fixture.destroy();
  });

  it('keeps full shelf totals while loading additional pages', () => {
    service.rack.and.callFake((_inventory, _session, locationId, page) => of(locationId === 7 ? {
      ...result(page === 1 ? 3 : 4, page === 1 ? 7 : 8), current_page: page ?? 1, last_page: 2,
      summary: { units: 40, captures: 21, variants: 21 }, total: 21,
    } : result()));
    const fixture = setup();
    const shelf = fixture.componentInstance.shelves.find(shelf => shelf.location.id === 7)!;
    fixture.componentInstance.loadShelf(shelf);
    fixture.detectChanges();
    expect(service.rack).toHaveBeenCalledWith(3, 1, 7, 2);
    expect(shelf.items.length).toBe(2);
    expect(shelf.summary.units).toBe(40);
    expect(fixture.componentInstance.totalUnits).toBe(40);
    fixture.destroy();
  });

  it('cancels old requests when changing zones and loads capture history only on demand', () => {
    const old = new Subject<InventoryRackResponse>();
    service.rack.and.callFake((_inventory, _session, locationId) => locationId === 11 ? of(result(9, 9)) : old);
    const fixture = setup();
    fixture.componentInstance.selectZone('2');
    old.next(result(99, 99));
    fixture.detectChanges();
    expect(fixture.componentInstance.shelves.map(shelf => shelf.location.id)).toEqual([11]);
    expect(fixture.componentInstance.totalUnits).toBe(9);
    expect(service.list).not.toHaveBeenCalled();
    fixture.componentInstance.openHistory({ target: { open: true } } as unknown as Event, 11, 9);
    expect(service.list).toHaveBeenCalledOnceWith(3, 1, 1, 9, 11);
    fixture.destroy();
  });
});
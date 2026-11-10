import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { InventoryRackResponse, InventoryWorkspaceLocation } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryCountService } from '../inventory-count.service';
import { InventoryRackComponent } from './inventory-rack.component';

const node = (id: number, name: string, parent_id: number | null): InventoryWorkspaceLocation => ({
  id, name, parent_id, warehouse_id: 4, code: name.toLowerCase(), is_active: true,
});
const zoneA = node(1, 'Estante A', null);
const zoneB = node(2, 'Estante B', null);
const levels = [node(7, 'FILA 1', 1), node(8, 'FILA 2', 1), node(9, 'FILA 3', 1), node(10, 'FILA 4', 1), node(31, 'SUPERIOR', 1)];
const other = node(11, 'FILA 1', 2);
const result = (quantity = 0, variantId?: number, locationId = 7): InventoryRackResponse => ({
  data: variantId ? [{
    id: locationId * 100 + variantId, inventory_session_id: 1, location_id: locationId, variant_id: variantId,
    user_id: 1, quantity, count_round: 1, status: 'valid', counted_at: '2026-11-09T10:00:00Z',
    user: { id: 1, name: 'Responsable' },
    variant: {
      id: variantId, sku: 'SKU', stock: 0, product: { id: 1, name: 'Falda Maddie' },
      variant_option_values: [{ id: 1, option: { name: 'size', label: 'Tallas' }, option_value: { value: 's' } }],
    },
  }] : [],
  summary: { units: quantity, captures: variantId ? 1 : 0, variants: variantId ? 1 : 0 },
  current_page: 1, last_page: 1, total: variantId ? 1 : 0,
});

describe('Individual captures by physical location', () => {
  let service: jasmine.SpyObj<InventoryCountService>;
  beforeEach(() => {
    service = jasmine.createSpyObj('InventoryCountService', ['rack', 'rackSummary']);
    service.rackSummary.and.returnValue(of({ data: [
      { location_id: 31, units: 5, captures: 1, variants: 1 },
      { location_id: 7, units: 3, captures: 1, variants: 1 },
      { location_id: 8, units: 0, captures: 1, variants: 1 },
      { location_id: 11, units: 9, captures: 1, variants: 1 },
    ] }));
    service.rack.and.callFake((_inventory, _session, locationId) => of(
      locationId === 31 ? result(5, 7, 31) : locationId === 7 ? result(3, 7) : locationId === 8 ? result(0, 8, 8) : result(),
    ));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: InventoryCountService, useValue: service }] });
  });

  function setup() {
    const fixture = TestBed.createComponent(InventoryRackComponent);
    fixture.componentRef.setInput('inventoryId', 3);
    fixture.componentRef.setInput('sessionId', 1);
    fixture.componentRef.setInput('warehouseId', 4);
    fixture.componentRef.setInput('activeLocationId', null);
    fixture.componentRef.setInput('options', { locations: [...levels, other], location_tree: [zoneA, zoneB, ...levels, other] });
    fixture.detectChanges();
    return fixture;
  }

  function expand(fixture: ReturnType<typeof setup>, locationId: number) {
    fixture.nativeElement.querySelector(`#rack-level-toggle-${locationId}`).click();
    fixture.detectChanges();
  }
  it('keeps the physical level order, options and zero captures', () => {
    const fixture = setup();
    expect(fixture.componentInstance.shelves.map(shelf => shelf.label)).toEqual(['SUPERIOR', 'FILA 1', 'FILA 2', 'FILA 3', 'FILA 4']);
    expect(service.rack).not.toHaveBeenCalled();
    for (const shelf of fixture.componentInstance.shelves) expand(fixture, shelf.location.id);
    fixture.componentRef.setInput('activeLocationId', 7);
    fixture.detectChanges();
    expect(fixture.componentInstance.totalUnits).toBe(8);
    expect(fixture.nativeElement.querySelectorAll('.rack-product').length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('.shelf-empty').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.shelf-active .shelf-title').textContent).toBe('FILA 1');
    expect(fixture.nativeElement.textContent).toContain('Contado en cero');
    expect(fixture.nativeElement.querySelector('.rack-product-options').textContent).toContain('Tallas: S');
    fixture.destroy();
  });

  it('renders repeated variants as separate captures with their own quantities and edit links', () => {
    const response = result(25, 7);
    const first = response.data[0];
    response.data = [first, { ...first, id: 2, quantity: 13 }, { ...first, id: 3, quantity: 99, status: 'cancelled' }];
    response.summary = { units: 38, captures: 2, variants: 1 };
    response.total = 3;
    service.rackSummary.and.returnValue(of({ data: [{ location_id: 7, units: 38, captures: 2, variants: 1 }] }));
    service.rack.and.callFake((_inventory, _session, locationId) => of(locationId === 7 ? response : result()));
    const fixture = setup();
    expand(fixture, 7);
    const rows: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.rack-product');
    expect(rows.length).toBe(3);
    expect(Array.from(rows).map(row => row.querySelector('.rack-product-quantity strong')?.textContent)).toEqual(['25', '13', '99']);
    expect(fixture.componentInstance.totalUnits).toBe(38);
    expect(rows[0].querySelector('.rack-capture-edit')?.getAttribute('href')).toContain('/707/edit');
    expect(rows[1].querySelector('.rack-capture-edit')?.getAttribute('href')).toContain('/2/edit');
    expect(rows[2].classList).toContain('rack-product-inactive');
    fixture.destroy();
  });

  it('keeps full shelf totals while appending individual captures from later pages', () => {
    service.rackSummary.and.returnValue(of({ data: [{ location_id: 7, units: 40, captures: 21, variants: 1 }] }));
    service.rack.and.callFake((_inventory, _session, locationId, page) => {
      const response = locationId === 7 ? result(page === 1 ? 3 : 4, 7) : result();
      if (locationId === 7) {
        response.data[0].id = page === 1 ? 1 : 2;
        response.current_page = page ?? 1;
        response.last_page = 2;
        response.summary = { units: 40, captures: 21, variants: 1 };
        response.total = 21;
      }
      return of(response);
    });
    const fixture = setup();
    expand(fixture, 7);
    const shelf = fixture.componentInstance.shelves.find(shelf => shelf.location.id === 7)!;
    fixture.componentInstance.loadShelf(shelf);
    fixture.detectChanges();
    expect(service.rack).toHaveBeenCalledWith(3, 1, 7, 2);
    expect(shelf.items.map(item => item.id)).toEqual([1, 2]);
    expect(shelf.totalRecords).toBe(21);
    expect(fixture.componentInstance.totalUnits).toBe(40);
    fixture.destroy();
  });

  it('cancels old requests when switching zones', () => {
    const old = new Subject<InventoryRackResponse>();
    service.rack.and.callFake((_inventory, _session, locationId) => locationId === 11 ? of(result(9, 9, 11)) : old);
    const fixture = setup();
    expand(fixture, 7);
    fixture.componentRef.setInput('activeLocationId', null);
    fixture.detectChanges();
    fixture.componentInstance.selectZone('2');
    fixture.detectChanges();
    expand(fixture, 11);
    old.next(result(99, 99));
    fixture.detectChanges();
    expect(fixture.componentInstance.shelves.map(shelf => shelf.location.id)).toEqual([11]);
    expect(fixture.nativeElement.querySelector('#virtual-rack-title').textContent).toBe('Estante B');
    expect(fixture.componentInstance.totalUnits).toBe(9);
    fixture.destroy();
  });

  it('allows starting a capture directly from an independent level', () => {
    const fixture = setup();
    fixture.componentRef.setInput('canCapture', true);
    fixture.detectChanges();
    const capture = spyOn(fixture.componentInstance.captureLocation, 'emit');
    fixture.nativeElement.querySelector('.rack-shelf[aria-label="FILA 2"] .shelf-count-here').click();
    expect(capture).toHaveBeenCalledOnceWith(8);
    expect(service.rack).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('#rack-zone').textContent).toContain('Estante A');
    fixture.componentRef.setInput('canCapture', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.shelf-count-here')).toBeNull();
    fixture.destroy();
  });

  it('offers Contar aquí on racks without rows and on leaves of deeper hierarchies', () => {
    const fixture = setup();
    const standalone = node(3, 'Zona completa', null);
    const section = node(50, 'Sección 1', 1);
    const bin = node(51, 'Nivel 1', 50);
    fixture.componentRef.setInput('options', {
      locations: [standalone, bin],
      location_tree: [zoneA, standalone, section, bin],
    });
    fixture.componentRef.setInput('canCapture', true);
    fixture.detectChanges();
    const capture = spyOn(fixture.componentInstance.captureLocation, 'emit');
    expect(fixture.nativeElement.querySelector('.shelf-title').textContent).toBe('Sección 1 / Nivel 1');
    fixture.nativeElement.querySelector('.shelf-count-here').click();
    expect(capture).toHaveBeenCalledWith(51);
    fixture.componentRef.setInput('activeLocationId', null);
    fixture.detectChanges();
    fixture.componentInstance.selectZone('3');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.shelf-title').textContent).toBe('Capturas de esta zona');
    expect(fixture.nativeElement.querySelector('.rack-summary').textContent).toContain('Conteo directo en esta zona');
    expect(fixture.nativeElement.querySelector('.rack-summary').textContent).not.toContain('1 niveles');
    expect(fixture.nativeElement.querySelector('.rack-shelf .shelf-count-here')).toBeNull();
    fixture.nativeElement.querySelector('.rack-heading .zone-count-here').click();
    expect(capture).toHaveBeenCalledWith(3);
    expect(service.rack).not.toHaveBeenCalled();
    expand(fixture, 3);
    expect(service.rack).toHaveBeenCalledOnceWith(3, 1, 3, 1);
    fixture.destroy();
  });

  it('loads a level only on expansion and reuses its captures when reopened', () => {
    const fixture = setup();
    expect(service.rack).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.shelf-panel')).toBeNull();
    expand(fixture, 7);
    expect(service.rack).toHaveBeenCalledOnceWith(3, 1, 7, 1);
    expect(fixture.nativeElement.querySelector('#rack-level-panel-7')).not.toBeNull();
    expand(fixture, 7);
    expect(fixture.nativeElement.querySelector('#rack-level-panel-7').closest('.shelf-collapse').getAttribute('aria-hidden')).toBe('true');
    expand(fixture, 7);
    expect(service.rack).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('#rack-level-toggle-7').getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('#rack-level-panel-7').closest('.shelf-collapse').hasAttribute('inert')).toBeFalse();
    expect(fixture.componentInstance.totalsComplete).toBeTrue();
    expect(fixture.nativeElement.querySelector('.rack-summary').textContent).toContain('8 unidades vigentes');
    fixture.destroy();
  });

  it('opens only the active location records and reopens them on refresh after counting', () => {
    const fixture = setup();
    fixture.componentRef.setInput('activeLocationId', 7);
    fixture.detectChanges();
    expect(service.rack).toHaveBeenCalledOnceWith(3, 1, 7, 1);
    expect(fixture.nativeElement.querySelector('#rack-level-panel-7')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#rack-level-panel-31')).toBeNull();
    expect(fixture.nativeElement.querySelector('.capture-list-heading').textContent).toContain('3 unidades vigentes');
    expand(fixture, 7);
    service.rack.calls.reset();
    fixture.componentInstance.reload();
    fixture.detectChanges();
    expect(service.rack).toHaveBeenCalledOnceWith(3, 1, 7, 1);
    expect(fixture.nativeElement.querySelector('#rack-level-panel-7')).not.toBeNull();
    fixture.destroy();
  });

  it('closes the finished location while keeping other accordions and cached captures', () => {
    const fixture = setup();
    expand(fixture, 31);
    fixture.componentRef.setInput('activeLocationId', 7);
    fixture.detectChanges();
    service.rack.calls.reset();
    service.rackSummary.calls.reset();
    fixture.componentRef.setInput('activeLocationId', null);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#rack-level-panel-7').closest('.shelf-collapse').getAttribute('aria-hidden')).toBe('true');
    expect(fixture.nativeElement.querySelector('#rack-level-panel-31')).not.toBeNull();
    fixture.componentRef.setInput('activeLocationId', 7);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#rack-level-panel-7').textContent).toContain('Falda Maddie');
    expect(service.rack).not.toHaveBeenCalled();
    expect(service.rackSummary).not.toHaveBeenCalled();
    fixture.destroy();
  });

  it('shows totals in every closed header without requesting any capture rows', () => {
    const fixture = setup();
    expect(fixture.nativeElement.querySelector('#virtual-rack-title').textContent).toBe('Estante A');
    expect(service.rackSummary).toHaveBeenCalledOnceWith(3, 1);
    expect(service.rack).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.shelf-panel')).toBeNull();
    const headers = fixture.nativeElement.querySelectorAll('.shelf-toggle');
    expect(headers[0].textContent).toContain('Total: 5 unidades');
    expect(headers[1].textContent).toContain('Total: 3 unidades');
    expect(headers[2].textContent).toContain('Total: 0 unidades');
    expect(headers[3].textContent).toContain('Total: 0 unidades');
    fixture.destroy();
  });

  it('keeps failed totals unknown and supports retrying without opening the panels', () => {
    service.rackSummary.and.returnValue(throwError(() => new Error('Offline')));
    const fixture = setup();
    expect(fixture.componentInstance.totalsComplete).toBeFalse();
    expect(fixture.nativeElement.querySelector('.shelf-toggle').textContent).not.toContain('Total: 0');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('totales');
    service.rackSummary.and.returnValue(of({ data: [{ location_id: 7, units: 38, captures: 2, variants: 1 }] }));
    fixture.componentInstance.loadSummaries();
    fixture.detectChanges();
    expect(service.rack).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('#rack-level-toggle-7').textContent).toContain('Total: 38 unidades');
    fixture.destroy();
  });

  it('refreshes expanded levels and invalidates closed caches without fetching them', () => {
    const fixture = setup();
    expand(fixture, 7);
    expand(fixture, 31);
    expand(fixture, 31);
    service.rack.calls.reset();
    fixture.componentInstance.reload();
    fixture.detectChanges();
    expect(service.rack).toHaveBeenCalledOnceWith(3, 1, 7, 1);
    expect(fixture.componentInstance.shelves.find(shelf => shelf.location.id === 31)?.page).toBe(0);
    expect(fixture.componentInstance.shelves.find(shelf => shelf.location.id === 7)?.expanded).toBeTrue();
    fixture.destroy();
  });

  it('preserves the open level when action permissions or busy indicators change', () => {
    const fixture = setup();
    expand(fixture, 7);
    service.rack.calls.reset();
    fixture.componentRef.setInput('canDelete', true);
    fixture.componentRef.setInput('deleteBusy', true);
    fixture.componentRef.setInput('deletingId', 707);
    fixture.detectChanges();
    expect(service.rack).not.toHaveBeenCalled();
    expect(fixture.componentInstance.shelves.find(shelf => shelf.location.id === 7)?.expanded).toBeTrue();
    fixture.destroy();
  });

  it('refreshes only the changed location without clearing other loaded levels', () => {
    const fixture = setup();
    expand(fixture, 31);
    expand(fixture, 7);
    const unaffected = fixture.componentInstance.shelves.find(shelf => shelf.location.id === 31)!;
    const items = unaffected.items;
    service.rack.calls.reset();
    service.rackSummary.calls.reset();
    const response = new Subject<InventoryRackResponse>();
    service.rack.and.returnValue(response);
    fixture.componentInstance.refreshLocation(7);
    fixture.detectChanges();
    expect(service.rack).toHaveBeenCalledOnceWith(3, 1, 7, 1);
    expect(service.rackSummary).not.toHaveBeenCalled();
    expect(unaffected.items).toBe(items);
    expect(fixture.nativeElement.querySelectorAll('.rack-product').length).toBe(2);
    response.next(result(13, 7));
    response.complete();
    fixture.detectChanges();
    expect(fixture.componentInstance.totalUnits).toBe(18);
    expect(fixture.nativeElement.querySelectorAll('.rack-product').length).toBe(2);
    expect(unaffected.page).toBe(1);
    fixture.destroy();
  });

  it('cancels stale pagination when refreshing a location', () => {
    const fixture = setup();
    const page = result(3, 7);
    page.last_page = 2;
    service.rack.and.returnValue(of(page));
    expand(fixture, 7);
    const shelf = fixture.componentInstance.shelves.find(shelf => shelf.location.id === 7)!;
    const old = new Subject<InventoryRackResponse>();
    service.rack.and.returnValue(old);
    fixture.componentInstance.loadShelf(shelf);
    service.rack.and.returnValue(of(result(9, 8)));
    fixture.componentInstance.refreshLocation(7);
    old.next(result(99, 99));
    fixture.detectChanges();
    expect(shelf.items.map(item => item.variant_id)).toEqual([8]);
    expect(shelf.summary.units).toBe(9);
    expect(shelf.loading).toBeFalse();
    fixture.destroy();
  });

  it('exposes deletion only for the current author and a valid capture', () => {
    const response = result(25, 7);
    const first = response.data[0];
    response.data = [first, { ...first, id: 2, user_id: 2 }, { ...first, id: 3, status: 'cancelled' }];
    service.rackSummary.and.returnValue(of({ data: [
      { location_id: 31, units: 5, captures: 1, variants: 1 },
      { location_id: 7, units: 3, captures: 1, variants: 1 },
      { location_id: 8, units: 0, captures: 1, variants: 1 },
      { location_id: 11, units: 9, captures: 1, variants: 1 },
    ] }));
    service.rack.and.callFake((_inventory, _session, locationId) => of(locationId === 7 ? response : result()));
    const fixture = setup();
    fixture.componentRef.setInput('options', {
      current_user_id: 1, locations: [...levels, other], location_tree: [zoneA, zoneB, ...levels, other],
    });
    fixture.componentRef.setInput('canDelete', true);
    fixture.detectChanges();
    expand(fixture, 7);
    const remove = spyOn(fixture.componentInstance.deleteCapture, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('.rack-capture-delete');
    expect(buttons.length).toBe(1);
    buttons[0].click();
    expect(remove).toHaveBeenCalledOnceWith(first);
    fixture.componentRef.setInput('canDelete', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.rack-capture-delete')).toBeNull();
    fixture.destroy();
  });
});

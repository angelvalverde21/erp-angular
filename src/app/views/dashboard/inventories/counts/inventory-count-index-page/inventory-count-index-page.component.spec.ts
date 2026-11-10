import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { InventoryCountIndexPageComponent } from './inventory-count-index-page.component';
import { InventoryService } from '../../inventory.service';
import { InventoryWorkspaceService } from '../../inventory-workspace.service';
import { InventorySessionService } from '../../sessions/inventory-session.service';
import { InventoryCountService } from '../inventory-count.service';
import { InventoryRackComponent } from '../inventory-rack/inventory-rack.component';
import { BaseService } from '../../../../base.service';
import Swal from 'sweetalert2';
import { of, Subject, throwError } from 'rxjs';

describe('Count zone and rack row selection', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [
      provideRouter([]),
      { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ inventory_id: '1', session_id: '1' }) } } },
      ...[InventoryService, InventoryWorkspaceService, InventorySessionService, InventoryCountService].map(provide => ({ provide, useValue: {
        rackSummary: () => of({ data: [] }),
        rack: () => of({ data: [], summary: { units: 0, captures: 0, variants: 0 }, current_page: 1, last_page: 1, total: 0 }),
      } })),
    ] });
    TestBed.overrideComponent(InventoryCountIndexPageComponent, { set: { imports: [InventoryRackComponent], schemas: [NO_ERRORS_SCHEMA] } });
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
    (component.load as jasmine.Spy).calls.reset();
    return { fixture, component };
  }

  it('keeps the scanner hidden until Contar aquí is clicked and hides it again on finishing', () => {
    const { fixture, component } = setup();
    expect(fixture.nativeElement.querySelector('app-inventory-count-entry')).toBeNull();
    expect(fixture.nativeElement.querySelector('#count-capture-location-0')).toBeNull();
    fixture.debugElement.query(By.css('app-inventory-rack')).triggerEventHandler('captureLocation', 13);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-inventory-count-entry').locationId).toBe(13);
    expect(fixture.nativeElement.querySelector('app-inventory-count-entry').closest('.rack-shelf').getAttribute('aria-label')).toBe('Fila 3');
    component.savingCount = true;
    component.finishCount();
    expect(component.locationLocked).toBeTrue();
    component.savingCount = false;
    component.finishCount();
    fixture.detectChanges();
    expect(component.selectedLocationPath).toEqual([]);
    expect(fixture.nativeElement.querySelector('app-inventory-count-entry')).toBeNull();
    fixture.destroy();
  });

  it('opens capture for an entire zone without rows and rejects other warehouses and parent zones', () => {
    const { fixture, component } = setup();
    component.startRackCapture(10);
    component.startRackCapture(99);
    expect(component.locationLocked).toBeFalse();
    const standalone = { id: 20, parent_id: null, warehouse_id: 4, name: 'Zona completa', code: 'zona_completa', is_active: true };
    component.options = {
      ...component.options!,
      locations: [...component.options!.locations, standalone],
      location_tree: [...component.options!.location_tree!, standalone],
    };
    component.startRackCapture(20);
    fixture.detectChanges();
    expect(component.selectedLocationPath).toEqual([20]);
    expect(component.selectedLocationLabel).toBe('Zona completa');
    expect(fixture.nativeElement.querySelector('app-inventory-count-entry').locationId).toBe(20);
    fixture.destroy();
  });
  it('starts counting from a rack level and preserves the current capture until it is finished', () => {
    const { fixture, component } = setup();
    component.startRackCapture(13);
    fixture.detectChanges();
    expect(component.selectedLocationPath).toEqual([10, 13]);
    expect(component.selectedLocationId).toBe(13);
    expect(component.locationLocked).toBeTrue();
    expect(component.load).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('app-inventory-count-entry').locationId).toBe(13);
    component.startRackCapture(11);
    expect(component.selectedLocationId).toBe(13);
    component.finishCount();
    component.startRackCapture(99);
    expect(component.selectedLocationId).toBeNull();
  });

  it('cancels deletion without sending a request or removing the capture', async () => {
    const { fixture, component } = setup();
    component.options!.current_user_id = 1;
    const record = { id: 9, user_id: 1, status: 'valid', variant_id: 7, quantity: 25 } as any;
    component.records = [record];
    const service = TestBed.inject(InventoryCountService) as any;
    service.deleteCapture = jasmine.createSpy('deleteCapture').and.returnValue(of(undefined));
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDenied: false, isDismissed: true });
    await component.deleteCapture(record);
    expect(service.deleteCapture).not.toHaveBeenCalled();
    expect(component.records).toEqual([record]);
    fixture.destroy();
  });

  it('deletes once after confirmation and returns to the previous page when the last capture is removed', async () => {
    const { fixture, component } = setup();
    component.options!.current_user_id = 1;
    component.viewMode = 'history';
    component.page = 2;
    const record = { id: 9, user_id: 1, status: 'valid', variant_id: 7, quantity: 25 } as any;
    component.records = [record];
    const response = new Subject<void>();
    const service = TestBed.inject(InventoryCountService) as any;
    service.deleteCapture = jasmine.createSpy('deleteCapture').and.returnValue(response);
    const dialog = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDenied: false, isDismissed: false });
    const first = component.deleteCapture(record);
    const duplicate = component.deleteCapture(record);
    await first;
    await duplicate;
    expect(dialog).toHaveBeenCalledTimes(1);
    expect(service.deleteCapture).toHaveBeenCalledOnceWith(1, 1, 9);
    expect(component.deletingCountId).toBe(9);
    response.next();
    response.complete();
    expect(component.records).toEqual([]);
    expect(component.load).toHaveBeenCalledWith(1);
    expect(component.deleteSuccess).toContain('#9');
    expect(component.deletingCountId).toBeNull();
    fixture.destroy();
  });

  it('keeps the capture and reports a failed deletion', async () => {
    const { fixture, component } = setup();
    component.options!.current_user_id = 1;
    const record = { id: 9, user_id: 1, status: 'valid', variant_id: 7, quantity: 25 } as any;
    component.records = [record];
    const service = TestBed.inject(InventoryCountService) as any;
    service.deleteCapture = jasmine.createSpy('deleteCapture').and.returnValue(throwError(() => new Error('Offline')));
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDenied: false, isDismissed: false });
    await component.deleteCapture(record);
    expect(component.records).toEqual([record]);
    expect(component.deleteError).toBeTruthy();
    expect(component.deletingCountId).toBeNull();
    fixture.destroy();
  });
});

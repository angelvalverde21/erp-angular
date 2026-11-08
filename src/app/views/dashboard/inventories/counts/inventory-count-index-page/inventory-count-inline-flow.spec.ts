import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { BaseService } from '../../../../base.service';
import { InventoryCountIndexPageComponent } from './inventory-count-index-page.component';

const options = { branches: [{ id: 1, name: 'Central' }], warehouses: [{ id: 5, branch_id: 1, name: 'Tienda' }], locations: [{ id: 4, warehouse_id: 5, parent_id: null, name: 'Zona A', code: 'A', is_active: true }] };
const record = { id: 9, inventory_session_id: 3, location_id: 4, variant_id: 7, user_id: 1, quantity: 3, count_round: 1, status: 'valid' as const, counted_at: '2026-11-04T10:00:00Z' };

function configure() {
  TestBed.configureTestingModule({ imports: [InventoryCountIndexPageComponent], providers: [
    provideHttpClient(), provideHttpClientTesting(), provideRouter([]), InventoryCountIndexPageComponent,
    { provide: BaseService, useValue: { store: 'sorelle' } },
    { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ inventory_id: '2', session_id: '3' }) } } },
  ] });
}

function flushContext(http: HttpTestingController): void {
  http.expectOne(req => req.url.endsWith('/inventories/2/details')).flush({ data: { id: 2, name: 'Inventario', status: 'in_progress' } });
  http.expectOne(req => req.url.endsWith('/sessions/3')).flush({ data: { id: 3, inventory_id: 2, warehouse_id: 5, warehouse: { id: 5, name: 'Tienda', branch_id: 1 }, status: 'open' } });
  http.expectOne(req => req.url.endsWith('/work-options')).flush({ data: options });
}

describe('Inline count list flow', () => {
  it('locks a location inside the session warehouse until the capture is finished', () => {
    configure();
    const page = TestBed.inject(InventoryCountIndexPageComponent);
    const http = TestBed.inject(HttpTestingController);
    spyOnProperty(page, 'editable').and.returnValue(true);
    page.session = { id: 3, inventory_id: 2, warehouse_id: 5, user_id: 1, status: 'open', comment: null, started_at: '2026-11-04T10:00:00Z', ended_at: null };
    page.options = { ...options, locations: [...options.locations, { id: 99, warehouse_id: 99, parent_id: null, name: 'Ajena', code: 'X', is_active: true }] };
    expect(page.locations.map(location => location.id)).toEqual([4]);
    page.chooseLocation('99');
    expect(page.locationLocked).toBeFalse();
    page.chooseLocation('4');
    flushContext(http);
    const capture = http.expectOne(req => req.url.endsWith('/sessions/3/counts'));
    expect(capture.request.params.get('location_id')).toBe('4');
    capture.flush({ data: [], total: 0 });
    page.chooseLocation('99');
    expect(page.selectedLocationId).toBe(4);
    page.savingCount = true;
    page.finishCount();
    expect(page.locationLocked).toBeTrue();
    page.savingCount = false;
    page.finishCount();
    flushContext(http);
    const all = http.expectOne(req => req.url.endsWith('/sessions/3/counts'));
    expect(all.request.params.has('location_id')).toBeFalse();
    all.flush({ data: [], total: 0 });
    expect(page.locationLocked).toBeFalse();
    expect(page.selectedLocationId).toBeNull();
    page.ngOnDestroy();
    http.verify();
  });
  it('refreshes the selected location after saving and cancels older refreshes', () => {
    configure();
    const page = TestBed.inject(InventoryCountIndexPageComponent);
    const http = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    page.options = options;
    page.session = { id: 3, inventory_id: 2, warehouse_id: 5, user_id: 1, status: 'open', comment: null, started_at: '2026-11-04T10:00:00Z', ended_at: null };
    page.selectedLocationId = 4;
    page.locationLocked = true;
    page.barcode = '7';
    page.variantId = 7;
    page.onCountSaved();
    flushContext(http);
    const request = http.expectOne(req => req.url.endsWith('/sessions/3/counts'));
    expect(request.request.params.get('location_id')).toBe('4');
    expect(request.request.params.has('variant_id')).toBeFalse();
    request.flush({ data: [record], total: 1, current_page: 1, last_page: 1 });
    expect(page.records[0].id).toBe(9);
    expect(page.selectedLocationId).toBe(4);
    expect(page.barcode).toBe('');
    page.onCountSaved();
    const stale = http.match(req => req.url.includes('/inventories/2/'));
    const latest = { ...record, id: 10, variant_id: 8 };
    page.onCountSaved();
    expect(stale.every(request => request.cancelled)).toBeTrue();
    flushContext(http);
    http.expectOne(req => req.url.endsWith('/sessions/3/counts')).flush({ data: [latest, record], total: 2 });
    expect(page.records[0].id).toBe(10);
    expect(page.selectedLocationId).toBe(4);
    page.editCount(9);
    expect(router.navigate).toHaveBeenCalled();
    page.ngOnDestroy();
    http.verify();
  });

  it('uses the session location immediately without rendering a location selector', () => {
    configure();
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(InventoryCountIndexPageComponent);
    fixture.detectChanges();
    flushContext(http);
    http.expectOne(req => req.url.endsWith('/sessions/3/counts')).flush({ data: [], total: 0 });
    fixture.detectChanges();
    const scanner = fixture.nativeElement.querySelector('#inventory-barcode-input') as HTMLInputElement;
    expect(scanner).not.toBeNull();
    expect(scanner.disabled).toBeTrue();
    expect(scanner.closest('.barcode-input-wrap')?.classList.contains('barcode-input-disabled')).toBeTrue();
    expect(fixture.nativeElement.querySelector('#count-list-location')).toBeNull();
    expect(fixture.nativeElement.querySelector('.count-session-location').textContent).toContain('Tienda');
    const zone = fixture.nativeElement.querySelector('#count-capture-location') as HTMLSelectElement;
    zone.value = '4'; zone.dispatchEvent(new Event('change'));
    flushContext(http);
    http.expectOne(req => req.url.endsWith('/sessions/3/counts')).flush({ data: [], total: 0 });
    fixture.detectChanges();
    expect(scanner.disabled).toBeFalse();
    expect(document.activeElement).toBe(scanner);
    expect(fixture.nativeElement.textContent).not.toContain('Empezar conteo');
    expect(fixture.componentInstance.locationLocked).toBeTrue();
    expect(fixture.componentInstance.selectedLocationId).toBe(4);
    expect(fixture.nativeElement.querySelector('#count-capture-location')).toBeNull();
    expect(document.querySelector('ngb-modal-window')).toBeNull();
    http.verify();
    fixture.destroy();
  });
});

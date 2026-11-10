import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { BaseService } from '../../../../base.service';
import { InventoryCountIndexPageComponent } from './inventory-count-index-page.component';
import { InventoryCountEntryComponent } from '../inventory-count-entry/inventory-count-entry.component';
import { InventoryCountCreateComponent } from '../inventory-count-create/inventory-count-create.component';
import { InventoryCount, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import Swal from 'sweetalert2';

const options = { branches: [{ id: 1, name: 'Central' }], warehouses: [{ id: 5, branch_id: 1, name: 'Tienda' }], locations: [{ id: 4, warehouse_id: 5, parent_id: null, name: 'Zona A', code: 'A', is_active: true }] };
const record = { id: 9, inventory_session_id: 3, location_id: 4, variant_id: 7, user_id: 1, quantity: 3, count_round: 1, status: 'valid' as const, counted_at: '2026-11-04T10:00:00Z' };

function configure() {
  TestBed.configureTestingModule({ imports: [InventoryCountIndexPageComponent], providers: [
    provideHttpClient(), provideHttpClientTesting(), provideRouter([]), InventoryCountIndexPageComponent,
    { provide: BaseService, useValue: { store: 'sorelle' } },
    { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ inventory_id: '2', session_id: '3' }) } } },
  ] });
}

function flushContext(http: HttpTestingController, workspace: InventoryWorkspaceOptions = options): void {
  http.expectOne(req => req.url.endsWith('/inventories/2/details')).flush({ data: { id: 2, name: 'Inventario', status: 'in_progress' } });
  http.expectOne(req => req.url.endsWith('/sessions/3')).flush({ data: { id: 3, inventory_id: 2, warehouse_id: 5, warehouse: { id: 5, name: 'Tienda', branch_id: 1 }, status: 'open' } });
  http.expectOne(req => req.url.endsWith('/work-options')).flush({ data: workspace });
}

function flushLocationCounts(http: HttpTestingController, locationId: number, records: InventoryCount[] = []): void {
  const valid = records.filter(record => record.status === 'valid');
  http.expectOne(req => req.params.get('view') === 'rack' && req.params.get('location_id') === String(locationId)).flush({
    data: records,
    summary: { units: valid.reduce((sum, record) => sum + record.quantity, 0), captures: valid.length, variants: new Set(valid.map(record => record.variant_id)).size },
    current_page: 1, last_page: 1, total: records.length,
  });
}

describe('Inline count list flow', () => {
  it('merges the warehouse into the main header and links an empty warehouse to its own zones', () => {
    configure();
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(InventoryCountIndexPageComponent);
    fixture.detectChanges();
    http.expectOne(req => req.url.endsWith('/inventories/2/details')).flush({ data: { id: 2, name: 'Inventario', status: 'in_progress' } });
    http.expectOne(req => req.url.endsWith('/sessions/3')).flush({ data: {
      id: 3, inventory_id: 2, warehouse_id: 3, status: 'open',
      warehouse: { id: 3, name: 'Tienda 421', subtitle: 'Almacén secundario', branch_id: 1 },
    } });
    http.expectOne(req => req.url.endsWith('/work-options')).flush({ data: {
      locations: [], location_tree: [], warehouses: [{ id: 3, name: 'Tienda 421', branch_id: 1 }],
    } });
    fixture.detectChanges();
    http.expectOne(req => req.params.get('view') === 'rack-summary').flush({ data: [] });
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.inventory-heading');
    expect(header.querySelector('h1').textContent).toBe('Conteos');
    expect(header.querySelector('.count-session-location').textContent).toContain('Tienda 421');
    expect(header.querySelector('.count-session-location').textContent).toContain('Almacén secundario');
    expect(header.querySelector('.heading-actions .count-session-location')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.count-session-location').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.rack-setup-link').getAttribute('href')).toBe('/sorelle/dashboard/branches/1/warehouses/3/locations');
    expect(fixture.nativeElement.querySelector('#rack-zone')).toBeNull();
    expect(fixture.nativeElement.querySelector('.shelf-count-here')).toBeNull();
    http.verify();
    fixture.destroy();
  });

  for (const nested of [false, true]) {
    it(`automatically opens the move destination and saves only there (${nested ? 'nested rows' : 'root zones'})`, async () => {
      configure();
      const warning = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDenied: true, isDismissed: false });
      const root = { ...options.locations[0], id: 20, name: 'Estante principal' };
      const source = { ...options.locations[0], parent_id: nested ? 20 : null, name: nested ? 'Fila 1' : 'Zona A' };
      const destination = { ...source, id: 9, name: nested ? 'Fila 2' : 'Zona B' };
      const workspace: InventoryWorkspaceOptions = {
        ...options, locations: [source, destination], location_tree: nested ? [root, source, destination] : [source, destination],
      };
      const http = TestBed.inject(HttpTestingController);
      const fixture = TestBed.createComponent(InventoryCountIndexPageComponent);
      fixture.detectChanges();
      flushContext(http, workspace);
      fixture.detectChanges();
      http.expectOne(req => req.params.get('view') === 'rack-summary').flush({ data: [] });
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.shelf-count-here').click();
      fixture.detectChanges();
      flushLocationCounts(http, 4);
      const sourceEditor = fixture.debugElement.query(By.directive(InventoryCountCreateComponent)).componentInstance as InventoryCountCreateComponent;
      sourceEditor.searchTerm = '7';
      sourceEditor.requestSearch(new Event('submit', { cancelable: true }));
      http.expectOne(req => req.url.endsWith('/variants/7')).flush({ data: { id: 7, sku: 'SKU', stock: 0, product: { id: 1, name: 'Prenda' } } });
      http.expectOne(req => req.params.get('variant_id') === '7' && !req.params.has('view')).flush({
        data: [], variant_counted_quantity: 12,
        other_locations: [{ location_id: 9, location_path: destination.name, warehouse_id: 5, warehouse_name: 'Tienda', quantity: 12 }],
      });
      await fixture.whenStable();
      fixture.detectChanges();
      const summaries = http.match(req => req.params.get('view') === 'rack-summary');
      expect(summaries.length).toBe(nested ? 0 : 1);
      summaries.forEach(request => request.flush({ data: [] }));
      const previous = { ...record, id: 11, location_id: 9, quantity: 12 };
      flushLocationCounts(http, 9, [previous]);
      fixture.detectChanges();
      expect(fixture.componentInstance.selectedLocationId).toBe(9);
      const destinationEditor = fixture.debugElement.query(By.directive(InventoryCountCreateComponent)).componentInstance as InventoryCountCreateComponent;
      expect(destinationEditor.selectedVariant?.id).toBe(7);
      expect(destinationEditor.form.getRawValue().location_id).toBe(9);
      expect(destinationEditor.form.controls.quantity.value).toBeNull();
      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#count-quantity'));
      expect(fixture.nativeElement.querySelector('#rack-level-toggle-9').getAttribute('aria-expanded')).toBe('true');
      if (nested) expect(fixture.nativeElement.querySelector('#rack-level-toggle-4').getAttribute('aria-expanded')).toBe('false');
      http.expectNone(() => true);
      destinationEditor.form.controls.quantity.setValue(2);
      await destinationEditor.submit();
      const save = http.expectOne(req => req.method === 'POST');
      expect(save.request.body.location_id).toBe(9);
      expect(save.request.body.variant_id).toBe(7);
      save.flush({ data: { ...record, id: 10, location_id: 9, quantity: 2 } });
      flushLocationCounts(http, 9, [{ ...record, id: 10, location_id: 9, quantity: 2 }, previous]);
      fixture.detectChanges();
      expect(warning).toHaveBeenCalledTimes(1);
      expect(fixture.nativeElement.querySelector('.capture-list-heading').textContent).toContain('14 unidades vigentes');
      http.verify();
      fixture.destroy();
    });
  }
  it('locks a location inside the session warehouse until the capture is finished', () => {
    configure();
    const page = TestBed.inject(InventoryCountIndexPageComponent);
    page.viewMode = 'history';
    const http = TestBed.inject(HttpTestingController);
    spyOnProperty(page, 'editable').and.returnValue(true);
    page.session = { id: 3, inventory_id: 2, warehouse_id: 5, user_id: 1, status: 'open', comment: null, started_at: '2026-11-04T10:00:00Z', ended_at: null };
    page.options = { ...options, locations: [...options.locations, { id: 99, warehouse_id: 99, parent_id: null, name: 'Ajena', code: 'X', is_active: true }] };
    expect(page.locations.map(location => location.id)).toEqual([4]);
    page.startRackCapture(99);
    expect(page.locationLocked).toBeFalse();
    page.startRackCapture(4);
    http.expectNone(() => true);
    page.startRackCapture(99);
    expect(page.selectedLocationId).toBe(4);
    page.savingCount = true;
    page.finishCount();
    expect(page.locationLocked).toBeTrue();
    page.savingCount = false;
    page.finishCount();
    http.expectNone(() => true);
    expect(page.locationLocked).toBeFalse();
    expect(page.selectedLocationId).toBeNull();
    page.ngOnDestroy();
    http.verify();
  });
  it('refreshes the selected location after saving and cancels older refreshes', () => {
    configure();
    const page = TestBed.inject(InventoryCountIndexPageComponent);
    page.viewMode = 'history';
    const http = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    page.options = options;
    page.session = { id: 3, inventory_id: 2, warehouse_id: 5, user_id: 1, status: 'open', comment: null, started_at: '2026-11-04T10:00:00Z', ended_at: null };
    page.selectedLocationId = 4;
    page.locationLocked = true;
    page.barcode = '7';
    page.variantId = 7;
    page.onCountSaved(record);
    flushContext(http);
    const request = http.expectOne(req => req.url.endsWith('/sessions/3/counts'));
    expect(request.request.params.get('location_id')).toBe('4');
    expect(request.request.params.has('variant_id')).toBeFalse();
    request.flush({ data: [record], total: 1, current_page: 1, last_page: 1 });
    expect(page.records[0].id).toBe(9);
    expect(page.selectedLocationId).toBe(4);
    expect(page.barcode).toBe('');
    page.onCountSaved(record);
    const stale = http.match(req => req.url.includes('/inventories/2/'));
    const latest = { ...record, id: 10, variant_id: 8 };
    page.onCountSaved(record);
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

  it('opens the scanner only through Contar aquí for a standalone zone', () => {
    configure();
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(InventoryCountIndexPageComponent);
    fixture.detectChanges();
    flushContext(http);
    fixture.detectChanges();
    http.expectOne(req => req.params.get('view') === 'rack-summary').flush({ data: [] });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#inventory-barcode-input')).toBeNull();
    expect(fixture.nativeElement.querySelector('.count-session-location').textContent).toContain('Tienda');
    const button = fixture.nativeElement.querySelector('.rack-heading .zone-count-here') as HTMLButtonElement;
    expect(button).not.toBeNull();
    button.click();
    http.expectNone(req => req.url.endsWith('/work-options') || req.url.endsWith('/details') || req.url.endsWith('/sessions/3'));
    fixture.detectChanges();
    flushLocationCounts(http, 4);
    fixture.detectChanges();
    const scanner = fixture.nativeElement.querySelector('#inventory-barcode-input') as HTMLInputElement;
    expect(scanner).not.toBeNull();
    expect(scanner.disabled).toBeFalse();
    expect(scanner.closest('.zone-capture')).not.toBeNull();
    expect(scanner.closest('.rack-shelf')).toBeNull();
    expect(scanner.closest('.count-session-location')).toBeNull();
    expect(document.activeElement).toBe(scanner);
    expect(fixture.componentInstance.locationLocked).toBeTrue();
    expect(fixture.componentInstance.selectedLocationId).toBe(4);
    expect(fixture.nativeElement.querySelector('#rack-level-panel-4')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-inventory-count-entry').textContent).not.toContain('Selecciona una ubicación para habilitar');
    expect(document.querySelector('ngb-modal-window')).toBeNull();
    const entry = fixture.debugElement.query(By.directive(InventoryCountEntryComponent)).componentInstance as InventoryCountEntryComponent;
    entry.searching = true;
    expect(fixture.componentInstance.canDeleteCounts).toBeFalse();
    entry.searching = false;
    entry.save({ location_id: 4, variant_id: 7, quantity: 3, mode: 'accumulate' });
    const save = http.expectOne(req => req.method === 'POST' && req.url.endsWith('/sessions/3/counts'));
    expect(save.request.body.location_id).toBe(4);
    save.flush({ data: record });
    http.expectNone(req => req.params.get('view') === 'rack-summary');
    flushLocationCounts(http, 4, [record]);
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('.shelf-table');
    expect(table.textContent).toContain('Captura #9');
    expect(fixture.nativeElement.querySelector('.capture-list-heading').textContent).toContain('3 unidades vigentes');
    expect(scanner.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fixture.nativeElement.querySelector('.capture-finish').click();
    http.expectNone(() => true);
    fixture.detectChanges();
    http.expectNone(req => req.params.get('view') === 'rack');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#inventory-barcode-input')).toBeNull();
    expect(fixture.nativeElement.querySelector('.shelf-count-here')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.shelf-table')).toBe(table);
    expect(table.closest('.shelf-collapse').hasAttribute('inert')).toBeTrue();
    expect(fixture.nativeElement.querySelector('#rack-level-toggle-4').getAttribute('aria-expanded')).toBe('false');
    fixture.nativeElement.querySelector('.zone-count-here').click();
    fixture.detectChanges();
    http.expectNone(() => true);
    expect(fixture.nativeElement.querySelector('.shelf-table').textContent).toContain('Captura #9');
    expect(fixture.nativeElement.querySelector('#inventory-barcode-input')).not.toBeNull();
    expect(fixture.componentInstance.loading).toBeFalse();
    http.verify();
    fixture.destroy();
  });

  it('keeps the scanner in the deepest location through collapse, refresh and a failed refresh', () => {
    configure();
    const root = options.locations[0];
    const row = { ...root, id: 5, parent_id: 4, name: 'Fila 1' };
    const bin = { ...root, id: 6, parent_id: 5, name: 'Nivel 2' };
    const workspace: InventoryWorkspaceOptions = { ...options, locations: [bin], location_tree: [root, row, bin] };
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(InventoryCountIndexPageComponent);
    fixture.detectChanges();
    flushContext(http, workspace);
    fixture.detectChanges();
    http.expectOne(req => req.params.get('view') === 'rack-summary').flush({ data: [] });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.shelf-count-here').click();
    fixture.detectChanges();
    flushLocationCounts(http, 6, [{ ...record, location_id: 6 }]);
    fixture.detectChanges();
    const scanner = fixture.nativeElement.querySelector('#inventory-barcode-input') as HTMLInputElement;
    expect(scanner.closest('.rack-shelf')?.getAttribute('aria-label')).toBe('Fila 1 / Nivel 2');
    expect(scanner.closest('.zone-capture')).toBeNull();
    expect(fixture.componentInstance.selectedLocationId).toBe(6);
    const entry = fixture.debugElement.query(By.directive(InventoryCountEntryComponent)).componentInstance as InventoryCountEntryComponent;
    expect(entry.locationId).toBe(6);
    const table = scanner.closest('.rack-shelf')!.querySelector('.shelf-table')!;
    expect(table.textContent).toContain('Captura #9');
    expect(scanner.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    scanner.value = '1234';
    scanner.dispatchEvent(new Event('input'));
    const toggle = fixture.nativeElement.querySelector('#rack-level-toggle-6');
    toggle.click();
    fixture.detectChanges();
    http.expectNone(req => req.params.get('view') === 'rack');
    toggle.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#inventory-barcode-input')).toBe(scanner);
    expect(scanner.value).toBe('1234');
    expect(fixture.nativeElement.querySelector('#rack-zone').disabled).toBeTrue();
    fixture.componentInstance.setViewMode('history');
    expect(fixture.componentInstance.viewMode).toBe('rack');
    fixture.componentInstance.load();
    flushContext(http, structuredClone(workspace));
    fixture.detectChanges();
    http.expectOne(req => req.params.get('view') === 'rack-summary').flush({ data: [] });
    flushLocationCounts(http, 6, [{ ...record, location_id: 6 }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#inventory-barcode-input')).toBe(scanner);
    expect(scanner.value).toBe('1234');
    fixture.componentInstance.load();
    http.expectOne(req => req.url.endsWith('/inventories/2/details')).flush('Offline', { status: 500, statusText: 'Error' });
    http.match(() => true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#inventory-barcode-input')).toBe(scanner);
    expect(scanner.value).toBe('1234');
    http.verify();
    fixture.destroy();
  });
});

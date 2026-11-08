import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseService } from '../../base.service';
import { InventoryService } from './inventory.service';
import { InventoryWorkspaceService } from './inventory-workspace.service';
import { InventoryCountCreateComponent } from './counts/inventory-count-create/inventory-count-create.component';
import { InventoryCountService } from './counts/inventory-count.service';
import { InventoryCountCreatePageComponent } from './counts/inventory-count-create-page/inventory-count-create-page.component';
import { InventoryLocationProgressCreateComponent } from './location-progress/inventory-location-progress-create/inventory-location-progress-create.component';
import { InventoryLocationProgressEditComponent } from './location-progress/inventory-location-progress-edit/inventory-location-progress-edit.component';
import { InventoryLocationProgressCreatePageComponent } from './location-progress/inventory-location-progress-create-page/inventory-location-progress-create-page.component';
import { InventoryLocationProgressService } from './location-progress/inventory-location-progress.service';
import { InventoryAdjustmentEditComponent } from './adjustments/inventory-adjustment-edit/inventory-adjustment-edit.component';

describe('Inventory workspace forms', () => {
  const fb = new FormBuilder();

  it('lists warehouses without zones using the independent options supplied by the API', () => {
    const form = new InventoryCountCreateComponent(fb);
    form.options = {
      branches: [{ id: 1, name: 'Central' }],
      warehouses: [
        { id: 1, name: 'Tienda 421', branch_id: 1 },
        { id: 2, name: 'Tienda 420', branch_id: 1 },
        { id: 3, name: 'Tienda 416', branch_id: 1 },
        { id: 4, name: 'Tienda 422', branch_id: 1 },
      ],
      locations: [],
    };
    form.selectBranch('1');
    expect(form.warehouses.map(warehouse => warehouse.id)).toEqual([1, 2, 3, 4]);
    form.selectWarehouse('3');
    expect(form.zones).toEqual([]);
    form.confirmLocation();
    expect(form.locationConfirmed).toBeFalse();
  });

  it('shows the edit quantity preview only when the original count changes', () => {
    const form = new InventoryCountCreateComponent(fb);
    form.editing = true;
    form.initialQuantity = 19;
    form.selectedVariant = { id: 7, sku: 'SKU', stock: 0 };
    expect(form.currentQuantity).toBe(19);
    form.form.controls.quantity.setValue(19);
    expect(form.hasQuantityChange).toBeFalse();
    form.form.controls.quantity.setValue(24);
    expect(form.hasQuantityChange).toBeTrue();
    form.form.controls.quantity.setValue(19);
    expect(form.hasQuantityChange).toBeFalse();
    form.form.controls.quantity.setValue(-1);
    expect(form.hasQuantityChange).toBeFalse();
  });

  it('filters counting zones by branch and warehouse and clears a zone when its parent changes', () => {
    const form = new InventoryCountCreateComponent(fb);
    form.options = { locations: [
      { id: 4, warehouse_id: 5, parent_id: null, name: 'Zona A', code: 'A', is_active: true, warehouse: { id: 5, name: 'Tienda', branch_id: 1, branch: { id: 1, name: 'Centro' } } },
      { id: 9, warehouse_id: 10, parent_id: null, name: 'Zona B', code: 'B', is_active: true, warehouse: { id: 10, name: 'Depósito', branch_id: 2, branch: { id: 2, name: 'Norte' } } },
    ] };
    expect(form.branches.map(branch => branch.id)).toEqual([1, 2]);
    form.selectBranch('1');
    expect(form.warehouses.map(warehouse => warehouse.id)).toEqual([5]);
    form.selectWarehouse('5');
    expect(form.zones.map(zone => zone.id)).toEqual([4]);
    form.form.controls.location_id.setValue(4);
    expect(form.locationPath).toBe('Centro / Tienda / Zona A');
    form.selectBranch('2');
    expect(form.selectedWarehouseId).toBeNull();
    expect(form.form.controls.location_id.value).toBeNull();
    expect(form.zones).toEqual([]);
  });

  it('requires a zone once and keeps it fixed across saved counts', () => {
    const form = new InventoryCountCreateComponent(fb);
    form.searchTerm = '7';
    expect(form.canSearch).toBeFalse();
    form.confirmLocation();
    expect(form.locationConfirmed).toBeFalse();
    expect(form.form.controls.location_id.touched).toBeTrue();
    form.form.controls.location_id.setValue(4);
    form.confirmLocation();
    expect(form.canSearch).toBeTrue();
    expect(form.form.controls.location_id.disabled).toBeTrue();
    form.chooseVariant({ id: 7, sku: 'SKU', stock: 10 });
    form.completeRegistration({ id: 1, inventory_session_id: 2, location_id: 4, variant_id: 7, user_id: 1, quantity: 3, count_round: 1, status: 'valid', counted_at: '2026-11-04T10:00:00Z' });
    form.nextProduct();
    expect(form.locationConfirmed).toBeTrue();
    expect(form.form.controls.location_id.disabled).toBeTrue();
    expect(form.form.getRawValue().location_id).toBe(4);
  });

  it('clears the previous quantity on a new barcode search and selects a unique result', () => {
    const form = new InventoryCountCreateComponent(fb);
    form.form.controls.location_id.setValue(4);
    form.confirmLocation();
    form.chooseVariant({ id: 7, sku: 'OLD', stock: 20 });
    form.form.controls.quantity.setValue(12);
    form.searchTerm = '  NEW  ';
    const search = spyOn(form.searchVariants, 'emit');
    const event = new Event('submit', { cancelable: true });
    form.requestSearch(event);
    expect(event.defaultPrevented).toBeTrue();
    expect(search).toHaveBeenCalledWith('NEW');
    expect(form.form.controls.quantity.value).toBeNull();
    expect(form.form.controls.location_id.value).toBe(4);
    form.variants = [{ id: 8, sku: 'NEW', stock: 30 }];
    form.ngOnChanges({ variants: new SimpleChange([], form.variants, false) });
    expect(form.selectedVariant?.id).toBe(8);
    expect(form.form.controls.quantity.value).toBeNull();
  });

  it('requires a choice for ambiguous barcode results and previews count quantities independently of stock', () => {
    const form = new InventoryCountCreateComponent(fb);
    form.hasSearched = true;
    form.variants = [{ id: 7, sku: 'A', stock: 100 }, { id: 8, sku: 'B', stock: 200 }];
    form.ngOnChanges({ variants: new SimpleChange([], form.variants, false) });
    expect(form.selectedVariant).toBeNull();
    form.chooseVariant(form.variants[0]);
    form.form.controls.quantity.setValue(5);
    expect(form.quantityReady).toBeTrue();
    expect(form.countSummary).toContain('5 unidades');
    expect(form.selectedVariant?.stock).toBe(100);

  });

  it('records zero and rejects negative or fractional quantities', () => {
    const form = new InventoryCountCreateComponent(fb);
    form.form.controls.location_id.setValue(4);
    form.confirmLocation();
    form.chooseVariant({ id: 7, sku: 'SKU', stock: 10, product: { id: 1, name: 'Producto' } });
    const saved = spyOn(form.save, 'emit');
    form.form.controls.quantity.setValue(-1); form.submit();
    form.form.controls.quantity.setValue(1.5); form.submit();
    expect(saved).not.toHaveBeenCalled();
    form.form.controls.quantity.setValue(0); form.submit();
    expect(saved).toHaveBeenCalledWith({ location_id: 4, variant_id: 7, quantity: 0, mode: 'accumulate' });
  });

  it('links both barcode quantity inputs without counting the global stock', () => {
    const form = new InventoryCountCreateComponent(fb);
    form.chooseVariant({ id: 7, sku: 'SKU', stock: 100 });
    const input = document.createElement('input');
    input.type = 'number';
    input.value = '5';
    form.updateQuantityFromChange(input);
    expect(form.form.controls.quantity.value).toBe(5);
    form.form.controls.quantity.setValue(12);
    expect(form.quantityChange).toBe(12);
    form.initialQuantity = 8;
    input.value = '-3';
    form.updateQuantityFromChange(input);
    expect(form.form.controls.quantity.value).toBe(5);
    input.value = '-9';
    form.updateQuantityFromChange(input);
    expect(form.form.controls.quantity.invalid).toBeTrue();
    input.value = '';
    form.updateQuantityFromChange(input);
    expect(form.form.controls.quantity.value).toBeNull();
  });

  it('allows separate captures of the same variant after saving', () => {
    const form = new InventoryCountCreateComponent(fb);
    form.form.controls.location_id.setValue(4);
    form.confirmLocation();
    form.chooseVariant({ id: 7, sku: 'SKU', stock: 10 });
    form.form.controls.quantity.setValue(3);
    const saved = spyOn(form.save, 'emit');
    form.completeRegistration({ id: 1, inventory_session_id: 2, location_id: 4, variant_id: 7, user_id: 1, quantity: 3, count_round: 1, status: 'valid', counted_at: '2026-11-04T10:00:00Z' });
    expect(form.form.controls.quantity.value).toBeNull();
    expect(form.form.untouched).toBeTrue();
    form.chooseVariant({ id: 7, sku: 'SKU', stock: 10 });
    form.form.controls.quantity.setValue(5);
    form.submit();
    expect(saved).toHaveBeenCalledWith({ location_id: 4, variant_id: 7, quantity: 5, mode: 'accumulate' });
    form.nextProduct();
    form.chooseVariant({ id: 8, sku: 'OTHER', stock: 0 });
    form.form.controls.quantity.setValue(5);
    form.submit();
    expect(saved).toHaveBeenCalledWith({ location_id: 4, variant_id: 8, quantity: 5, mode: 'accumulate' });
    expect(form.form.getRawValue().location_id).toBe(4);
  });

  it('limits progress to the next step and does not reset edits while saving', () => {
    const form = new InventoryLocationProgressEditComponent(fb);
    form.record = { id: 1, inventory_id: 2, location_id: 4, verified_by: null, status: 'in_progress', started_at: null, counted_at: null, verified_at: null };
    form.ngOnChanges({ record: new SimpleChange(null, form.record, true) });
    expect(form.states).toEqual(['in_progress', 'counted']);
    expect(form.form.controls.location_id.disabled).toBeTrue();
    form.form.controls.status.setValue('counted');
    form.ngOnChanges({ saving: new SimpleChange(false, true, false) });
    expect(form.form.controls.status.value).toBe('counted');
  });

  it('requests a fresh adjustment snapshot without supplying client quantities', () => {
    const form = new InventoryAdjustmentEditComponent(fb);
    form.record = { id: 1, inventory_id: 2, variant_id: 7, system_quantity: 10, counted_quantity: 8, difference: -2, status: 'approved', approved_by: 1, approved_at: null, applied_at: null, comment: 'Revisar' };
    form.ngOnChanges({ record: new SimpleChange(null, form.record, true) });
    const saved = spyOn(form.save, 'emit');
    form.refreshCalculation();
    expect(saved).toHaveBeenCalledWith({ variant_id: 7, comment: 'Revisar', refresh: true });
  });
});

describe('Inventory workspace requests', () => {
  it('loads the inventory total when scanning a variant', () => {
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(), provideHttpClientTesting(), provideRouter([]), InventoryCountCreatePageComponent,
      { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ inventory_id: '2', session_id: '3' }) } } },
    ] });
    const http = TestBed.inject(HttpTestingController);
    const page = TestBed.inject(InventoryCountCreatePageComponent);
    const editor = new InventoryCountCreateComponent(new FormBuilder());
    editor.form.controls.location_id.setValue(4);
    Object.defineProperty(page, 'editor', { value: editor });
    page.searchVariants('7');
    http.expectOne(req => req.url.endsWith('/variants/7')).flush({ data: { id: 7, sku: 'SKU', stock: 10 } });
    const lookup = http.expectOne(req => req.url.endsWith('/inventories/2/sessions/3/counts'));
    expect(lookup.request.params.get('variant_id')).toBe('7');
    expect(lookup.request.params.get('location_id')).toBe('4');
    expect(page.searching).toBeTrue();
    lookup.flush({ data: [{ id: 9, variant_id: 7, location_id: 4, quantity: 19, status: 'valid' }], variant_counted_quantity: 24 });
    expect(page.countedQuantity).toBe(24);
    expect(page.variants[0].id).toBe(7);
    expect(page.searching).toBeFalse();
    page.ngOnDestroy();
    http.verify();
  });

  it('sends the barcode variant filter with paginated count requests', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: BaseService, useValue: { store: 'sorelle' } }] });
    const http = TestBed.inject(HttpTestingController);
    const service = TestBed.inject(InventoryCountService);
    service.list(2, 3, 2, 7).subscribe();
    const request = http.expectOne(req => req.url.endsWith('/inventories/2/sessions/3/counts'));
    expect(request.request.params.get('variant_id')).toBe('7');
    expect(request.request.params.get('page')).toBe('2');
    request.flush({ data: [], total: 0 });
    http.verify();
  });

  it('loads saved session counts and refreshes the first history page after recording', () => {
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(), provideHttpClientTesting(), provideRouter([]), InventoryCountCreatePageComponent,
      { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ inventory_id: '2', session_id: '3' }) } } },
    ] });
    const http = TestBed.inject(HttpTestingController);
    const page = TestBed.inject(InventoryCountCreatePageComponent);
    page.loadHistory(2);
    const history = http.expectOne(req => req.url.endsWith('/inventories/2/sessions/3/counts') && req.method === 'GET');
    expect(history.request.params.get('page')).toBe('2');
    history.flush({ data: [{ id: 1, quantity: 3 }], current_page: 2, last_page: 2, total: 21 });
    expect(page.historyRecords[0].id).toBe(1);
    expect(page.historyTotal).toBe(21);
    spyOnProperty(page, 'editable').and.returnValue(true);
    page.save({ location_id: 4, variant_id: 7, quantity: 5, mode: 'accumulate' });
    http.expectOne(req => req.method === 'POST' && req.url.endsWith('/sessions/3/counts')).flush({ data: { id: 22, quantity: 5 } });
    const refresh = http.expectOne(req => req.method === 'GET' && req.url.endsWith('/sessions/3/counts'));
    expect(refresh.request.params.get('page')).toBe('1');
    refresh.flush({ data: [{ id: 22, quantity: 5 }], current_page: 1, last_page: 2, total: 22 });
    expect(page.historyRecords[0].id).toBe(22);
    expect(page.historyPage).toBe(1);
    expect(page.historyLoading).toBeFalse();
    page.ngOnDestroy();
    http.verify();
  });

  it('looks up the scanned variant directly using the barcode endpoint', () => {
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(), provideHttpClientTesting(), provideRouter([]), InventoryCountCreatePageComponent,
      { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ inventory_id: '2', session_id: '3' }) } } },
    ] });
    const http = TestBed.inject(HttpTestingController);
    const page = TestBed.inject(InventoryCountCreatePageComponent);
    page.searchVariants(' 7 ');
    const request = http.expectOne(req => req.url.endsWith('/variants/7'));
    expect(request.request.params.keys()).toEqual([]);
    request.flush({ data: { id: 7, sku: 'SKU', stock: 10 } });
    expect(page.variants.map(variant => variant.id)).toEqual([7]);
    page.searchVariants('999');
    http.expectOne(req => req.url.endsWith('/variants/999')).flush({}, { status: 404, statusText: 'Not Found' });
    expect(page.variants).toEqual([]);
    expect(page.searchError).toBe('');
    page.ngOnDestroy();
    http.verify();
  });

  it('keeps count requests inside the selected inventory and session', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: BaseService, useValue: { store: 'sorelle' } }] });
    const http = TestBed.inject(HttpTestingController);
    const service = TestBed.inject(InventoryCountService);
    service.create(2, 3, { location_id: 4, variant_id: 7, quantity: 5, mode: 'accumulate' }).subscribe();
    const request = http.expectOne(req => req.url.endsWith('/inventories/2/sessions/3/counts'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body.quantity).toBe(5);
    expect(request.request.body.user_id).toBeUndefined();
    request.flush({ data: { id: 1 } });
    http.verify();
  });
});

describe('Location progress validation', () => {
  it('keeps the form and selected location visible after a server field error', async () => {
    const inventory = jasmine.createSpyObj<InventoryService>('InventoryService', ['details']);
    inventory.details.and.returnValue(of({ data: { id: 2, store_id: 1, created_user_id: 1, name: 'General', comment: null, status: 'in_progress', scope_type: null, inventoriable_id: null, started_at: null, completed_at: null, created_at: '2026-11-03T10:00:00Z' } }));
    const workspace = jasmine.createSpyObj<InventoryWorkspaceService>('InventoryWorkspaceService', ['options']);
    workspace.options.and.returnValue(of({ data: { locations: [{ id: 4, warehouse_id: 5, parent_id: null, name: 'Estante', code: 'E', is_active: true }] } }));
    const resource = jasmine.createSpyObj<InventoryLocationProgressService>('InventoryLocationProgressService', ['create']);
    resource.create.and.returnValue(throwError(() => new HttpErrorResponse({ status: 422, error: { errors: { location_id: ['La ubicación ya está registrada.'] } } })));
    TestBed.configureTestingModule({ providers: [
      provideRouter([{ path: 'inventories/:inventory_id/location-progress/create', component: InventoryLocationProgressCreatePageComponent }]),
      { provide: BaseService, useValue: { store: 'sorelle' } }, { provide: InventoryService, useValue: inventory }, { provide: InventoryWorkspaceService, useValue: workspace }, { provide: InventoryLocationProgressService, useValue: resource },
    ] });
    const harness = await RouterTestingHarness.create('/inventories/2/location-progress/create');
    const editor = harness.routeDebugElement!.query(By.directive(InventoryLocationProgressCreateComponent)).componentInstance as InventoryLocationProgressCreateComponent;
    editor.form.controls.location_id.setValue(4);
    editor.submit();
    harness.detectChanges();
    expect(harness.routeDebugElement!.query(By.directive(InventoryLocationProgressCreateComponent)).componentInstance).toBe(editor);
    expect(editor.form.controls.location_id.value).toBe(4);
    expect(harness.routeNativeElement!.querySelector('#progress-location')?.classList.contains('is-invalid')).toBeTrue();
    expect(harness.routeNativeElement!.textContent).toContain('La ubicación ya está registrada.');
  });
});

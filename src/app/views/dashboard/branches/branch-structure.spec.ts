import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BaseService } from '../../base.service';
import { BranchCreateComponent } from './branch-create/branch-create.component';
import { WarehouseCreateComponent } from '../warehouses/warehouse-create/warehouse-create.component';
import { LocationCreateComponent } from '../locations/location-create/location-create.component';
import { WarehouseCreatePageComponent } from '../warehouses/warehouse-create-page/warehouse-create-page.component';
import { BranchService } from './branch.service';
import { WarehouseService } from '../warehouses/warehouse.service';
import { LocationService } from '../locations/location.service';
import { LocationCreatePageComponent } from '../locations/location-create-page/location-create-page.component';
import { markBranchFieldErrors } from './branch-api.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef } from '@angular/core';
import { AddressService } from '../addresses/address.service';

describe('Branch structure forms', () => {
  const fb = new FormBuilder();

  it('loads the selected address for editing and updates the selection without duplicating it', () => {
    const modalRef = { close: jasmine.createSpy('close'), dismiss: jasmine.createSpy('dismiss') };
    const modal = jasmine.createSpyObj<NgbModal>('NgbModal', ['open']);
    modal.open.and.returnValue(modalRef as any);
    const service = jasmine.createSpyObj<AddressService>('AddressService', ['get']);
    const address = { id: 7, name: 'Principal', primary: 'Av. Lima 123', district_id: 150115 };
    service.get.and.returnValue(of({ data: address }));
    const component = new BranchCreateComponent(fb, modal, service);
    component.addresses = [address];
    component.form.controls.address_id.setValue(7);

    component.openAddressModal({} as TemplateRef<unknown>, true);

    expect(service.get).toHaveBeenCalledWith(7);
    expect(component.editingAddress).toEqual(address);
    expect(component.addressLoading).toBeFalse();
    component.receiveCreateAddress({ ...address, primary: 'Av. Lima 456' });
    expect(component.addresses.length).toBe(1);
    expect(component.addresses[0].primary).toBe('Av. Lima 456');
    expect(component.form.controls.address_id.value).toBe(7);
    expect(modalRef.close).toHaveBeenCalled();
    component.ngOnDestroy();
  });

  it('saves the warehouse subtitle without adding it to the name or automatic code', () => {
    const component = new WarehouseCreateComponent(fb);
    component.parentId = 2;
    component.form.patchValue({ name: 'Tienda 420', subtitle: ' Showroom ' });
    const save = spyOn(component.save, 'emit');
    component.submit();

    expect(save).toHaveBeenCalledWith({ branch_id: 2, name: 'Tienda 420', subtitle: 'Showroom', code: 'tienda_420', is_active: true });
    component.ngOnDestroy();
  });

  it('shows the branch address as information without an editable warehouse address', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(WarehouseCreateComponent);
    fixture.componentRef.setInput('branchAddress', { id: 4, name: 'Sucursal Principal', primary: 'Av. Lima 123' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Av. Lima 123');
    expect(fixture.nativeElement.textContent).toContain('Editar sucursal');
    expect(fixture.nativeElement.querySelector('input[formControlName="address"]')).toBeNull();
    expect(fixture.componentInstance.form.get('address')).toBeNull();
  });

  it('opens AddressCreate in a modal and selects its saved address without losing branch data', () => {
    const modalRef = { close: jasmine.createSpy('close'), dismiss: jasmine.createSpy('dismiss') };
    const modal = jasmine.createSpyObj<NgbModal>('NgbModal', ['open']);
    modal.open.and.returnValue(modalRef as any);
    const component = new BranchCreateComponent(fb, modal);
    component.form.patchValue({ name: 'Miraflores', code: 'MIR-01' });
    component.addresses = [{ id: 1, name: 'Lima', primary: 'Av. Lima 1' }];
    const content = {} as TemplateRef<unknown>;
    component.openAddressModal(content);
    expect(modal.open).toHaveBeenCalledWith(content, jasmine.objectContaining({ size: 'lg', backdrop: 'static' }));

    const address = { id: 7, name: 'Miraflores', primary: 'Av. Lima 123' };
    component.receiveCreateAddress(address);

    expect(component.addresses).toEqual([{ id: 1, name: 'Lima', primary: 'Av. Lima 1' }, address]);
    expect(component.form.controls.address_id.value).toBe(7);
    expect(component.form.controls.name.value).toBe('Miraflores');
    expect(component.form.controls.code.value).toBe('MIR-01');
    expect(modalRef.close).toHaveBeenCalled();
    component.ngOnDestroy();
  });

  it('marks a server validation error on its field and clears it when edited', () => {
    const component = new BranchCreateComponent(fb);
    component.form.patchValue({ name: 'Lima', code: 'LIM' });
    markBranchFieldErrors(component.form, new HttpErrorResponse({ status: 422, error: { errors: { code: ['El código ya existe.'] } } }));
    expect(component.form.controls.code.touched).toBeTrue();
    expect(component.form.controls.code.getError('server')).toBe('El código ya existe.');
    expect(component.form.controls.name.valid).toBeTrue();
    component.form.controls.code.setValue('LIM-02');
    expect(component.form.controls.code.valid).toBeTrue();
  });

  it('validates required branch fields and emits normalized data', () => {
    const component = new BranchCreateComponent(fb);
    const saved = spyOn(component.save, 'emit');
    component.submit();
    expect(saved).not.toHaveBeenCalled();
    component.form.patchValue({ name: '  Lima  ', code: '  LIM-01  ', is_main: true });
    component.submit();
    expect(saved).toHaveBeenCalledWith({ name: 'Lima', code: 'LIM-01', address_id: null, is_main: true, is_active: true });
  });

  it('associates the warehouse with the selected branch and blocks repeated submission while saving', () => {
    const component = new WarehouseCreateComponent(fb);
    component.parentId = 7;
    component.form.patchValue({ name: 'Central', code: 'ALM' });
    const saved = spyOn(component.save, 'emit');
    component.submit();
    expect(saved).toHaveBeenCalledWith({ branch_id: 7, name: 'Central', subtitle: null, code: 'ALM', is_active: true });
    expect(component.form.get('address')).toBeNull();
    component.saving = true;
    component.submit();
    expect(saved).toHaveBeenCalledTimes(1);
  });

  it('generates a location code and submits its warehouse and parent', () => {
    const component = new LocationCreateComponent(fb);
    component.parentId = 8;
    component.initialParentId = 4;
    component.form.patchValue({ name: 'Estante' });
    const saved = spyOn(component.save, 'emit');
    component.submit();
    expect(saved).toHaveBeenCalledWith({ warehouse_id: 8, parent_id: 4, name: 'Estante', code: 'estante', is_active: true });
  });
});

describe('Create a sublocation from the hierarchy', () => {
  for (const [requestedParent, expectedParent] of [[11, 11], [99, null]]) {
    it('accepts only a parent present in the selected warehouse: ' + requestedParent, () => {
      const locations = jasmine.createSpyObj<LocationService>('LocationService', ['options']);
      locations.options.and.returnValue(of({ data: [{ id: 11, warehouse_id: 5, parent_id: null, name: 'Zona A', code: 'A', is_active: true }] }));
      const warehouses = jasmine.createSpyObj<WarehouseService>('WarehouseService', ['show']);
      warehouses.show.and.returnValue(of({ data: { id: 5, branch_id: 9, name: 'Central', code: 'ALM', address: null, is_active: true } }));
      const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
      const route = { snapshot: { paramMap: convertToParamMap({ branch_id: '9', warehouse_id: '5' }), queryParamMap: convertToParamMap({ parent_id: String(requestedParent) }) } } as ActivatedRoute;
      const page = new LocationCreatePageComponent(locations, router, warehouses, route);
      page.ngOnInit();
      expect(locations.options).toHaveBeenCalledWith(5);
      expect(page.initialParentId).toBe(expectedParent);
      expect(page.loading).toBeFalse();
      page.ngOnDestroy();
    });
  }
});

describe('Branch structure API integration', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: BaseService, useValue: { store: 'sorelle' } }] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('sends the parent filters and pagination to the API', () => {
    TestBed.inject(BranchService).list(2).subscribe();
    const branches = http.expectOne(request => request.url.endsWith('/sorelle/dashboard/branches'));
    expect(branches.request.params.get('page')).toBe('2');
    branches.flush({ data: [], current_page: 2, last_page: 2 });
    TestBed.inject(WarehouseService).list(3).subscribe();
    const warehouses = http.expectOne(request => request.url.endsWith('/warehouses'));
    expect(warehouses.request.params.get('branch_id')).toBe('3');
    warehouses.flush({ data: [] });
    TestBed.inject(LocationService).options(5).subscribe();
    const locations = http.expectOne(request => request.url.endsWith('/locations'));
    expect(locations.request.params.get('warehouse_id')).toBe('5');
    expect(locations.request.params.get('all')).toBe('1');
    locations.flush({ data: [] });
  });
});

describe('Warehouse creation page', () => {
  it('captures the route context and keeps the form available after a server validation error', () => {
    const warehouse = jasmine.createSpyObj<WarehouseService>('WarehouseService', ['create']);
    warehouse.create.and.returnValue(throwError(() => new HttpErrorResponse({ status: 422, error: { errors: { code: ['El código ya existe.'] } } })));
    const branch = jasmine.createSpyObj<BranchService>('BranchService', ['show']);
    branch.show.and.returnValue(of({ data: { id: 9, store_id: 1, address_id: null, name: 'Lima', code: 'LIM', is_main: false, is_active: true } }));
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const route = { snapshot: { paramMap: convertToParamMap({ branch_id: '9' }) } } as ActivatedRoute;
    const component = new WarehouseCreatePageComponent(warehouse, router, branch, route);
    component.ngOnInit();
    expect(component.parentId).toBe(9);
    expect(component.context?.name).toBe('Lima');
    component.save({ branch_id: 9, name: 'Central', code: 'ALM', is_active: true });
    expect(component.saving).toBeFalse();
    expect(component.error).toBe('El código ya existe.');
    expect(router.navigate).not.toHaveBeenCalled();
    component.ngOnDestroy();
  });
});

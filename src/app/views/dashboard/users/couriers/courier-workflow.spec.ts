import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { CourierCreateComponent } from './courier-create/courier-create.component';
import { CourierEditComponent } from './courier-edit/courier-edit.component';
import { CourierIndexComponent } from './courier-index/courier-index.component';
import { CourierIndexPageComponent } from './courier-index-page/courier-index-page.component';
import { CourierSelectedComponent } from './courier-selected/courier-selected.component';
import { CourierEditPageComponent } from './courier-edit-page/courier-edit-page.component';
import { CourierService } from './courier.service';
import { BaseService } from '../../../base.service';
import { Courier } from './courier.model';
import { AddressIndexComponent } from '../../addresses/address-index/address-index.component';

describe('Courier management without users', () => {
  const courier: Courier = {
    id: 5,
    name: 'SHALOM',
    phone: null,
    status: 1,
    is_cod: false,
    freight_collect: true,
    delivery_type: 'agency',
    addresses_count: 1,
    addresses: [{ id: 10, name: 'Lima', primary: 'Av. Lima 123' }],
  };
  let service: jasmine.SpyObj<CourierService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('CourierService', ['store', 'update', 'list', 'index', 'agency', 'express', 'get', 'addresses']);
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    TestBed.configureTestingModule({
      providers: [
        { provide: CourierService, useValue: service },
        { provide: BaseService, useValue: { stores: () => of({ data: [] }) } },
        provideRouter([]),
      ],
    });
  });

  it('creates a courier with its own fields and without email, document or user ID', () => {
    service.store.and.returnValue(of({ data: courier }));
    const fixture = TestBed.createComponent(CourierCreateComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const created = spyOn(component.emitCourierCreate, 'emit');
    component.form.patchValue({ name: 'SHALOM', freight_collect: true });

    component.create();

    expect(service.store).toHaveBeenCalledOnceWith({
      name: 'SHALOM', phone: '', status: 1, delivery_type: 'agency', is_cod: false, freight_collect: true,
    });
    expect(created).toHaveBeenCalledWith(courier);
    expect(component.loadingIcon).toBeFalse();
  });

  it('edits a courier and persists disabled payment flags without requiring user fields', () => {
    service.update.and.returnValue(of({ data: { ...courier, freight_collect: false } }));
    const fixture = TestBed.createComponent(CourierEditComponent);
    fixture.componentRef.setInput('courier', courier);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.form.patchValue({ freight_collect: false });

    component.update();

    expect(service.update.calls.mostRecent().args[1].freight_collect).toBeFalse();
    expect(component.form.valid).toBeTrue();
    expect(component.loadingIcon).toBeFalse();
  });

  it('rejects blank names and releases the saving state after API validation errors', () => {
    service.store.and.returnValue(throwError(() => ({ error: { errors: { name: ['Nombre inválido.'] } } })));
    const fixture = TestBed.createComponent(CourierCreateComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.form.patchValue({ name: '   ' });
    component.create();
    expect(service.store).not.toHaveBeenCalled();

    component.form.patchValue({ name: 'SHALOM' });
    component.create();
    expect(component.loadingIcon).toBeFalse();
    expect(Swal.fire).toHaveBeenCalledWith('No se pudo crear', 'Nombre inválido.', 'error');
  });

  it('renders standalone couriers in the list', () => {
    const fixture = TestBed.createComponent(CourierIndexComponent);
    fixture.componentRef.setInput('couriers', [courier]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('SHALOM');
    expect(fixture.nativeElement.textContent).toContain('Flete por cobrar');
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe('/5');
  });

  it('keeps the server pagination and filters when loading a different page', () => {
    service.list.and.returnValue(of({ data: [courier], total: 30, last_page: 2 }));
    const fixture = TestBed.createComponent(CourierIndexPageComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.search = 'Shalom';
    component.status = '1';
    component.deliveryType = 'agency';
    component.load(2);

    expect(service.list).toHaveBeenCalledWith(2, 'Shalom', '1', 'agency');
    expect(component.total).toBe(30);
    expect(component.lastPage).toBe(2);
  });

  it('resolves an existing order address using courier fields', () => {
    service.index.and.returnValue(of({ data: [courier] }) as any);
    const fixture = TestBed.createComponent(CourierSelectedComponent);
    fixture.componentInstance.writeValue(10);
    fixture.detectChanges();

    expect(fixture.componentInstance.courier_id).toBe(5);
    expect(fixture.componentInstance.couriers[0].name).toBe('SHALOM');
    expect(fixture.componentInstance.couriers[0].freight_collect).toBeTrue();
    expect(fixture.componentInstance.courier_address_id).toBe(10);
  });

  it('loads offices from Laravel by page and searches beyond the currently loaded page', fakeAsync(() => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { paramMap: convertToParamMap({ courier_id: '5' }) } },
    });
    service.get.and.returnValue(of({ data: { ...courier, addresses: undefined, addresses_count: 534 } }));
    service.addresses.and.returnValue(of({ data: [], total: 534, last_page: 27 }));
    const fixture = TestBed.createComponent(CourierEditPageComponent);
    fixture.detectChanges();
    tick(250);

    expect(service.addresses).toHaveBeenCalledWith(5, 1, '');
    expect(fixture.componentInstance.addressLastPage).toBe(27);

    fixture.componentInstance.loadAddresses(2);
    tick(250);
    expect(service.addresses).toHaveBeenCalledWith(5, 2, '');

    fixture.componentInstance.addressSearch = 'Arequipa';
    fixture.componentInstance.loadAddresses();
    tick(250);
    expect(service.addresses).toHaveBeenCalledWith(5, 1, 'Arequipa');
    fixture.destroy();
  }));

  it('shows readable courier office details and an explicit edit action', () => {
    const fixture = TestBed.createComponent(AddressIndexComponent);
    fixture.componentRef.setInput('addressable_type', 'courier');
    fixture.componentRef.setInput('addresses', [{
      id: 10, name: 'Oficina Lima', primary: 'Av. Lima 123', district_id: 150115,
      district: { name: 'La Victoria' }, phone: null,
    }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Oficina Lima');
    expect(fixture.nativeElement.textContent).toContain('Sin teléfono');
    expect(fixture.nativeElement.textContent).toContain('Ubigeo 150115');
    expect(fixture.nativeElement.querySelector('button').getAttribute('aria-label')).toBe('Editar oficina Oficina Lima');
  });
});

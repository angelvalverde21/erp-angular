import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { BaseService } from 'src/app/views/base.service';
import { SupplierService } from '../suppliers/supplier.service';
import { CustomerService } from '../customers/customer.service';
import { SupplierCreateComponent } from '../suppliers/supplier-create/supplier-create.component';
import { SupplierEditComponent } from '../suppliers/supplier-edit/supplier-edit.component';
import { CustomerCreateComponent } from '../customers/customer-create/customer-create.component';
import { CustomerCreatePageComponent } from '../customers/customer-create-page/customer-create-page.component';
import { CustomerEditComponent } from '../customers/customer-edit/customer-edit.component';
import { SupplierIndexPageComponent } from '../suppliers/supplier-index-page/supplier-index-page.component';
import { ContactDirectoryComponent } from './contact-directory/contact-directory.component';
import { contactRow } from './contact-directory/contact-directory.model';
import { loadContactDirectory } from './contact-directory/load-contact-directory';
import { FormControl, FormGroup } from '@angular/forms';
import { SupplierAddressService } from '../suppliers/supplier-address-selection/supplier-address.service';
import { SupplierAddressSelectionComponent } from '../suppliers/supplier-address-selection/supplier-address-selection.component';

describe('Client and supplier directories', () => {
  let suppliers: jasmine.SpyObj<SupplierService>;
  let customers: jasmine.SpyObj<CustomerService>;
  let addresses: jasmine.SpyObj<SupplierAddressService>;
  beforeEach(() => {
    suppliers = jasmine.createSpyObj('SupplierService', ['store', 'update', 'index']);
    customers = jasmine.createSpyObj('CustomerService', ['store', 'update', 'index']);
    addresses = jasmine.createSpyObj('SupplierAddressService', ['addresses']);
    TestBed.configureTestingModule({ providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: SupplierService, useValue: suppliers },
      { provide: CustomerService, useValue: customers },
      { provide: SupplierAddressService, useValue: addresses },
    ] });
  });

  it('uses supplier IDs for suppliers and existing user IDs for customer links', () => {
    const record = { id: 7, user_id: 91, user: { id: 91, name: 'María', status: '0' } };
    expect(contactRow(record, 'supplier').routeId).toBe(7);
    expect(contactRow(record, 'customer').routeId).toBe(91);
    expect(contactRow(record, 'customer').active).toBeFalse();
  });

  it('filters names without accents and contact details, resets pagination and exposes real links', () => {
    const fixture = TestBed.createComponent(ContactDirectoryComponent);
    fixture.componentRef.setInput('kind', 'customer');
    fixture.componentRef.setInput('records', [
      { id: 7, user_id: 91, user: { name: 'María Torres', phone: '999888777', status: 1 } },
      ...Array.from({ length: 21 }, (_, i) => ({ id: 100 + i, name: 'Cliente ' + i, status: 0 })),
    ]);
    fixture.detectChanges();
    expect(fixture.componentInstance.pages).toBe(2);
    expect(fixture.nativeElement.querySelector('.contact-name').getAttribute('href')).toBe('/91');
    fixture.componentInstance.page = 2;
    fixture.componentInstance.query = 'maria';
    fixture.componentInstance.applyFilters(); fixture.detectChanges();
    expect(fixture.componentInstance.page).toBe(1);
    expect(fixture.componentInstance.filtered.length).toBe(1);
    fixture.componentInstance.query = '999888777';
    fixture.componentInstance.status = 'blocked';
    fixture.componentInstance.applyFilters(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No encontramos coincidencias');
    fixture.destroy();
  });

  it('loads all supplier pages without dropping entries beyond the first page', () => {
    suppliers.index.and.callFake((page = 1) => of({ data: [{ id: page }], current_page: page, last_page: 2 }) as any);
    let records: any[] = [];
    loadContactDirectory(suppliers).subscribe(result => records = result);
    expect(records.map(record => record.id)).toEqual([1, 2]);
    expect(suppliers.index).toHaveBeenCalledTimes(2);
  });

  it('shows a retry and clears loading if the directory request fails', () => {
    suppliers.index.and.returnValue(throwError(() => ({ status: 500 })));
    const fixture = TestBed.createComponent(SupplierIndexPageComponent); fixture.detectChanges();
    expect(fixture.componentInstance.loading).toBeFalse();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    suppliers.index.and.returnValue(of({ data: [] }) as any);
    fixture.nativeElement.querySelector('[role="alert"] button').click(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    fixture.destroy();
  });

  it('validates supplier creation, prevents duplicate saves and preserves entered data on server errors', () => {
    const fixture = TestBed.createComponent(SupplierCreateComponent); fixture.detectChanges();
    const editor = fixture.componentInstance;
    editor.create(); expect(suppliers.store).not.toHaveBeenCalled();
    editor.form.patchValue({ name: 'Textiles Norte', phone: '999888777', primary: 'Av. Lima 123', district_id: 1 });
    const request = new Subject<any>(); suppliers.store.and.returnValue(request);
    editor.create(); editor.create();
    expect(suppliers.store).toHaveBeenCalledTimes(1);
    request.error({ error: { errors: { email: ['El correo ya existe.'] } } }); fixture.detectChanges();
    expect(editor.form.enabled).toBeTrue();
    expect(editor.form.get('name')?.value).toBe('Textiles Norte');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('El correo ya existe');
    fixture.destroy();
  });

  it('reuses addressform once and separates supplier data from its default address in one request', () => {
    suppliers.store.and.returnValue(of({ data: { id: 12, user: { name: 'Textiles Norte' }, addresses: [{ id: 7, is_default: true }] } }));
    const fixture = TestBed.createComponent(SupplierCreateComponent); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-address-form').length).toBe(1);
    expect(fixture.nativeElement.querySelector('app-supplier-form')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('form').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('[formControlName="name"]').length).toBe(1);
    fixture.componentInstance.form.patchValue({
      name: '  Textiles Norte  ', phone: '999888777', email: 'textiles@example.test', document_number: '20123456789',
      primary: '  Av. Lima 123  ', district_id: 1, secondary: 'Oficina 2', references: 'Frente al parque',
    });
    const created = spyOn(fixture.componentInstance.emitSupplierCreate, 'emit');
    fixture.componentInstance.create();
    const payload = suppliers.store.calls.mostRecent().args[0];
    expect(payload.name).toBe('Textiles Norte');
    expect(payload.primary).toBeUndefined();
    expect(payload.district_id).toBeUndefined();
    expect(payload.address).toEqual({ primary: 'Av. Lima 123', district_id: 1, secondary: 'Oficina 2', references: 'Frente al parque' });
    expect(created).toHaveBeenCalledWith(jasmine.objectContaining({ id: 12 }));
    fixture.destroy();
  });

  it('edits supplier contact fields without requiring a new address and allows clearing optional data', () => {
    suppliers.update.and.returnValue(of({ data: { id: 7, name: 'Proveedor' } }));
    const fixture = TestBed.createComponent(SupplierEditComponent);
    fixture.componentRef.setInput('supplier', { id: 7, user: { id: 91, name: 'Proveedor', email: null, phone: null, status: 1 } });
    fixture.detectChanges();
    expect(fixture.componentInstance.form.contains('address')).toBeFalse();
    fixture.componentInstance.update();
    expect(suppliers.update).toHaveBeenCalledWith(7, jasmine.objectContaining({ identity_id: null, phone: '', email: '' }));
    fixture.destroy();
  });

  it('creates customers with only required contact data and navigates to their user ID', () => {
    customers.store.and.returnValue(of({ data: { id: 7, user_id: 91 } }));
    const fixture = TestBed.createComponent(CustomerCreateComponent); fixture.detectChanges();
    fixture.componentInstance.form.patchValue({ name: 'María Torres', email: 'maria@example.test' });
    const emitted = spyOn(fixture.componentInstance.emitCustomerCreate, 'emit');
    fixture.componentInstance.create();
    expect(customers.store).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'María Torres', email: 'maria@example.test' }));
    expect(emitted).toHaveBeenCalledWith({ id: 7, user_id: 91 });
    fixture.destroy();
    const page = TestBed.createComponent(CustomerCreatePageComponent);
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));
    page.componentInstance.receiveCustomerCreate({ id: 7, user_id: 91 });
    expect(navigate.calls.mostRecent().args[0]).toEqual(['../', 91]);
    page.destroy();
  });

  it('preserves customer roles when updating contact data without assigned roles', () => {
    customers.update.and.returnValue(of({ data: { id: 91 } }));
    const fixture = TestBed.createComponent(CustomerEditComponent);
    fixture.componentRef.setInput('customer', { id: 91, name: 'Cliente', email: 'cliente@example.test', status: 1, roles: [] });
    fixture.detectChanges(); fixture.componentInstance.update();
    expect(customers.update.calls.mostRecent().args[1].roles).toBeUndefined();
    fixture.destroy();
  });

  function addressPicker() {
    const form = new FormGroup({ supplier_id: new FormControl<number | null>(12), supplier_address_id: new FormControl<number | null>(null) });
    const fixture = TestBed.createComponent(SupplierAddressSelectionComponent);
    fixture.componentRef.setInput('form', form); fixture.detectChanges();
    return { fixture, form };
  }
  const office = { id: 7, name: 'Oficina', primary: 'Av. Lima 123', is_default: true };
  const workshop = { id: 8, name: 'Taller', primary: 'Av. Lima 456', is_default: false };

  it('selects a single address without asking the user to choose', () => {
    addresses.addresses.and.returnValue(of({ data: [office] }));
    const { fixture, form } = addressPicker();
    expect(form.controls.supplier_address_id.value).toBe(7);
    expect(fixture.nativeElement.querySelector('input[type="radio"]')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('seleccionada automáticamente');
    fixture.destroy();
  });

  it('displays every address, suggests the default and preserves an explicit selection', () => {
    addresses.addresses.and.returnValue(of({ data: [office, workshop] }));
    const { fixture, form } = addressPicker();
    expect(form.controls.supplier_address_id.value).toBe(7);
    expect(fixture.nativeElement.querySelectorAll('input[type="radio"]').length).toBe(2);
    fixture.componentInstance.select(8); fixture.detectChanges();
    expect(form.controls.supplier_address_id.value).toBe(8);
    expect(form.controls.supplier_address_id.dirty).toBeTrue();
    fixture.componentInstance.reload(); fixture.detectChanges();
    expect(form.controls.supplier_address_id.value).toBe(8);
    fixture.destroy();
  });

  it('ignores stale address responses when the supplier changes', () => {
    const previous = new Subject<any>(), current = new Subject<any>();
    addresses.addresses.and.returnValues(previous, current);
    const { fixture, form } = addressPicker();
    form.controls.supplier_id.setValue(13);
    previous.next({ data: [office] }); current.next({ data: [workshop] }); fixture.detectChanges();
    expect(form.controls.supplier_address_id.value).toBe(8);
    expect(fixture.nativeElement.textContent).not.toContain(office.primary);
    fixture.destroy();
  });

  it('blocks an unresolved address request and allows retrying without clearing the rest of the purchase', () => {
    addresses.addresses.and.returnValue(throwError(() => ({ status: 500 })));
    const { fixture, form } = addressPicker();
    expect(form.invalid).toBeTrue();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    addresses.addresses.and.returnValue(of({ data: [office] }));
    fixture.nativeElement.querySelector('[role="alert"] button').click(); fixture.detectChanges();
    expect(form.valid).toBeTrue(); expect(form.controls.supplier_id.value).toBe(12);
    expect(form.controls.supplier_address_id.value).toBe(7);
    fixture.destroy();
  });
});

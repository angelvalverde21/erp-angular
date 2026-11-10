import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { InventoryVariantLocation, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { BaseService } from '../../../../base.service';
import { InventoryCountCreateComponent } from '../inventory-count-create/inventory-count-create.component';
import { InventoryCountEntryComponent } from './inventory-count-entry.component';
import { InventoryCountEditComponent } from '../inventory-count-edit/inventory-count-edit.component';
import Swal from 'sweetalert2';

const options: InventoryWorkspaceOptions = {
  branches: [{ id: 1, name: 'Central' }],
  warehouses: [{ id: 5, name: 'Tienda', branch_id: 1 }],
  locations: [
    { id: 4, warehouse_id: 5, parent_id: null, name: 'Zona A', code: 'A', is_active: true, warehouse: { id: 5, name: 'Tienda', branch_id: 1, branch: { id: 1, name: 'Central' } } },
    { id: 9, warehouse_id: 5, parent_id: null, name: 'Estante 1 / Fila 2', code: 'previous', is_active: true },
    { id: 12, warehouse_id: 5, parent_id: null, name: 'Estante 2 / Superior', code: 'previous_two', is_active: true },
  ],
};

describe('Inline inventory count entry', () => {
  let fixture: ComponentFixture<InventoryCountEntryComponent>;
  let entry: InventoryCountEntryComponent;
  let editor: InventoryCountCreateComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryCountEntryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), { provide: BaseService, useValue: { store: 'sorelle' } }],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(InventoryCountEntryComponent);
    entry = fixture.componentInstance;
    fixture.componentRef.setInput('inventoryId', 2);
    fixture.componentRef.setInput('sessionId', 3);
    fixture.componentRef.setInput('locationId', 4);
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
    editor = fixture.debugElement.query(By.directive(InventoryCountCreateComponent)).componentInstance;
  });

  afterEach(() => { http.verify(); fixture.destroy(); });

  function scan(existing: object[] = [], otherLocations: InventoryVariantLocation[] = []): void {
    const input = fixture.nativeElement.querySelector('#inventory-barcode-input') as HTMLInputElement;
    input.value = '7';
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('.barcode-search-panel').dispatchEvent(new Event('submit', { cancelable: true }));
    http.expectOne(req => req.url.endsWith('/variants/7')).flush({ data: { id: 7, sku: 'SKU', stock: 0, product: { id: 1, name: 'Prenda' } } });
    const lookup = http.expectOne(req => req.url.endsWith('/sessions/3/counts'));
    expect(lookup.request.params.get('location_id')).toBe('4');
    lookup.flush({ data: existing, variant_counted_quantity: 19, other_locations: otherLocations });
    fixture.detectChanges();
  }

  const previousLocation: InventoryVariantLocation = {
    location_id: 9, location_path: 'Estante 1 / Fila 2', warehouse_id: 5,
    warehouse_name: 'Tienda', branch_name: 'Central', quantity: 12,
  };

  it('warns before entering a quantity and lets the user keep the units in the current location', async () => {
    const warning = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDenied: false, isDismissed: false });
    scan([], [previousLocation]);
    expect(entry.searching).toBeTrue();
    expect(editor.selectedVariant).toBeNull();
    await fixture.whenStable();
    fixture.detectChanges();
    const config = warning.calls.mostRecent().args[0] as any;
    expect(config.title).toContain('otra ubicación');
    expect(config.html.textContent).toContain('Estante 1 / Fila 2');
    expect(config.html.textContent).toContain('12 unidades contadas');
    expect(editor.selectedVariant?.id).toBe(7);
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#count-quantity'));
    editor.form.controls.quantity.setValue(2);
    await editor.submit();
    const request = http.expectOne(req => req.method === 'POST');
    expect(request.request.body.location_id).toBe(4);
    request.flush({ data: { id: 10, variant_id: 7, location_id: 4, quantity: 2 } });
  });

  it('requests capture at the previous location without registering or changing any count', async () => {
    const move = spyOn(entry.moveRequested, 'emit');
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDenied: true, isDismissed: false });
    scan([], [previousLocation]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(entry.variants).toEqual([]);
    expect(editor.selectedVariant).toBeNull();
    expect(editor.form.controls.quantity.value).toBeNull();
    expect(move).toHaveBeenCalledWith(jasmine.objectContaining({ source_location_id: 4, location_id: 9, counted_quantity: 19 }));
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#inventory-barcode-input'));
    http.expectNone(req => req.method !== 'GET');
  });

  it('lets the user select the destination when the variant appears in several locations', async () => {
    const move = spyOn(entry.moveRequested, 'emit');
    spyOn(Swal, 'fire').and.returnValues(
      Promise.resolve({ isConfirmed: false, isDenied: true, isDismissed: false }),
      Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false, value: '12' }),
    );
    scan([], [previousLocation, { ...previousLocation, location_id: 12, location_path: 'Estante 2 / Superior' }]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(move).toHaveBeenCalledWith(jasmine.objectContaining({ location_id: 12 }));
    expect(editor.selectedVariant).toBeNull();
    http.expectNone(req => req.method !== 'GET');
  });

  it('preselects the moved variant and leaves quantity empty at the destination', () => {
    fixture.componentRef.setInput('locationId', 9);
    fixture.componentRef.setInput('movedProduct', {
      source_location_id: 4, location_id: 9,
      variant: { id: 7, sku: 'SKU', stock: 0 }, counted_quantity: 19,
    });
    fixture.detectChanges();
    expect(editor.selectedVariant?.id).toBe(7);
    expect(editor.form.getRawValue().location_id).toBe(9);
    expect(editor.form.controls.quantity.value).toBeNull();
    expect(entry.countedQuantity).toBe(19);
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#count-quantity'));
    http.expectNone(() => true);
  });

  it('does not offer automatic capture outside the session warehouse', async () => {
    const move = spyOn(entry.moveRequested, 'emit');
    const warning = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDenied: true, isDismissed: false });
    scan([], [{ ...previousLocation, location_id: 99, warehouse_id: 99 }]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(warning).toHaveBeenCalledWith(jasmine.objectContaining({ showDenyButton: false }));
    expect(move).not.toHaveBeenCalled();
    http.expectNone(req => req.method !== 'GET');
  });

  it('cancels the decision and does not treat an old decision as a new scan', async () => {
    let answer!: (value: any) => void;
    spyOn(Swal, 'fire').and.returnValue(new Promise(resolve => answer = resolve));
    scan([], [previousLocation]);
    entry.searchVariant('8');
    http.expectOne(req => req.url.endsWith('/variants/8')).flush({ data: { id: 8, sku: 'OTHER', stock: 0 } });
    http.expectOne(req => req.url.endsWith('/sessions/3/counts')).flush({ data: [], other_locations: [], variant_counted_quantity: 0 });
    answer({ isConfirmed: true, isDenied: false, isDismissed: false });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(entry.variants[0].id).toBe(8);
    expect(editor.selectedVariant?.id).toBe(8);
    expect(entry.placementNotice).toBe('');
    http.expectNone(req => req.method !== 'GET');
  });

  it('uses the location selected on the list without asking for it again', () => {
    expect(editor.form.getRawValue().location_id).toBe(4);
    expect(editor.form.controls.location_id.disabled).toBeTrue();
    expect(editor.locationConfirmed).toBeTrue();
    expect(fixture.nativeElement.querySelector('.count-zone-picker')).toBeNull();
    expect(fixture.nativeElement.querySelector('.count-zone-context')).toBeNull();
    expect(editor.locationPath).toContain('Zona A');
    expect(fixture.nativeElement.querySelector('.barcode-history')).toBeNull();
  });

  it('renders the product image from the variant response and displays option values in uppercase', () => {
    const image = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const input = fixture.nativeElement.querySelector('#inventory-barcode-input') as HTMLInputElement;
    input.value = '7';
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('.barcode-search-panel').dispatchEvent(new Event('submit', { cancelable: true }));
    http.expectOne(req => req.url.endsWith('/variants/7')).flush({ data: {
      id: 7, product: { id: 1, name: 'Prenda', image: { url_thumbnail: image } },
      variant_option_values: [{ id: 1, option: { label: 'Tallas' }, option_value: { value: 'Standar' } }],
    } });
    http.expectOne(req => req.url.endsWith('/sessions/3/counts')).flush({ data: [], variant_counted_quantity: 0 });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.barcode-product-image img').getAttribute('src')).toBe(image);
    expect(fixture.nativeElement.querySelector('.barcode-variant-options strong').textContent).toBe('STANDAR');
    expect(fixture.nativeElement.querySelector('.barcode-stock-variant strong').textContent).toBe('STANDAR');
    expect(entry.variants[0].variant_option_values?.[0].option_value?.value).toBe('Standar');
  });

  it('records in the fixed location and resets for another product ready for another scan', () => {
    const saved = spyOn(entry.saved, 'emit');
    const busy = spyOn(entry.busyChange, 'emit');
    scan();
    editor.form.controls.quantity.setValue(3);
    editor.submit();
    fixture.detectChanges();
    expect(busy).toHaveBeenCalledWith(true);
    const request = http.expectOne(req => req.method === 'POST' && req.url.endsWith('/sessions/3/counts'));
    expect(request.request.body.location_id).toBe(4);
    expect(request.request.body.quantity).toBe(3);
    const record = { id: 9, inventory_session_id: 3, location_id: 4, variant_id: 7, user_id: 1, quantity: 3, count_round: 1, status: 'valid' as const, counted_at: '2026-11-04T10:00:00Z' };
    request.flush({ data: record });
    fixture.detectChanges();
    expect(saved).toHaveBeenCalledWith(record);
    expect(editor.form.controls.quantity.value).toBeNull();
    expect(editor.selectedVariant).toBeNull();
    expect(editor.form.getRawValue().location_id).toBe(4);
    expect((fixture.nativeElement.querySelector('#inventory-barcode-input') as HTMLInputElement).value).toBe('');
    expect(entry.success).toContain('3 unidades');
    expect(busy).toHaveBeenCalledWith(false);
  });

  it('focuses the quantity after scanning and does not steal focus again on later updates', () => {
    scan();
    const quantity: HTMLInputElement = fixture.nativeElement.querySelector('#count-quantity');
    const barcode: HTMLInputElement = fixture.nativeElement.querySelector('#inventory-barcode-input');
    expect(document.activeElement).toBe(quantity);
    expect(quantity.value).toBe('');
    barcode.focus();
    fixture.detectChanges();
    expect(document.activeElement).toBe(barcode);
  });

  it('shows the inventory total and lets another capture add to it', () => {
    scan([{ id: 9, variant_id: 7, location_id: 4, quantity: 19, status: 'valid' }]);
    expect(fixture.nativeElement.querySelector('.count-duplicate')).toBeNull();
    expect(editor.currentQuantity).toBe(19);
    expect(fixture.nativeElement.querySelector('.barcode-stock-number').textContent).toContain('19');
    editor.form.controls.quantity.setValue(5);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.barcode-stock-number').textContent).toContain('24');
    editor.submit();
    const request = http.expectOne(req => req.method === 'POST');
    expect(request.request.body.quantity).toBe(5);
    request.flush({ data: { id: 10, variant_id: 7, quantity: 5 } });
  });

  it('rejects a payload targeting a different location', () => {
    entry.save({ location_id: 99, variant_id: 7, quantity: 3, mode: 'accumulate' });
    http.expectNone(req => req.method === 'POST');
  });

  it('refreshes the inventory total after a correction without losing the quantity being entered', () => {
    scan();
    editor.form.controls.quantity.setValue(5);
    entry.refreshCountedQuantity(7);
    http.expectOne(req => req.url.endsWith('/sessions/3/counts')).flush({ data: [], variant_counted_quantity: 14 });
    fixture.detectChanges();
    expect(entry.countedQuantity).toBe(14);
    expect(editor.form.controls.quantity.value).toBe(5);
    expect(editor.selectedVariant?.id).toBe(7);
  });

  it('accepts exactly fifty units without asking for confirmation even if the accumulated total is higher', async () => {
    const alert = spyOn(Swal, 'fire');
    scan();
    editor.form.controls.quantity.setValue(50);
    await editor.submit();
    expect(alert).not.toHaveBeenCalled();
    const request = http.expectOne(req => req.method === 'POST');
    expect(request.request.body.quantity).toBe(50);
    request.flush({ data: { id: 10, variant_id: 7, quantity: 50 } });
  });

  it('warns about a possible barcode and returns to quantity without saving when dismissed', async () => {
    const alert = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDenied: false, isDismissed: true });
    scan();
    editor.form.controls.quantity.setValue(1254);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.count-quantity-warning')).toBeNull();
    expect(alert).not.toHaveBeenCalled();
    await editor.submit();
    expect(alert).toHaveBeenCalledWith(jasmine.objectContaining({ text: jasmine.stringMatching('código de barras') }));
    fixture.detectChanges();
    http.expectNone(req => req.method === 'POST');
    expect(editor.form.controls.quantity.value).toBe(1254);
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#count-quantity'));
  });

  it('registers a quantity above fifty only after confirmation and prevents duplicate prompts', async () => {
    const alert = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true, isDenied: false, isDismissed: false });
    scan();
    editor.form.controls.quantity.setValue(51);
    const firstSubmit = editor.submit();
    const duplicateSubmit = editor.submit();
    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert).toHaveBeenCalledWith(jasmine.objectContaining({ focusCancel: true, icon: 'warning' }));
    await firstSubmit;
    await duplicateSubmit;
    const request = http.expectOne(req => req.method === 'POST');
    expect(request.request.body.quantity).toBe(51);
    request.flush({ data: { id: 10, variant_id: 7, quantity: 51 } });
  });

  it('also confirms large edited quantities while allowing a capture to be cancelled without the warning', async () => {
    const alert = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDenied: false, isDismissed: true });
    const editFixture = TestBed.createComponent(InventoryCountEditComponent);
    editFixture.componentRef.setInput('record', {
      id: 1, inventory_session_id: 3, location_id: 4, variant_id: 7, user_id: 1,
      quantity: 51, count_round: 1, status: 'valid', counted_at: '2026-11-09T10:00:00Z',
    });
    editFixture.detectChanges();
    const edit = editFixture.componentInstance;
    const save = spyOn(edit.save, 'emit');
    await edit.submit();
    expect(alert).toHaveBeenCalledTimes(1);
    expect(save).not.toHaveBeenCalled();
    alert.calls.reset();
    edit.form.controls.status.setValue('cancelled');
    await edit.submit();
    expect(alert).not.toHaveBeenCalled();
    expect(save).toHaveBeenCalledWith(jasmine.objectContaining({ quantity: 51, status: 'cancelled' }));
    editFixture.destroy();
  });

  it('shows the scanner immediately but requires a location before accepting a variant', () => {
    fixture.componentRef.setInput('locationId', null);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#inventory-barcode-input') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.disabled).toBeTrue();
    expect(editor.locationConfirmed).toBeFalse();
    expect(fixture.nativeElement.querySelector('.count-zone-picker')).toBeNull();
    entry.searchVariant('7');
    http.expectNone(req => req.url.endsWith('/variants/7'));
    fixture.componentRef.setInput('locationId', 4);
    fixture.detectChanges();
    expect(input.disabled).toBeFalse();
    expect(editor.form.getRawValue().location_id).toBe(4);
  });
});


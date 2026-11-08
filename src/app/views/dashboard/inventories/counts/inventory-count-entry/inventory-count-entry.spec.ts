import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { BaseService } from '../../../../base.service';
import { InventoryCountCreateComponent } from '../inventory-count-create/inventory-count-create.component';
import { InventoryCountEntryComponent } from './inventory-count-entry.component';

const options: InventoryWorkspaceOptions = {
  branches: [{ id: 1, name: 'Central' }],
  warehouses: [{ id: 5, name: 'Tienda', branch_id: 1 }],
  locations: [{ id: 4, warehouse_id: 5, parent_id: null, name: 'Zona A', code: 'A', is_active: true, warehouse: { id: 5, name: 'Tienda', branch_id: 1, branch: { id: 1, name: 'Central' } } }],
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

  function scan(existing: object[] = []): void {
    const input = fixture.nativeElement.querySelector('#inventory-barcode-input') as HTMLInputElement;
    input.value = '7';
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('.barcode-search-panel').dispatchEvent(new Event('submit', { cancelable: true }));
    http.expectOne(req => req.url.endsWith('/variants/7')).flush({ data: { id: 7, sku: 'SKU', stock: 0, product: { id: 1, name: 'Prenda' } } });
    const lookup = http.expectOne(req => req.url.endsWith('/sessions/3/counts'));
    expect(lookup.request.params.get('location_id')).toBe('4');
    lookup.flush({ data: existing, variant_counted_quantity: 19 });
    fixture.detectChanges();
  }

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


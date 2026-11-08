import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateRef } from '@angular/core';
import { BaseService } from 'src/app/views/base.service';
import { provideRouter } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { VariantService } from '../../../products/variants/variant.service';
import { ProductService } from '../../../products/product.service';
import { KardexService } from '../../../kardex/kardex.service';
import { InventoryBarcodeSearchComponent } from './inventory-barcode-search.component';

registerLocaleData(localeEsPe);

describe('InventoryBarcodeSearchComponent', () => {
  let component: InventoryBarcodeSearchComponent;
  let fixture: ComponentFixture<InventoryBarcodeSearchComponent>;
  let response: Subject<unknown>;
  let getVariant: jasmine.Spy;
  let updateVariant: jasmine.Spy;
  let updateResponse: Subject<unknown>;
  let close: jasmine.Spy;
  let getProduct: jasmine.Spy;
  let productResponse: Subject<unknown>;

  const variant = {
    id: 1276, product_id: 294, sku: '659STA', price: '0.00', stock: 0,
    updated_at: '2026-10-29T02:42:52.000000Z',
    product: { id: 294, name: 'Cafarena Stella Beige' },
    variant_option_values: [{ id: 1276, option: { name: 'size', label: 'Tallas' }, option_value: { value: 'Standar' } }],
  };

  beforeEach(async () => {
    productResponse = new Subject();
    getProduct = jasmine.createSpy('getProduct').and.returnValue(productResponse);
    response = new Subject();
    getVariant = jasmine.createSpy('get').and.returnValue(response);
    updateResponse = new Subject();
    updateVariant = jasmine.createSpy('update').and.returnValue(updateResponse);
    close = jasmine.createSpy('close');
    await TestBed.configureTestingModule({
      imports: [InventoryBarcodeSearchComponent],
      providers: [
        provideRouter([]),
        { provide: VariantService, useValue: { get: getVariant, update: updateVariant } },
        { provide: ProductService, useValue: { get: getProduct } },
        { provide: KardexService, useValue: { summary: KardexService.prototype.summary } },
        { provide: BaseService, useValue: { store: 'test-store' } },
        { provide: NgbModalConfig, useValue: {} },
        { provide: NgbModal, useValue: { open: () => ({ close, dismiss: jasmine.createSpy('dismiss') }) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(InventoryBarcodeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with an instruction state and rejects blank searches', () => {
    expect(component.hasSearched).toBeFalse();
    expect(component.canSearch).toBeFalse();
    component.form.get('barcode')!.setValue('   ');
    component.search();
    expect(getVariant).not.toHaveBeenCalled();
  });

  it('renders the returned kardex history with the searched variant context', () => {
    component.form.get('barcode')!.setValue('1276');
    component.search();
    response.next({ data: { ...variant, kardexes: [
      { id: 42, variant_id: 1276, direction: 'in', quantity: 5, comment: 'Compra' },
    ] } });
    response.complete();
    fixture.detectChanges();
    const history: HTMLElement = fixture.nativeElement.querySelector('app-kardex-index');
    expect(history.textContent).toContain('Compra');
    expect(history.textContent).toContain('Cafarena Stella Beige');
    expect(history.textContent).toContain('Standar');
    expect(history.querySelector('.kardex-quantity-badge')?.textContent?.trim()).toBe('+5');
  });

  it('trims the code, preserves leading zeroes and blocks overlapping requests', () => {
    component.form.get('barcode')!.setValue(' 00127 ');
    component.search();
    component.search();
    expect(getVariant).toHaveBeenCalledOnceWith('00127');
    expect(component.loading).toBeTrue();
    response.next(variant);
    response.complete();
    expect(component.searchedBarcode).toBe('00127');
    expect(component.variants).toEqual([variant]);
    expect(component.loading).toBeFalse();
  });

  it('renders the returned product, options, zero price and zero stock', () => {
    component.form.get('barcode')!.setValue('1276');
    component.search();
    response.next(variant);
    response.complete();
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Cafarena Stella Beige');
    expect(element.textContent).toContain('659STA');
    expect(element.textContent).toContain('Tallas:');
    expect(element.textContent).toContain('STANDAR');
    expect(element.textContent).toContain('Sin existencias');
    expect(element.textContent).toMatch(/0[.,]00/);
    expect(element.querySelector<HTMLButtonElement>('.barcode-print-button')!.disabled).toBeFalse();
  });

  it('also accepts a variant wrapped in data', () => {
    component.form.get('barcode')!.setValue('1276');
    component.search();
    response.next({ data: variant });
    response.complete();
    expect(component.variant).toEqual(variant);
    expect(component.variants).toEqual([variant]);
  });

  it('distinguishes an empty result from the initial screen', () => {
    component.form.get('barcode')!.setValue('unknown');
    component.search();
    response.next({ data: null });
    response.complete();
    fixture.detectChanges();
    expect(component.hasSearched).toBeTrue();
    expect(component.variant).toBeNull();
    expect(component.variants).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('No encontramos el producto');
  });

  it('shows not found for HTTP 404 without a network error', () => {
    component.form.get('barcode')!.setValue('unknown');
    component.search();
    response.error({ status: 404 });
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
    expect(component.variant).toBeNull();
  });

  it('restores search controls after an error and allows retrying', () => {
    component.form.get('barcode')!.setValue('127');
    component.search();
    response.error(new Error('Network error'));
    expect(component.loading).toBeFalse();
    expect(component.error).toBeTruthy();
    getVariant.and.returnValue(new Subject());
    component.search();
    expect(getVariant).toHaveBeenCalledTimes(2);
    expect(component.error).toBe('');
  });

  it('closes the print dialog after a successful print event', () => {
    component.openVerticallyCentered({} as TemplateRef<unknown>);
    component.receivePrintStatus(true);
    expect(close).toHaveBeenCalledTimes(1);
  });

  function loadVariant(): void {
    component.form.get('barcode')!.setValue('1276');
    component.search();
    response.next(variant);
    response.complete();
    fixture.detectChanges();
  }

  const thumbnail = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  it('uses the returned product image without another API request', () => {
    component.form.get('barcode')!.setValue('1276');
    component.search();
    response.next({ ...variant, product: { ...variant.product, image: { url_thumbnail: thumbnail } } });
    response.complete();
    fixture.detectChanges();
    const image: HTMLImageElement = fixture.nativeElement.querySelector('.barcode-product-image img');
    expect(image.getAttribute('src')).toBe(thumbnail);
    expect(image.alt).toBe(variant.product.name);
    expect(getProduct).not.toHaveBeenCalled();
  });

  it('loads the product image when the variant response omits it', () => {
    loadVariant();
    expect(getProduct).toHaveBeenCalledOnceWith(294);
    component.variant = { ...component.variant!, stock: 7 };
    productResponse.next({ data: { ...variant.product, image: { url_medium: thumbnail } } });
    productResponse.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.barcode-product-image img').getAttribute('src')).toBe(thumbnail);
    expect(component.variant?.stock).toBe(7);
    expect(component.variants[0].product?.image?.url_medium).toBe(thumbnail);
  });

  it('keeps stock usable when the optional image lookup fails', () => {
    loadVariant();
    productResponse.error({ status: 500 });
    component.changeControl.setValue(3);
    fixture.detectChanges();
    expect(component.error).toBe('');
    expect(component.canUpdateStock).toBeTrue();
    expect(fixture.nativeElement.querySelector('.barcode-product-image [aria-label="Producto sin imagen disponible"]')).not.toBeNull();
  });

  it('preserves the loaded image if the stock update omits the image relation', () => {
    loadVariant();
    productResponse.next({ data: { ...variant.product, image: { url_thumbnail: thumbnail } } });
    productResponse.complete();
    component.changeControl.setValue(3);
    component.updateStock();
    updateResponse.next({ data: { ...variant, stock: 3 } });
    updateResponse.complete();
    expect(component.productImageUrl).toBe(thumbnail);
    expect(component.variant?.stock).toBe(3);
  });

  it('ignores an old image request after another barcode is searched', () => {
    loadVariant();
    const nextVariant = new Subject();
    const nextProduct = new Subject();
    getVariant.and.returnValue(nextVariant);
    getProduct.and.returnValue(nextProduct);
    component.form.get('barcode')!.setValue('1277');
    component.search();
    nextVariant.next({ ...variant, id: 1277, product_id: 295, product: { id: 295, name: 'Otro producto' } });
    nextVariant.complete();
    productResponse.next({ data: { image: { url_thumbnail: thumbnail } } });
    expect(component.productImageUrl).toBeNull();
    nextProduct.next({ data: { image: { url_thumbnail: thumbnail } } });
    nextProduct.complete();
    expect(component.productImageUrl).toBe(thumbnail);
    expect(component.variant?.product?.id).toBe(295);
  });

  it('fills the stock input and prevents invalid or unchanged updates', () => {
    loadVariant();
    expect(component.stockControl.value).toBe(0);
    expect(component.canUpdateStock).toBeFalse();
    component.updateStock();
    for (const value of [-1, 1.5, null]) {
      component.stockControl.setValue(value);
      component.updateStock();
    }
    expect(updateVariant).not.toHaveBeenCalled();
  });

  it('rejects negative typing and pasted values when initial stock is zero', () => {
    loadVariant();
    for (const id of ['barcode-stock-change', 'barcode-new-stock']) {
      const input: HTMLInputElement = fixture.nativeElement.querySelector('#' + id);
      const key = new KeyboardEvent('keydown', { key: '-', bubbles: true, cancelable: true });
      input.dispatchEvent(key);
      expect(key.defaultPrevented).toBeTrue();
      input.value = '-5';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(input.value).toBe('0');
      expect(component.changeControl.value).toBe(0);
      expect(component.stockControl.value).toBe(0);
      component.updateStock();
    }
    expect(updateVariant).not.toHaveBeenCalled();
  });

  it('synchronizes additional units and the editable total in both directions', () => {
    loadVariant();
    component.variant = { ...variant, stock: 5 };
    component.changeControl.setValue(3);
    expect(component.stockControl.value).toBe(8);
    component.stockControl.setValue(2);
    expect(component.changeControl.value).toBe(-3);
    expect(component.canUpdateStock).toBeTrue();
  });

  it('updates stock from the input and refreshes the result and printable variant', () => {
    loadVariant();
    const input = fixture.nativeElement.querySelector('#barcode-new-stock') as HTMLInputElement;
    input.value = '7';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    input.closest('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    component.updateStock();
    expect(updateVariant).toHaveBeenCalledOnceWith(1276, { variant_id: 1276, direction: 'in', quantity: 7, comment: 'Conteo parcial' });
    expect(component.canSearch).toBeFalse();
    expect(component.stockControl.disabled).toBeTrue();
    updateResponse.next({ data: { stock: 7 } });
    updateResponse.complete();
    fixture.detectChanges();
    expect(component.variant?.stock).toBe(7);
    expect(component.variants[0].stock).toBe(7);
    expect(component.stockControl.enabled).toBeTrue();
    expect(component.canUpdateStock).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('Inventario actualizado correctamente.');
    expect(fixture.nativeElement.textContent).toContain('Buscar otro producto');
    expect(input.closest('form')!.querySelector('button[type="submit"]')).toBeNull();
  });

  for (const wrapped of [true, false]) {
    it(`refreshes the kardex table using the ${wrapped ? 'wrapped' : 'raw'} update response`, () => {
      loadVariant();
      component.stockControl.setValue(7);
      component.updateStock();

      const updatedVariant = {
        ...variant,
        stock: 9,
        updated_at: '2026-10-29T16:00:00.000000Z',
        kardexes: [{ id: 99, variant_id: variant.id, direction: 'in', quantity: 7, comment: 'Ingreso actualizado' }],
      };
      updateResponse.next(wrapped ? { data: updatedVariant } : updatedVariant);
      updateResponse.complete();
      fixture.detectChanges();

      expect(component.variant?.stock).toBe(9);
      expect(component.stockControl.value).toBe(9);
      expect(component.variant?.updated_at).toBe(updatedVariant.updated_at);
      const history: HTMLElement = fixture.nativeElement.querySelector('app-kardex-index');
      expect(history.textContent).toContain('Ingreso actualizado');
      expect(history.querySelector('.kardex-quantity-badge')?.textContent?.trim()).toBe('+7');
      expect(fixture.nativeElement.querySelector('.barcode-history-header').textContent).toContain('1 registros');
    });
  }

  it('preserves an uncertain movement and requires checking current stock before retrying', () => {
    loadVariant();
    component.stockControl.setValue(9);
    component.updateStock();
    updateResponse.error(new Error('Network error'));
    expect(component.variant?.stock).toBe(0);
    expect(component.stockControl.value).toBe(9);
    expect(component.stockError).toBeTruthy();
    expect(component.updatingStock).toBeFalse();
    expect(component.canUpdateStock).toBeFalse();
    expect(component.stockNeedsReview).toBeTrue();
    component.updateStock();
    expect(updateVariant).toHaveBeenCalledTimes(1);
  });
  it('records a partial count only as the selected variant difference', () => {
    loadVariant();
    component.variant = { ...variant, stock: 5 };
    component.stockControl.setValue(2);
    component.updateStock();
    expect(updateVariant).toHaveBeenCalledOnceWith(1276, { variant_id: 1276, direction: 'out', quantity: 3, comment: 'Conteo parcial' });
  });

  it('records an optional reason without requiring an operation selector', () => {
    loadVariant();
    component.changeControl.setValue(2);
    component.reasonControl.setValue(' Devolucion ');
    component.updateStock();
    expect(updateVariant).toHaveBeenCalledOnceWith(1276, { variant_id: 1276, direction: 'in', quantity: 2, comment: 'Devolucion' });
  });

  it('prevents withdrawals below zero and accepts withdrawing all stock', () => {
    loadVariant();
    component.variant = { ...variant, stock: 2 };
    component.reasonControl.setValue('Merma');
    component.changeControl.setValue(-3);
    expect(component.stockControl.value).toBe(-1);
    component.updateStock();
    expect(updateVariant).not.toHaveBeenCalled();
    component.changeControl.setValue(-2);
    component.updateStock();
    expect(updateVariant).toHaveBeenCalledOnceWith(1276, { variant_id: 1276, direction: 'out', quantity: 2, comment: 'Merma' });
    updateResponse.next(null);
    updateResponse.complete();
    expect(component.variant?.stock).toBe(0);
    expect(component.changeControl.value).toBe(0);
    expect(component.stockControl.value).toBe(0);
  });

  it('shows both inputs immediately after finding a product without a dropdown', () => {
    expect(fixture.nativeElement.querySelector('#barcode-new-stock')).toBeNull();
    loadVariant();
    expect(fixture.nativeElement.querySelector('#inventory-operation')).toBeNull();
    expect(fixture.nativeElement.querySelector('#barcode-new-stock')).not.toBeNull();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#barcode-stock-change');
    input.value = '7';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.stockControl.value).toBe(7);
    expect(fixture.nativeElement.querySelector('#barcode-new-stock').value).toBe('7');
  });

  it('clears the prior adjustment when searching another barcode', () => {
    loadVariant();
    component.changeControl.setValue(7);
    const nextResponse = new Subject();
    getVariant.and.returnValue(nextResponse);
    component.form.get('barcode')!.setValue('1277');
    component.search();
    nextResponse.next({ ...variant, id: 1277, stock: 4 });
    nextResponse.complete();
    expect(component.changeControl.value).toBe(0);
    expect(component.stockControl.value).toBe(4);
    expect(component.canUpdateStock).toBeFalse();
  });

  it('explains the stock change before saving and keeps the preview while submitting', () => {
    loadVariant();
    expect(fixture.nativeElement.querySelector('#barcode-stock-title').textContent).toBe('Stock actual');
    component.stockControl.setValue(2);
    component.stockControl.markAsDirty();
    fixture.detectChanges();
    expect(component.operationSummary).toBe('Se agregarán 2 unidades de este producto.');
    const header: HTMLElement = fixture.nativeElement.querySelector('.barcode-stock-header');
    expect(header.querySelector('#barcode-stock-title')?.textContent).toBe('Stock al guardar');
    expect(header.textContent).toContain(component.operationSummary);
    expect(fixture.nativeElement.textContent).toContain('Stock total');
    component.updateStock();
    expect(component.resultingStock).toBe(2);
    updateResponse.next(null);
    updateResponse.complete();
    expect(component.operationComplete).toBeTrue();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#barcode-stock-title').textContent).toBe('Stock actual');
    component.stockControl.setValue(3);
    component.stockControl.markAsDirty();
    expect(component.operationComplete).toBeFalse();
    expect(component.operationSummary).toBe('Se agregará 1 unidad de este producto.');
  });


});

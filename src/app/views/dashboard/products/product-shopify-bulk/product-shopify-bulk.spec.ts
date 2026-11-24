import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, Subject, throwError } from 'rxjs';
import { Product } from 'src/app/interfaces/product.interface';
import { BaseService } from 'src/app/views/base.service';
import { ProductIndexComponent } from '../product-index/product-index.component';
import { ProductService } from '../product.service';
import { CatalogPreview, CatalogPublishResult, ShopifyCatalogService } from '../shopify-catalog.service';
import { ProductShopifyBulkComponent } from './product-shopify-bulk.component';
import { ProductBulkTitlesComponent } from '../product-bulk-titles/product-bulk-titles.component';

const products = [1, 2, 3].map(id => ({ id, name: 'Producto ' + id } as Product));
const preview: CatalogPreview = {
  connection: { ready: true, domain: 'catalog-test.myshopify.com', issues: [] }, mode: 'catalog', target_status: 'DRAFT',
  items: products.map(product => ({ id: product.id, name: product.name!, status: product.id === 3 ? 'linked' : 'ready',
    token: product.id === 3 ? null : 'token-' + product.id, issues: product.id === 3 ? ['Ya vinculado'] : [],
    variants: [{ id: product.id * 10, sku: 'ERP-' + product.id, optionValues: [{ optionName: 'Talla', name: 'M' }] }] })),
};

describe('Bulk product selection', () => {
  let fixture: ComponentFixture<ProductIndexComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: ProductService, useValue: { duplicate: jasmine.createSpy(), updateTitles: jasmine.createSpy().and.returnValue(of({ data: [{ id: 1, name: 'Nuevo título' }] })) } },
      { provide: ShopifyCatalogService, useValue: { preview: jasmine.createSpy(), publish: jasmine.createSpy() } }] });
    fixture = TestBed.createComponent(ProductIndexComponent);
    fixture.componentRef.setInput('bulkActions', true); fixture.componentRef.setInput('products', products); fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());
  it('shows actions after selection and saves edited titles back into the catalog', async () => {
    fixture.componentRef.setInput('products', products.map(product => ({ ...product })));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#catalog-actions')).toBeNull();
    fixture.componentInstance.toggleProduct(1); fixture.detectChanges();
    const actions = fixture.nativeElement.querySelector('#catalog-actions') as HTMLButtonElement;
    actions.click(); fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.catalog-actions-menu button') as NodeListOf<HTMLButtonElement>;
    expect(items.length).toBe(3);
    expect(items[1].textContent).toContain('Publicar en Shopify');
    expect(items[2].textContent).toContain('Restablecer en Shopify');
    items[0].click(); fixture.detectChanges();
    const editor = fixture.debugElement.query(By.directive(ProductBulkTitlesComponent)).componentInstance as ProductBulkTitlesComponent;
    expect(fixture.componentInstance.bulkBusy).toBeTrue();
    editor.rows[0].name = 'Nuevo título';
    const closed = new Promise<void>(resolve => editor.editor.nativeElement.addEventListener('close', () => resolve(), { once: true }));
    await editor.save();
    await closed;
    await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.componentInstance.products[0].name).toBe('Nuevo título');
    expect(fixture.componentInstance.selectedIds.has(1)).toBeTrue();
    expect(fixture.componentInstance.bulkBusy).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-product-bulk-titles')).toBeNull();
  });
  it('selects a row without opening its editor, supports select-all and clears the selection', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    (fixture.nativeElement.querySelector('tbody .product-select-column input') as HTMLInputElement).click(); fixture.detectChanges();
    expect(fixture.componentInstance.selectedProducts.map(product => product.id)).toEqual([1]);
    expect(fixture.nativeElement.querySelector('app-product-shopify-bulk')).not.toBeNull();
    expect(navigate).not.toHaveBeenCalled();
    const all = fixture.nativeElement.querySelector('thead input') as HTMLInputElement;
    expect(all.indeterminate).toBeTrue(); all.click(); fixture.detectChanges();
    expect(fixture.componentInstance.selectedIds.size).toBe(3);
    all.click(); fixture.detectChanges();
    expect(fixture.componentInstance.selectedIds.size).toBe(0);
    expect(fixture.nativeElement.querySelector('app-product-shopify-bulk')).toBeNull();
  });
  it('limits each batch to 35 and removes stale selections when the list changes', () => {
    fixture.componentRef.setInput('products', Array.from({ length: 36 }, (_, i) => ({ id: i + 1, name: 'Producto' }))); fixture.detectChanges();
    fixture.componentInstance.toggleProducts(); fixture.detectChanges();
    expect(fixture.componentInstance.selectedIds.size).toBe(35);
    const inputs = fixture.nativeElement.querySelectorAll('tbody .product-select-column input') as NodeListOf<HTMLInputElement>;
    expect(inputs[35].disabled).toBeTrue();
    fixture.componentRef.setInput('products', []); fixture.detectChanges();
    expect(fixture.componentInstance.selectedIds.size).toBe(0);
  });

  it('shows Shopify links and updates them after publishing or resetting', () => {
    fixture.componentRef.setInput('products', products.map(product => ({ ...product, shopify_linked: product.id === 1 })));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.product-shopify-badge').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.product-shopify-badge').textContent).toContain('Exportado a Shopify');
    fixture.componentInstance.toggleProduct(2); fixture.detectChanges();
    const bulk = fixture.debugElement.query(By.directive(ProductShopifyBulkComponent)).componentInstance as ProductShopifyBulkComponent;
    bulk.shopifyLinkChanged.emit({ productId: 2, linked: true }); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.product-shopify-badge').length).toBe(2);
    bulk.shopifyLinkChanged.emit({ productId: 1, linked: false }); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.product-shopify-badge').length).toBe(1);
  });
});

describe('Bulk product title editing', () => {
  let fixture: ComponentFixture<ProductBulkTitlesComponent>;
  let component: ProductBulkTitlesComponent;
  let service: jasmine.SpyObj<ProductService>;
  beforeEach(() => {
    service = jasmine.createSpyObj('ProductService', ['updateTitles']);
    TestBed.configureTestingModule({ providers: [{ provide: ProductService, useValue: service }] });
    fixture = TestBed.createComponent(ProductBulkTitlesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('products', products);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('edits a draft without changing products and can restore every original title', () => {
    expect(component.editor.nativeElement.open).toBeTrue();
    component.find = 'Producto'; component.replacement = 'Pantalón'; component.prefix = 'Nuevo '; component.suffix = ' verano';
    component.apply();
    expect(component.rows[0].name).toBe('Nuevo Pantalón 1 verano');
    expect(products[0].name).toBe('Producto 1');
    expect(service.updateTitles).not.toHaveBeenCalled();
    expect(component.changes.length).toBe(3);
    component.restore();
    expect(component.changes).toEqual([]);
  });

  it('rejects blank and overlong titles and skips unchanged batches', async () => {
    await component.save();
    component.rows[0].name = '   '; await component.save();
    expect(component.invalid).toBeTrue();
    component.rows[0].name = 'x'.repeat(256); await component.save();
    expect(component.invalid).toBeTrue();
    expect(service.updateTitles).not.toHaveBeenCalled();
  });

  it('sends only changed titles with whitespace trimmed and emits confirmed results', async () => {
    const saved = spyOn(component.saved, 'emit');
    component.rows[1].name = '  Nuevo título  ';
    service.updateTitles.and.returnValue(of({ data: [{ id: 2, name: 'Nuevo título' }] }));
    await component.save();
    expect(service.updateTitles).toHaveBeenCalledOnceWith([{ id: 2, name: 'Nuevo título' }]);
    expect(saved).toHaveBeenCalledOnceWith([{ id: 2, name: 'Nuevo título' }]);
    expect(component.editor.nativeElement.open).toBeFalse();
  });

  it('keeps drafts after a failure so they can be retried', async () => {
    component.rows[0].name = 'Nuevo título';
    service.updateTitles.and.returnValue(throwError(() => ({ status: 500 })));
    await component.save();
    expect(component.error).toContain('reintentar');
    expect(component.rows[0].name).toBe('Nuevo título');
    expect(component.editor.nativeElement.open).toBeTrue();
    service.updateTitles.and.returnValue(of({ data: component.changes }));
    await component.save();
    expect(service.updateTitles).toHaveBeenCalledTimes(2);
  });

  it('blocks duplicate saves and closing while the batch is being saved', async () => {
    const pending = new Subject<{ data: { id: number; name: string }[] }>();
    service.updateTitles.and.returnValue(pending);
    component.rows[0].name = 'Nuevo';
    const saving = component.save();
    await component.save(); component.close();
    const cancel = new Event('cancel', { cancelable: true }); component.cancel(cancel);
    expect(cancel.defaultPrevented).toBeTrue();
    expect(component.editor.nativeElement.open).toBeTrue();
    expect(service.updateTitles).toHaveBeenCalledTimes(1);
    pending.next({ data: [{ id: 1, name: 'Nuevo' }] }); pending.complete(); await saving;
    expect(component.saving).toBeFalse();
  });
});

describe('Shopify draft publishing review', () => {
  let fixture: ComponentFixture<ProductShopifyBulkComponent>;
  let component: ProductShopifyBulkComponent;
  let service: jasmine.SpyObj<ShopifyCatalogService>;
  beforeEach(() => {
    service = jasmine.createSpyObj('ShopifyCatalogService', ['preview', 'publish', 'reset']);
    service.preview.and.returnValue(of({ data: preview }));
    TestBed.configureTestingModule({ providers: [{ provide: ShopifyCatalogService, useValue: service }] });
    fixture = TestBed.createComponent(ProductShopifyBulkComponent); component = fixture.componentInstance;
    fixture.componentRef.setInput('products', products); fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());
  it('reviews reset before deleting and retries only products whose deletion failed', async () => {
    const changed = spyOn(component.shopifyLinkChanged, 'emit');
    service.preview.and.returnValue(of({ data: { ...preview, mode: 'reset' } }));
    service.reset.and.callFake(id => id === 1 ? of({ data: { product_id: id, status: 'reset', message: 'Restablecido' } }) : throwError(() => ({ status: 500 })));
    await component.open('reset'); fixture.detectChanges();
    expect(service.preview).toHaveBeenCalledOnceWith([1, 2, 3], 'reset');
    expect(service.reset).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('dialog').textContent).toContain('definitivamente');
    await component.publish();
    expect(service.publish).not.toHaveBeenCalled();
    expect(service.reset.calls.allArgs()).toEqual([[1, 'token-1'], [2, 'token-2']]);
    expect(component.successCount).toBe(1);
    expect(changed).toHaveBeenCalledWith({ productId: 1, linked: false });
    service.reset.and.returnValue(of({ data: { product_id: 2, status: 'reset', message: 'Restablecido' } }));
    await component.publish();
    expect(service.reset.calls.allArgs()).toEqual([[1, 'token-1'], [2, 'token-2'], [2, 'token-2']]);
    expect(component.pendingItems).toEqual([]);
  });
  it('requires reviewing the selected products before any publication and explains the scope', async () => {
    await component.open(); fixture.detectChanges();
    expect(service.preview).toHaveBeenCalledOnceWith([1, 2, 3]);
    expect(service.publish).not.toHaveBeenCalled();
    expect((fixture.nativeElement.querySelector('dialog') as HTMLDialogElement).open).toBeTrue();
    expect(fixture.nativeElement.querySelector('dialog').textContent).toContain('borradores');
    expect(fixture.nativeElement.querySelector('dialog').textContent).toContain('No se enviarán fotos ni precios');
    expect(fixture.nativeElement.querySelector('dialog').textContent).toContain('4 unidades disponibles');
    expect(fixture.nativeElement.querySelector('option:last-child').disabled).toBeTrue();
    expect(component.readyItems.map(item => item.id)).toEqual([1, 2]);
  });
  it('processes ready products, skips linked products and retries only failures', async () => {
    const changed = spyOn(component.shopifyLinkChanged, 'emit');
    service.publish.and.callFake(id => id === 1 ? of({ data: { product_id: id, status: 'synced', message: 'Creado', remote_status: 'DRAFT' } }) : throwError(() => ({ status: 500 })));
    await component.open(); await component.publish(); fixture.detectChanges();
    expect(service.publish.calls.allArgs()).toEqual([[1, 'token-1'], [2, 'token-2']]);
    expect(component.successCount).toBe(1); expect(component.failedCount).toBe(1);
    expect(changed).toHaveBeenCalledOnceWith({ productId: 1, linked: true });
    service.publish.and.returnValue(of({ data: { product_id: 2, status: 'synced', message: 'Creado', remote_status: 'DRAFT' } }));
    await component.publish(); fixture.detectChanges();
    expect(service.publish.calls.allArgs()).toEqual([[1, 'token-1'], [2, 'token-2'], [2, 'token-2']]);
    expect(component.successCount).toBe(2); expect(component.pendingItems.length).toBe(0);
  });
  it('prevents closing the dialog while an item is being sent', async () => {
    const pending = new Subject<{ data: CatalogPublishResult }>();
    service.publish.and.returnValues(pending, of({ data: { product_id: 2, status: 'synced', message: 'Creado' } }));
    await component.open(); const sending = component.publish(); fixture.detectChanges();
    const cancel = new Event('cancel', { cancelable: true }); component.cancel(cancel); component.close();
    expect(cancel.defaultPrevented).toBeTrue();
    expect((fixture.nativeElement.querySelector('dialog') as HTMLDialogElement).open).toBeTrue();
    pending.next({ data: { product_id: 1, status: 'synced', message: 'Creado' } }); pending.complete();
    await sending; component.close(); fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('dialog') as HTMLDialogElement).open).toBeFalse();
  });
  it('does not send when the connection is incomplete or the review is invalid', async () => {
    service.preview.and.returnValue(of({ data: { ...preview, connection: { ready: false, domain: null, issues: ['Configura la conexión'] } } }));
    await component.open(); await component.publish(); fixture.detectChanges();
    expect(service.publish).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.catalog-error').textContent).toContain('Configura');
  });
});

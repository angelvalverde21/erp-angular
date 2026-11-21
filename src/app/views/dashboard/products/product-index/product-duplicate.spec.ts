import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ProductIndexPageComponent } from '../product-index-page/product-index-page.component';
import { ProductSearchPageComponent } from '../product-search-page/product-search-page.component';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Product } from 'src/app/interfaces/product.interface';
import { BaseService } from 'src/app/views/base.service';
import { ProductService } from '../product.service';
import { ProductIndexComponent } from './product-index.component';

describe('Duplicate product from the catalog', () => {
  let component: ProductIndexComponent;
  let service: jasmine.SpyObj<ProductService>;
  let router: jasmine.SpyObj<Router>;
  const product = { id: 1, name: 'Short verano verde' } as Product;

  beforeEach(() => {
    service = jasmine.createSpyObj('ProductService', ['duplicate']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({ providers: [
      { provide: Router, useValue: router },
      { provide: ActivatedRoute, useValue: {} },
      { provide: BaseService, useValue: { store: 'sorelle' } },
      { provide: ProductService, useValue: service },
    ] });
    component = TestBed.runInInjectionContext(() => new ProductIndexComponent(router, TestBed.inject(ActivatedRoute), TestBed.inject(BaseService), service));
    spyOn(component.productDuplicated, 'emit');
  });

  afterEach(() => { component.ngOnDestroy(); Swal.close(); });

  it('prefills the current name, requires a name and only submits on confirmation', async () => {
    const dialog = component.duplicateProduct(product);
    expect(Swal.getInput()?.value).toBe('Short verano verde');
    expect(service.duplicate).not.toHaveBeenCalled();
    Swal.getInput()!.value = '  ';
    Swal.clickConfirm();
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(Swal.getValidationMessage()?.textContent).toContain('Ingresa el nombre');
    expect(service.duplicate).not.toHaveBeenCalled();
    Swal.getInput()!.value = '  Short verano azul  ';
    service.duplicate.and.returnValue(of({ data: { ...product, id: 22, name: 'Short verano azul' } }));
    Swal.clickConfirm();
    await dialog;
    expect(service.duplicate).toHaveBeenCalledOnceWith(1, 'Short verano azul');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.productDuplicated.emit).toHaveBeenCalledOnceWith(jasmine.objectContaining({ id: 22, name: 'Short verano azul' }));
    expect(component.duplicating).toBeFalse();
  });

  it('cancels without creating a copy', async () => {
    const dialog = component.duplicateProduct(product);
    Swal.clickCancel();
    await dialog;
    expect(service.duplicate).not.toHaveBeenCalled();
    expect(component.productDuplicated.emit).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('keeps the edited name on failure and allows retry without opening another dialog', async () => {
    const dialog = component.duplicateProduct(product);
    service.duplicate.and.returnValue(throwError(() => ({ error: { errors: { images: ['No se pudo copiar la imagen.'] } } })));
    Swal.getInput()!.value = 'Short verano azul';
    Swal.clickConfirm();
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(Swal.getInput()?.value).toBe('Short verano azul');
    expect(Swal.getValidationMessage()?.textContent).toContain('No se pudo copiar la imagen.');
    expect(router.navigate).not.toHaveBeenCalled();
    service.duplicate.and.returnValue(of({ data: { ...product, id: 23 } }));
    Swal.clickConfirm();
    await dialog;
    expect(service.duplicate).toHaveBeenCalledTimes(2);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.productDuplicated.emit).toHaveBeenCalledOnceWith(jasmine.objectContaining({ id: 23 }));
  });
});


describe('Insert duplicated products into the current list', () => {
  const copy = { id: 22, name: 'Copia del producto' } as Product;
  let service: jasmine.SpyObj<ProductService>;
  beforeEach(() => {
    service = jasmine.createSpyObj('ProductService', ['getCatalog', 'search', 'duplicate']);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: ProductService, useValue: service }, { provide: BaseService, useValue: { store: 'sorelle' } }] });
  });
  it('inserts only the new product and updates the total without fetching or resetting the current page', () => {
    const original = { id: 1, name: 'Producto original' } as Product;
    service.getCatalog.and.returnValue(of({ data: [original], meta: { total: 100, last_page: 5 } } as any));
    const fixture = TestBed.createComponent(ProductIndexPageComponent); fixture.detectChanges();
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    fixture.componentInstance.sortBy = 'name'; fixture.componentInstance.sortDirection = 'asc'; fixture.componentInstance.page = 3;
    fixture.debugElement.query(By.directive(ProductIndexComponent)).componentInstance.productDuplicated.emit(copy); fixture.detectChanges();
    expect(service.getCatalog).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.products).toEqual([copy, original]);
    expect(fixture.componentInstance.products[1]).toBe(original);
    expect(fixture.componentInstance.total).toBe(101);
    expect(fixture.componentInstance.page).toBe(3);
    expect(fixture.componentInstance.sortBy).toBe('name');
    fixture.debugElement.query(By.directive(ProductIndexComponent)).componentInstance.productDuplicated.emit(copy);
    expect(fixture.componentInstance.products.length).toBe(2);
    expect(fixture.componentInstance.total).toBe(101);
    expect(navigate).not.toHaveBeenCalled(); fixture.destroy();
  });
  it('highlights the inserted row temporarily and removes the new label afterward', fakeAsync(() => {
    service.getCatalog.and.returnValue(of({ data: [], meta: { total: 0, last_page: 1 } } as any));
    const fixture = TestBed.createComponent(ProductIndexPageComponent); fixture.detectChanges();
    fixture.debugElement.query(By.directive(ProductIndexComponent)).componentInstance.productDuplicated.emit(copy); fixture.detectChanges();
    const row = fixture.nativeElement.querySelector('[data-product-id="22"]') as HTMLElement;
    expect(row.classList.contains('product-row-inserted')).toBeTrue();
    expect(row.querySelector('.product-inserted-badge')?.textContent).toBe('Nuevo');
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Copia del producto');
    tick(3500); fixture.detectChanges();
    expect(row.classList.contains('product-row-inserted')).toBeFalse();
    expect(row.querySelector('.product-inserted-badge')).toBeNull();
    expect(service.getCatalog).toHaveBeenCalledTimes(1); fixture.destroy();
  }));
  it('inserts the copy in search results without reloading or discarding its filters', () => {
    service.search.and.returnValues(of({ data: [] } as any), of({ data: [copy] } as any));
    const fixture = TestBed.createComponent(ProductSearchPageComponent); fixture.detectChanges();
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    fixture.componentInstance.params = { search: 'Copia', sort_by: 'name', sort_direction: 'asc' };
    fixture.debugElement.query(By.directive(ProductIndexComponent)).componentInstance.productDuplicated.emit(copy); fixture.detectChanges();
    expect(service.search).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.params).toEqual({ search: 'Copia', sort_by: 'name', sort_direction: 'asc' });
    expect(fixture.componentInstance.products).toEqual([copy]);
    expect(navigate).not.toHaveBeenCalled(); fixture.destroy();
  });
});

import { TestBed } from '@angular/core/testing';
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
    expect(router.navigate).toHaveBeenCalledWith(['sorelle', 'dashboard', 'products', 22]);
    expect(component.duplicating).toBeFalse();
  });

  it('cancels without creating a copy', async () => {
    const dialog = component.duplicateProduct(product);
    Swal.clickCancel();
    await dialog;
    expect(service.duplicate).not.toHaveBeenCalled();
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
    expect(router.navigate).toHaveBeenCalledWith(['sorelle', 'dashboard', 'products', 23]);
  });
});

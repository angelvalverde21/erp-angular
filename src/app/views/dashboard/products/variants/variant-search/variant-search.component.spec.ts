import { ApplicationRef, DebugElement, getDebugNode } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { firstValueFrom, of, Subject } from 'rxjs';
import { ProductService } from '../../product.service';
import { BaseService } from '../../../../base.service';
import { VariantSearchComponent } from './variant-search.component';
import { ManufactureService } from '../../../manufactures/manufacture.service';
import { ManufactureVariantService } from '../../../manufactures/manufacture.variants.service';
import { ManufactureProductionVariantIndexComponent } from '../../../manufactures/productions/manufacture-production-edit-page/manufacture-production-variant-index/manufacture-production-variant-index.component';

describe('Variant search and missing products', () => {
  let fixture: ComponentFixture<VariantSearchComponent>;
  let component: VariantSearchComponent;
  let result: Subject<any>;
  let search: jasmine.Spy;
  let navigate: jasmine.Spy;

  beforeEach(() => {
    result = new Subject();
    search = jasmine.createSpy('search').and.returnValue(result);
    TestBed.configureTestingModule({
      imports: [VariantSearchComponent],
      providers: [
        provideRouter([]),
        { provide: BaseService, useValue: { store: 'sorelle' } },
        { provide: ProductService, useValue: { search } },
        { provide: ManufactureService, useValue: { setSummary: () => {} } },
        { provide: ManufactureVariantService, useValue: { setManufactureId: () => {}, index: () => of({ data: [] }) } },
      ],
    });
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(VariantSearchComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('allowProductCreation', true);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  function lookup(term = 'Producto nuevo') {
    component.form.controls['search'].setValue(term, { emitEvent: false });
    component.getSearch();
    fixture.detectChanges();
  }

  it('offers creation only after a successful empty search, and closes before navigating', () => {
    expect(fixture.nativeElement.querySelector('.variant-search-create')).toBeNull();
    lookup();
    expect(fixture.nativeElement.querySelector('.variant-search-create')).toBeNull();
    result.next({ data: [] });
    fixture.detectChanges();
    const order: string[] = [];
    component.createProductRequested.subscribe(() => order.push('close'));
    navigate.and.callFake(() => { order.push('navigate'); return Promise.resolve(true); });
    fixture.nativeElement.querySelector('.variant-search-create').click();
    expect(order).toEqual(['close', 'navigate']);
    expect(navigate).toHaveBeenCalledWith(['/', 'sorelle', 'dashboard', 'products', 'create']);
  });

  it('does not offer a duplicate product when the product already exists without variants', () => {
    lookup();
    result.next({ data: [{ id: 1, name: 'Producto nuevo', variants: [] }] });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.variant-search-create')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('El producto no tiene variantes disponibles');
  });

  it('does not offer creation after a failed or malformed response', () => {
    lookup();
    result.error(new Error('Offline'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.variant-search-create')).toBeNull();
    const retry = new Subject<any>();
    search.and.returnValue(retry);
    component.getSearch();
    retry.next({ message: 'Invalid response' });
    fixture.detectChanges();
    expect(component.searchError).toBeTrue();
    expect(component.canCreateProduct).toBeFalse();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('does not reuse a missing-product result for a different query', () => {
    lookup('Primero');
    result.next({ data: [] });
    fixture.detectChanges();
    expect(component.canCreateProduct).toBeTrue();
    component.form.controls['search'].setValue('Segundo', { emitEvent: false });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.variant-search-create')).toBeNull();
    component.createProduct();
    expect(navigate).not.toHaveBeenCalled();
    component.clearSearch();
    expect(component.canCreateProduct).toBeFalse();
  });

  it('keeps the action opt-in for other variant selection workflows', () => {
    fixture.componentRef.setInput('allowProductCreation', false);
    lookup();
    result.next({ data: [] });
    fixture.detectChanges();
    expect(component.canCreateProduct).toBeFalse();
  });

  it('closes the actual production modal when opening ProductCreatePage', async () => {
    const production = TestBed.createComponent(ManufactureProductionVariantIndexComponent);
    production.componentRef.setInput('manufacture_id', 24);
    production.detectChanges();
    production.nativeElement.querySelector('.production-empty button').click();
    TestBed.inject(ApplicationRef).tick();
    const searchElement = document.querySelector('ngb-modal-window app-variant-search')!;
    const modalSearch = (getDebugNode(searchElement) as DebugElement).componentInstance as VariantSearchComponent;
    modalSearch.form.controls['search'].setValue('No existe', { emitEvent: false });
    modalSearch.getSearch();
    result.next({ data: [] });
    TestBed.inject(ApplicationRef).tick();
    const hidden = firstValueFrom(production.componentInstance.modal.hidden);
    (document.querySelector('ngb-modal-window .variant-search-create') as HTMLButtonElement).click();
    await hidden;
    expect(document.querySelector('ngb-modal-window')).toBeNull();
    expect(document.querySelector('ngb-modal-backdrop')).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/', 'sorelle', 'dashboard', 'products', 'create']);
    production.destroy();
  });
});

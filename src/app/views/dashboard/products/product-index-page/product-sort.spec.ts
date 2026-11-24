import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { Product } from 'src/app/interfaces/product.interface';
import { BaseService } from 'src/app/views/base.service';
import { ProductService } from '../product.service';
import { ProductIndexPageComponent } from './product-index-page.component';
import { ProductSearchPageComponent } from '../product-search-page/product-search-page.component';

registerLocaleData(localeEsPe);

describe('Product catalog ordering', () => {
  let catalog: jasmine.Spy;
  let firstPage: Subject<unknown>;

  const product = (id: number): Product => ({ id, name: 'Producto ' + id, status: 1, slug: 'producto-' + id, stock_total: id, price: 1, sizes: [], colors: [], options: [], variants: [] });

  beforeEach(async () => {
    firstPage = new Subject();
    catalog = jasmine.createSpy('getCatalog').and.returnValue(firstPage);
    spyOn(IntersectionObserver.prototype, 'observe').and.stub();
    spyOn(IntersectionObserver.prototype, 'disconnect').and.stub();
    await TestBed.configureTestingModule({
      imports: [ProductIndexPageComponent],
      providers: [
        provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
        { provide: BaseService, useValue: { store: 'sorelle', storeName: 'sorelle' } },
        { provide: ProductService, useValue: { getCatalog: catalog } },
      ],
    }).compileComponents();
  });

  it('starts with recent products and exposes the active ordering', () => {
    const fixture = TestBed.createComponent(ProductIndexPageComponent);
    fixture.detectChanges();
    expect(catalog).toHaveBeenCalledOnceWith(1, 'created_at', 'desc');
    expect(fixture.nativeElement.querySelector('th[aria-sort="descending"]').textContent).toContain('Fecha de creación');
  });

  it('resets pagination and cancels an older response when switching to stock', () => {
    const fixture = TestBed.createComponent(ProductIndexPageComponent);
    fixture.detectChanges();
    const stockPage = new Subject();
    catalog.and.returnValue(stockPage);
    fixture.nativeElement.querySelector('button[aria-label="Ordenar por stock"]').click();
    expect(catalog).toHaveBeenCalledWith(1, 'stock_total', 'desc');
    firstPage.next({ data: [product(1)] });
    expect(fixture.componentInstance.products).toEqual([]);
    stockPage.next({ data: [product(9)], meta: { last_page: 2, total: 2 } });
    stockPage.complete();
    fixture.detectChanges();
    expect(fixture.componentInstance.products.map(item => item.id)).toEqual([9]);
    expect(fixture.componentInstance.page).toBe(1);
    expect(fixture.nativeElement.querySelector('th[aria-sort="descending"]').textContent).toContain('Stock');
    catalog.and.returnValue(new Subject());
    fixture.componentInstance.changeSort('stock_total');
    fixture.detectChanges();
    expect(catalog).toHaveBeenCalledTimes(3);
    expect(catalog.calls.mostRecent().args).toEqual([1, 'stock_total', 'asc']);
    expect(fixture.nativeElement.querySelector('th[aria-sort="ascending"]').textContent).toContain('Stock');
  });

  it('replaces each page, keeps ordering and blocks overlapping or out-of-range loads', () => {
    const fixture = TestBed.createComponent(ProductIndexPageComponent);
    fixture.detectChanges();
    firstPage.next({ data: [product(1)], meta: { last_page: 2, total: 2 } });
    firstPage.complete();
    fixture.detectChanges();
    const nextPage = new Subject();
    catalog.and.returnValue(nextPage);
    const buttons = fixture.nativeElement.querySelectorAll('.product-pagination button') as NodeListOf<HTMLButtonElement>;
    expect(buttons[0].disabled).toBeTrue();
    buttons[1].click(); fixture.detectChanges();
    fixture.componentInstance.changePage(2);
    expect(buttons[1].disabled).toBeTrue();
    expect(catalog).toHaveBeenCalledTimes(2);
    expect(catalog).toHaveBeenCalledWith(2, 'created_at', 'desc');
    nextPage.next({ data: [product(2)], meta: { last_page: 2, total: 2 } });
    nextPage.complete();
    fixture.detectChanges();
    expect(fixture.componentInstance.products.map(item => item.id)).toEqual([2]);
    expect(fixture.nativeElement.querySelector('.product-pagination').textContent).toContain('Página 2 de 2');
    expect(buttons[1].disabled).toBeTrue();
    expect(buttons[0].disabled).toBeFalse();
    fixture.componentInstance.changePage(3);
    expect(catalog).toHaveBeenCalledTimes(2);
    catalog.and.returnValue(of({ data: [product(1)], last_page: 2, total: 2 }));
    buttons[0].click(); fixture.detectChanges();
    expect(catalog.calls.mostRecent().args).toEqual([1, 'created_at', 'desc']);
    expect(fixture.componentInstance.products.map(item => item.id)).toEqual([1]);
  });

  it('retries the failed page without skipping it or mixing products from other pages', () => {
    const fixture = TestBed.createComponent(ProductIndexPageComponent);
    fixture.detectChanges();
    firstPage.next({ data: [product(1)], meta: { last_page: 3 } });
    firstPage.complete();
    const failedPage = new Subject();
    catalog.and.returnValue(failedPage);
    fixture.componentInstance.changePage(2);
    failedPage.error(new Error('Network error'));
    expect(fixture.componentInstance.page).toBe(2);
    expect(fixture.componentInstance.products.length).toBe(0);
    const retryPage = new Subject();
    catalog.and.returnValue(retryPage);
    fixture.componentInstance.retry();
    expect(catalog.calls.mostRecent().args).toEqual([2, 'created_at', 'desc']);
    retryPage.next({ data: [product(2)], meta: { last_page: 3 } });
    retryPage.complete();
    expect(fixture.componentInstance.products.map(item => item.id)).toEqual([2]);
    expect(fixture.componentInstance.error).toBe('');
  });

  it('retains the selected ordering when navigating to search results', () => {
    const fixture = TestBed.createComponent(ProductIndexPageComponent);
    fixture.detectChanges();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture.componentInstance.sortBy = 'stock_total';
    fixture.componentInstance.receiveParams({ search: 'Blusa' });
    expect(navigate).toHaveBeenCalledWith(['search'], jasmine.objectContaining({ queryParams: { search: 'Blusa', sort_by: 'stock_total', sort_direction: 'desc' } }));
  });

  it('exposes a sort control for each data column and starts text sorting ascending', () => {
    const fixture = TestBed.createComponent(ProductIndexPageComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('th .product-column-sort').length).toBe(6);
    expect(fixture.nativeElement.querySelector('.product-sort-toolbar')).toBeNull();
    catalog.and.returnValue(new Subject());
    fixture.nativeElement.querySelector('button[aria-label="Ordenar por producto"]').click();
    fixture.detectChanges();
    expect(catalog.calls.mostRecent().args).toEqual([1, 'name', 'asc']);
    expect(fixture.nativeElement.querySelector('th[aria-sort="ascending"]').textContent).toContain('Producto');
  });
});

describe('Product search pagination', () => {
  it('paginates filtered results, replaces rows and returns to page one for a new search', async () => {
    const search = jasmine.createSpy('search').and.returnValue(of({ data: [{ id: 1, name: 'Blusa' }], last_page: 3, total: 120 }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: ActivatedRoute, useValue: { queryParams: of({ search: 'Blusa', sort_by: 'name', sort_direction: 'asc' }) } },
      { provide: ProductService, useValue: { search } }, { provide: BaseService, useValue: { store: 'sorelle' } }] });
    const fixture = TestBed.createComponent(ProductSearchPageComponent); fixture.detectChanges();
    expect(search).toHaveBeenCalledWith({ search: 'Blusa', sort_by: 'name', sort_direction: 'asc', page: 1 });
    const next = new Subject(); search.and.returnValue(next);
    (fixture.nativeElement.querySelectorAll('.product-pagination button')[1] as HTMLButtonElement).click(); fixture.detectChanges();
    expect(search.calls.mostRecent().args[0]).toEqual({ search: 'Blusa', sort_by: 'name', sort_direction: 'asc', page: 2 });
    fixture.componentInstance.changePage(3);
    expect(search).toHaveBeenCalledTimes(2);
    next.next({ data: [{ id: 2, name: 'Blusa 2' }], last_page: 3, total: 120 }); next.complete(); fixture.detectChanges();
    expect(fixture.componentInstance.products.map(product => product.id)).toEqual([2]);
    expect(fixture.nativeElement.querySelector('.product-pagination').textContent).toContain('Página 2 de 3');
    search.and.returnValue(of({ data: [], last_page: 1, total: 0 }));
    fixture.componentInstance.receiveParams({ search: 'Falda' }); fixture.detectChanges();
    expect(search.calls.mostRecent().args[0]).toEqual({ search: 'Falda', sort_by: 'name', sort_direction: 'asc', page: 1 });
    const buttons = fixture.nativeElement.querySelectorAll('.product-pagination button') as NodeListOf<HTMLButtonElement>;
    expect(buttons[0].disabled).toBeTrue(); expect(buttons[1].disabled).toBeTrue();
    fixture.destroy();
  });
});

describe('Product catalog API sorting parameters', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting(), { provide: BaseService, useValue: { store: 'sorelle' } }],
  }));

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('requests the first page ordered by creation date descending', () => {
    const service = TestBed.inject(ProductService);
    service.getCatalog().subscribe();
    const request = TestBed.inject(HttpTestingController).expectOne(req => req.url === service.baseUrl);
    expect(request.request.params.get('page')).toBe('1');
    expect(request.request.params.get('sort_by')).toBe('created_at');
    expect(request.request.params.get('sort_direction')).toBe('desc');
    request.flush({ data: [] });
  });

  it('requests stock ordering with the requested page', () => {
    const service = TestBed.inject(ProductService);
    service.getCatalog(2, 'stock_total', 'asc').subscribe();
    const request = TestBed.inject(HttpTestingController).expectOne(req => req.url === service.baseUrl);
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('sort_by')).toBe('stock_total');
    expect(request.request.params.get('sort_direction')).toBe('asc');
    request.flush({ data: [] });
  });
});

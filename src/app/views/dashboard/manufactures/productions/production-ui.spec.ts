import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { BaseService } from 'src/app/views/base.service';
import { ManufactureProductionService } from './manufacture.production.service';
import { ManufactureProductionIndexPageComponent } from './manufacture-production-index-page/manufacture-production-index-page.component';
import { ManufactureProductionCreateComponent } from './manufacture-production-create/manufacture-production-create.component';
import { ProductionWidgetComponent } from './manufacture-production-edit-page/production-widget/production-widget.component';

registerLocaleData(localeEsPe);

describe('Production screens', () => {
  let listing: Subject<unknown>;
  let creation: Subject<unknown>;
  let index: jasmine.Spy;
  let store: jasmine.Spy;

  beforeEach(async () => {
    listing = new Subject();
    creation = new Subject();
    index = jasmine.createSpy('index').and.returnValue(listing);
    store = jasmine.createSpy('store').and.returnValue(creation);
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDenied: false, isDismissed: true });

    await TestBed.configureTestingModule({
      imports: [ManufactureProductionIndexPageComponent, ManufactureProductionCreateComponent, ProductionWidgetComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BaseService, useValue: { store: 'sorelle', storeName: 'sorelle' } },
        { provide: ManufactureProductionService, useValue: { index, store } },
      ],
    }).compileComponents();
  });

  it('keeps the filters and offers a retry when loading the list fails', () => {
    const fixture = TestBed.createComponent(ManufactureProductionIndexPageComponent);
    fixture.detectChanges();
    listing.error(new Error('Network error'));
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('app-manufacture-index-filters')).not.toBeNull();
    expect(element.textContent).toContain('No pudimos cargar las producciones');
    const retry = element.querySelector<HTMLButtonElement>('[role="alert"] button')!;
    index.and.returnValue(new Subject());
    retry.click();
    expect(index).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.loading).toBeTrue();
  });

  it('aligns production data and preserves the link to its products', () => {
    const fixture = TestBed.createComponent(ManufactureProductionIndexPageComponent);
    fixture.detectChanges();
    listing.next({ data: [{ id: 25, name: 'Colección verano', sum_variants: 20, sum_kardexes: 8, sum_purchases: 400, count_variants: 2 }] });
    listing.complete();
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('thead th').length).toBe(7);
    expect(element.querySelectorAll('tbody tr:first-child td').length).toBe(7);
    expect(element.querySelector('.production-received')?.textContent?.trim()).toBe('8');
    expect(element.querySelector('.production-name')?.getAttribute('href')).toBe('/sorelle/dashboard/manufactures/productions/25/variants');
    expect(element.querySelector('.production-list-count')?.textContent).toContain('1 registros');
  });

  it('shows an actionable empty state without hiding the filters', () => {
    const fixture = TestBed.createComponent(ManufactureProductionIndexPageComponent);
    fixture.detectChanges();
    listing.next({ data: [] });
    listing.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay producciones para mostrar');
    expect(fixture.nativeElement.querySelector('app-manufacture-index-filters')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.production-empty a')?.getAttribute('href')).toBe('/create');
  });

  it('makes all four detail sections accessible with their summary values', async () => {
    const fixture = TestBed.createComponent(ProductionWidgetComponent);
    fixture.componentRef.setInput('summary', { sum_variants: 20, sum_purchases: 400, count_variants: 2, sum_kardexes: 8 });
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();
    fixture.detectChanges();
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('nav a');
    expect(links.length).toBe(4);
    expect(links[0].getAttribute('aria-current')).toBe('page');
    expect(links[0].textContent).toContain('20.00');
    expect(links[1].getAttribute('href')).toBe('/purchases');
    expect(links[2].getAttribute('href')).toBe('/variants');
    expect(links[3].getAttribute('href')).toBe('/kardexes');
    fixture.componentRef.setInput('summary', { sum_variants: 10, sum_purchases: 90, count_variants: 1, sum_kardexes: 0 });
    fixture.detectChanges();
    expect(links[0].textContent).toContain('9.00');
  });

  it('validates creation and prevents submitting the same production twice', () => {
    const fixture = TestBed.createComponent(ManufactureProductionCreateComponent);
    fixture.detectChanges();
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(store).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Ingresa un nombre');
    fixture.componentInstance.form.get('name')!.setValue('Lote de verano');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(store).toHaveBeenCalledOnceWith({ name: 'Lote de verano' });
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    creation.error(new Error('Network error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeFalse();
    expect(fixture.componentInstance.form.get('name')!.value).toBe('Lote de verano');
  });
});

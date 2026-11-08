import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { BaseService } from 'src/app/views/base.service';
import { ManufactureProductionService } from '../../productions/manufacture.production.service';
import { ManufactureOrderService } from '../../orders/manufacture.order.service';
import { ManufactureProductionIndexPageComponent } from '../../productions/manufacture-production-index-page/manufacture-production-index-page.component';
import { ManufactureOrderIndexPageComponent } from '../../orders/manufacture-order-index-page/manufacture-order-index-page.component';

for (const screen of [
  { name: 'Production list', component: ManufactureProductionIndexPageComponent, service: ManufactureProductionService, theme: 'production', label: 'Fabricación' },
  { name: 'Purchase order list', component: ManufactureOrderIndexPageComponent, service: ManufactureOrderService, theme: 'order', label: 'Abastecimiento' },
]) {
  describe(screen.name, () => {
    let listing: Subject<unknown>;
    let result: Subject<unknown>;
    let index: jasmine.Spy;
    let search: jasmine.Spy;

    beforeEach(async () => {
      listing = new Subject();
      result = new Subject();
      index = jasmine.createSpy('index').and.returnValue(listing);
      search = jasmine.createSpy('search').and.returnValue(result);
      await TestBed.configureTestingModule({
        imports: [screen.component],
        providers: [
          provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
          { provide: BaseService, useValue: { store: 'sorelle', storeName: 'sorelle' } },
          { provide: screen.service, useValue: { index, search } },
        ],
      }).compileComponents();
    });

    it('identifies the section and routes the switch to both modules', () => {
      const fixture = TestBed.createComponent<any>(screen.component);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.manufacture-theme-' + screen.theme)).not.toBeNull();
      expect(fixture.nativeElement.querySelector('.manufacture-context').textContent).toContain(screen.label);
      const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('.manufacture-section-switch a');
      expect(links[0].getAttribute('href')).toBe('/sorelle/dashboard/manufactures/productions');
      expect(links[1].getAttribute('href')).toBe('/sorelle/dashboard/manufactures/orders');
    });

    it('searches once with the selected criteria and clears back to the unfiltered endpoint', () => {
      const fixture = TestBed.createComponent<any>(screen.component);
      fixture.detectChanges();
      listing.next({ data: [] });
      listing.complete();
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="search"]');
      input.value = '  Verano  ';
      input.dispatchEvent(new Event('input'));
      fixture.nativeElement.querySelector('form.manufacture-filters').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      expect(search).toHaveBeenCalledOnceWith({ search: 'Verano', start_date: '', end_date: '' });
      result.next({ data: [] });
      result.complete();
      fixture.detectChanges();
      index.and.returnValue(new Subject());
      fixture.nativeElement.querySelector('.manufacture-filter-actions button[type="button"]').click();
      expect(index).toHaveBeenCalledTimes(2);
      expect(fixture.componentInstance.activeFilters).toBeNull();
      expect(input.value).toBe('');
    });

    it('cancels an older request so it cannot replace newer results', () => {
      const fixture = TestBed.createComponent<any>(screen.component);
      fixture.detectChanges();
      fixture.componentInstance.applyFilters({ search: 'Nuevo', start_date: '', end_date: '' });
      listing.next({ data: [{ id: 1, name: 'Viejo' }] });
      expect(fixture.componentInstance.loading).toBeTrue();
      expect(fixture.componentInstance.productions ?? fixture.componentInstance.manufactures).toEqual([]);
      result.next({ data: [{ id: 2, name: 'Nuevo' }] });
      result.complete();
      expect(fixture.componentInstance.productions ?? fixture.componentInstance.manufactures).toEqual([{ id: 2, name: 'Nuevo' }]);
      expect(fixture.componentInstance.loading).toBeFalse();
    });
  });
}

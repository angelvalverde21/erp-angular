import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { BaseService } from '../../base.service';
import { filterNavigation } from '../../../layout/default-layout/navs/filter-navigation';
import { navMigrations } from '../../../layout/default-layout/navs/_nav.migrations';
import { ShopifyOrderMigrationComponent, ShopifyOrderMigrationService } from './shopify-order-migration.component';

const preparation = {
  data: {
    store: { id: 1, name: 'Sorelle', slug: 'sorelle' },
    enabled: false,
    schema_ready: false,
    checks: [{ label: 'Estructura local', ready: false }],
    history_permission: 'read_all_orders',
    command: 'php artisan shopify:orders-import sorelle --execute',
    runs: [],
  },
};

describe('Shopify migration preparation', () => {
  it('only reads local preparation and cannot launch an import from the UI', () => {
    const service = jasmine.createSpyObj('MigrationService', ['preparation']);
    service.preparation.and.returnValue(of(preparation));
    TestBed.configureTestingModule({ providers: [{ provide: ShopifyOrderMigrationService, useValue: service }] });
    const fixture = TestBed.createComponent(ShopifyOrderMigrationComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const importButton = root.querySelector<HTMLButtonElement>('.migration-start')!;
    expect(importButton.disabled).toBeTrue();
    expect(root.textContent).toContain('Sin ejecutar');
    expect(root.textContent).toContain('Todavía no hay ejecuciones');
    importButton.click();
    expect(service.preparation).toHaveBeenCalledTimes(1);
    root.querySelector<HTMLButtonElement>('.migration-button')!.click();
    expect(service.preparation).toHaveBeenCalledTimes(2);
  });

  it('shows permission failures without reporting an empty history as success', () => {
    const service = jasmine.createSpyObj('MigrationService', ['preparation']);
    service.preparation.and.returnValue(throwError(() => ({ status: 403 })));
    TestBed.configureTestingModule({ providers: [{ provide: ShopifyOrderMigrationService, useValue: service }] });
    const fixture = TestBed.createComponent(ShopifyOrderMigrationComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('No tienes permiso');
    expect(fixture.nativeElement.querySelector('.migration-start').disabled).toBeTrue();
  });

  it('prevents duplicate preparation requests while loading', () => {
    const pending = new Subject<any>();
    const service = jasmine.createSpyObj('MigrationService', ['preparation']);
    service.preparation.and.returnValue(pending);
    TestBed.configureTestingModule({ providers: [{ provide: ShopifyOrderMigrationService, useValue: service }] });
    const fixture = TestBed.createComponent(ShopifyOrderMigrationComponent);
    fixture.detectChanges();
    fixture.componentInstance.refresh();
    expect(service.preparation).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
    fixture.destroy();
  });

  it('limits the migration menu to management', () => {
    expect(filterNavigation(navMigrations, ['sales']).length).toBe(0);
    expect(filterNavigation(navMigrations, ['ceo'])[0].children?.length).toBe(1);
  });

  it('uses only GET on the scoped local preparation endpoint', () => {
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: BaseService, useValue: { store: 'sorelle' } },
    ] });
    const http = TestBed.inject(HttpTestingController);
    TestBed.inject(ShopifyOrderMigrationService).preparation().subscribe();
    const request = http.expectOne(req => req.url.endsWith('/sorelle/dashboard/migrations/shopify/orders'));
    expect(request.request.method).toBe('GET');
    request.flush(preparation);
    http.verify();
  });
});
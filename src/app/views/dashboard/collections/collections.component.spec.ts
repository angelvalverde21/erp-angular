import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { BaseService } from '../../base.service';
import { CollectionService } from './collection.service';
import { CollectionsComponent } from './collections.component';
import { CollectionWorkspace } from './collection.model';
import { ManufactureVariantService } from '../manufactures/manufacture.variants.service';
import { ManufactureService } from '../manufactures/manufacture.service';
import { ManufactureVariantIndexComponent } from '../manufactures/variants/manufacture-variant-index/manufacture-variant-index.component';
import { ManufactureProductionVariantIndexComponent } from '../manufactures/productions/manufacture-production-edit-page/manufacture-production-variant-index/manufacture-production-variant-index.component';
import Swal from 'sweetalert2';

registerLocaleData(localeEsPe);
const snapshot: CollectionWorkspace = {
  collection: { id: 7, name: 'Verano', description: 'Nueva colección', status: 'in_progress', starts_on: null, ends_on: null, launch_on: null },
  collections: [{ id: 7, name: 'Verano' }],
  processes: [{ id: 3, name: 'Lote A', collection_id: 7, collection_name: 'Verano', kind: 'production', source_type: 'manufacture', source_id: 41,
    owner_type: 'manufacture', owner_id: 41, status: 'in_progress', progress: 50, starts_on: null, due_on: null, notes: null, purchases: [], stages: [], purchases_amount: 100, paid: 80 }],
  products: [], purchases: [], sales: [], timeline: [{ date: '2026-11-20', paid: 80, collected: 40 }],
  overview: { total_sales: 50, orders_count: 2, total_spent: 100, remaining_recovery: 50, recovery_percent: 50, recovery_status: 'progress' },
  summary: { processes: 1, completed: 0, overdue: 0, planned_units: 10, received_units: 4, attributed_units: 2, purchases: 100, paid: 80,
    pending_payment: 20, sales: 50, collected: 40, cash_balance: -40, remaining_recovery: 40, recovery_percent: 50 },
};

describe('Collections workspace', () => {
  let service: jasmine.SpyObj<CollectionService>;
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let query: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  beforeEach(() => {
    params = new BehaviorSubject(convertToParamMap({ collection_id: '7' }));
    query = new BehaviorSubject(convertToParamMap({}));
    service = jasmine.createSpyObj('CollectionService', ['list', 'workspace', 'options', 'createCollection', 'saveCollection', 'process', 'attachProcesses', 'detach', 'sale', 'removeSale', 'receipt', 'previewInventory', 'sendInventory']);
    service.workspace.and.returnValue(of({ data: structuredClone(snapshot) }));
    service.list.and.returnValue(of({ data: [], current_page: 1, last_page: 1, total: 0 }));
    service.options.and.returnValue(of({ data: [] }));
    TestBed.configureTestingModule({ providers: [provideRouter([]),
      { provide: ActivatedRoute, useValue: { paramMap: params, queryParamMap: query, snapshot: { queryParamMap: convertToParamMap({}) } } },
      { provide: BaseService, useValue: { store: 'sorelle' } }, { provide: CollectionService, useValue: service }] });
  });
  async function setup() {
    const fixture = TestBed.createComponent(CollectionsComponent); fixture.detectChanges();
    await fixture.whenStable(); fixture.detectChanges(); return fixture;
  }
  it('searches processes with the search button or form submit and keeps matching actions aligned', async () => {
    query.next(convertToParamMap({ view: 'processes' }));
    const fixture = await setup(); const component = fixture.componentInstance;
    component.workspace!.processes.push({ ...snapshot.processes[0], id: 9, source_id: 52, name: 'Sesión Natalia', kind: 'photo_session', status: 'planned', responsible: { id: 5, name: 'Pamela' } });
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#collection-process-search') as HTMLInputElement;
    const searchForm = fixture.nativeElement.querySelector('form.collection-process-search') as HTMLFormElement;
    const searchButton = searchForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    for (const term of ['  SESION natalia  ', '#52', 'fotografica', 'pamela', 'programado']) {
      input.value = term; input.dispatchEvent(new Event('input')); fixture.detectChanges();
      if (term === '  SESION natalia  ') {
        expect(component.filteredProcesses.length).toBe(2);
        searchButton.click();
      } else { searchForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }
      fixture.detectChanges();
      expect(component.filteredProcesses.map(process => process.id)).toEqual([9]);
      expect(fixture.nativeElement.querySelectorAll('.process-data-scroll tbody tr').length).toBe(1);
      const actions = fixture.nativeElement.querySelector('.process-actions-fixed tbody tr') as HTMLElement;
      expect(actions.getAttribute('aria-labelledby')).toBe('collection-process-9');
    }
    input.value = 'sin coincidencias'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    searchButton.click(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.process-data-scroll').textContent).toContain('No se encontraron procesos');
    expect(fixture.nativeElement.querySelector('.process-actions-fixed button')).toBeNull();
    (fixture.nativeElement.querySelector('[aria-label="Limpiar búsqueda de procesos"]') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(component.filteredProcesses.length).toBe(2);
    expect(component.processSearchTerm).toBe('');
    expect(service.workspace).toHaveBeenCalledTimes(1);
    params.next(convertToParamMap({ collection_id: '8' }));
    expect(component.processSearch).toBe('');
    fixture.destroy();
  });
  it('shows four indicators including planned and received units without a Results panel', async () => {
    const fixture = await setup();
    expect(service.workspace).toHaveBeenCalledWith(7);
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Verano');
    expect(fixture.nativeElement.querySelectorAll('.metrics .metric').length).toBe(4);
    expect(fixture.nativeElement.querySelector('.collection-units-metric').textContent).toContain('Unidades planificadas');
    expect(fixture.nativeElement.querySelector('.collection-units-metric strong').textContent).toBe('10');
    expect(fixture.nativeElement.querySelector('.collection-units-metric small').textContent).toContain('4 unidades recibidas');
    expect(fixture.nativeElement.textContent).toContain('Compras acumuladas');
    expect(fixture.nativeElement.textContent).toContain('Ventas netas');
    expect(fixture.nativeElement.querySelector('.metrics .metric:last-child').textContent).toContain('50 % recuperado');
    expect(fixture.nativeElement.querySelectorAll('.dashboard-grid > .panel').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.dashboard-grid').textContent).toContain('Avance de los procesos');
    expect(fixture.nativeElement.querySelector('.dashboard-grid').textContent).toContain('10 unidades previstas');
    expect(fixture.nativeElement.textContent).toContain('Próximas actividades');
    expect(fixture.nativeElement.querySelector('svg').getAttribute('aria-label')).toContain('pagos y cobros');
    expect(fixture.nativeElement.querySelector('.dashboard-results')).toBeNull();
    fixture.destroy();
  });
  it('creates a project without a budget and blocks duplicate submissions', async () => {
    params.next(convertToParamMap({})); const fixture = await setup();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const pending = new Subject<{ data: typeof snapshot.collection }>(); service.createCollection.and.returnValue(pending);
    const component = fixture.componentInstance;
    await component.open('collection'); component.draft.name = 'Invierno';
    const first = component.save(); await component.save();
    expect(service.createCollection).toHaveBeenCalledTimes(1);
    expect(service.createCollection.calls.mostRecent().args[0]).not.toEqual(jasmine.objectContaining({ budget: jasmine.anything() }));
    expect(component.saving).toBeTrue();
    pending.next({ data: { ...snapshot.collection, id: 8 } }); pending.complete(); await first;
    expect(navigate).toHaveBeenCalledWith(['/', 'sorelle', 'dashboard', 'collections', '8']);
    fixture.destroy();
  });
  it('preserves a selected existing process and shows the API explanation after an error', async () => {
    const fixture = await setup(); const component = fixture.componentInstance;
    await component.open('process'); component.draft.mode = 'existing'; component.selectedSourceIds.add(41); component.options = [{ id: 41, name: 'Lote', type: 'production' }];
    service.attachProcesses.and.returnValue(throwError(() => ({ error: { errors: { source_id: ['Ya está vinculado a otra colección.'] } } })));
    await component.save(); fixture.detectChanges();
    expect(component.selectedSourceIds.has(41)).toBeTrue();
    expect(component.formError).toContain('Ya está vinculado');
    expect(fixture.nativeElement.querySelector('dialog:not(.inventory-review-dialog)').open).toBeTrue();
    expect(component.saving).toBeFalse(); fixture.destroy();
  });
  it('keeps filtered collection responses from replacing a newer request', async () => {
    const fixture = await setup(); const old = new Subject<{ data: CollectionWorkspace }>();
    service.workspace.and.returnValues(old, of({ data: { ...structuredClone(snapshot), summary: { ...snapshot.summary, paid: 120 } } }));
    const component = fixture.componentInstance; component.collectionId = 2;
    const first = component.load(); component.collectionId = 7; await component.load();
    old.next({ data: snapshot }); old.complete(); await first;
    expect(component.workspace!.summary.paid).toBe(120); fixture.destroy();
  });
  it('uses existing manufacture and product workspaces and provides independent project tabs', async () => {
    query.next(convertToParamMap({ view: 'processes' })); const fixture = await setup();
    expect(fixture.componentInstance.originLink(snapshot.processes[0])).toEqual(['/', 'sorelle', 'dashboard', 'manufactures', 'productions', '41']);
    expect(fixture.nativeElement.querySelectorAll('.collection-tabs button').length).toBe(5);
    expect(fixture.nativeElement.querySelector('button[aria-label="Desvincular proceso"] i')).not.toBeNull();
    fixture.destroy();
  });
  it('shows a retry action after loading fails without claiming the project list is empty', async () => {
    params.next(convertToParamMap({}));
    service.list.and.returnValue(throwError(() => ({ error: { message: 'La sección Proyectos aún no está instalada.' } })));
    const fixture = await setup();
    expect(fixture.nativeElement.querySelector('.empty')).toBeNull();
    expect(fixture.nativeElement.querySelector('.pagination')).toBeNull();
    expect(fixture.nativeElement.querySelector('.header-actions button').disabled).toBeTrue();
    const retry: HTMLButtonElement = fixture.nativeElement.querySelector('.retry-button');
    expect(retry.textContent).toContain('Reintentar');
    service.list.and.returnValue(of({ data: [], current_page: 1, last_page: 1, total: 0 }));
    retry.click(); await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.load-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('.empty')).not.toBeNull();
    fixture.destroy();
  });
  it('directs product management to production processes without offering manual catalog associations', async () => {
    query.next(convertToParamMap({ view: 'products' }));
    service.workspace.and.returnValue(of({ data: { ...structuredClone(snapshot), products: [{ id: 12, name: 'Blusa Lucía', stock_total: 4 }] } }));
    const fixture = await setup();
    const text = fixture.nativeElement.textContent;
    expect(text).not.toContain('Organizar producto');
    expect(text).toContain('Los productos se incorporan desde las producciones');
    const actionCell: HTMLTableCellElement = fixture.nativeElement.querySelector('.table-scroll tbody tr td:last-child');
    const productAction = actionCell.querySelector('.collection-product-actions button')!;
    expect(getComputedStyle(actionCell).textAlign).toBe('right');
    if (getComputedStyle(fixture.nativeElement.querySelector('.collection-product-table-scroll')).display !== 'none') {
      expect(actionCell.getBoundingClientRect().right - productAction.getBoundingClientRect().right).toBeCloseTo(20, 0);
    } else {
      expect(getComputedStyle(fixture.nativeElement.querySelector('.collection-mobile-products')).display).toBe('grid');
    }
    expect(getComputedStyle(actionCell.previousElementSibling!).fontSize).toBe('14px');
    expect(getComputedStyle(fixture.nativeElement.querySelector('.section-heading button')).fontSize).toBe('14px');
    const navigate = spyOn(fixture.componentInstance, 'navigate');
    const action = fixture.nativeElement.querySelector('.section-heading button');
    action.click();
    expect(navigate).toHaveBeenCalledWith('processes');
    fixture.destroy();
  });
  it('uses compact cards and collapsed tools at a mobile viewport without horizontal scrolling', async () => {
    query.next(convertToParamMap({ view: 'products' }));
    service.workspace.and.returnValue(of({ data: { ...structuredClone(snapshot), products: [{
      id: 12, name: 'Blusa tejida Lucia Cocoa con Rosa', manufacture_units: 35, manufacture_variants: [
        { id: 1, variant_id: 10, name: 'PETITE', sku: '1655PET', quantity: 25, source_id: 30, source_name: 'Orden de blusas', source_type: 'order' },
        { id: 2, variant_id: 11, name: 'REGULAR', sku: '1656REG', quantity: 10, source_id: 30, source_name: 'Orden de blusas', source_type: 'order' },
      ],
    }] } }));
    const fixture = await setup();
    const frame = document.createElement('iframe');
    frame.style.cssText = 'width:390px;height:844px;border:0;';
    document.body.appendChild(frame);
    const doc = frame.contentDocument!, win = frame.contentWindow!;
    doc.body.style.margin = '0';
    for (const style of Array.from(document.head.querySelectorAll('style'))) doc.head.appendChild(style.cloneNode(true));
    doc.body.appendChild(fixture.nativeElement);
    try {
      const root = fixture.nativeElement as HTMLElement;
      const computed = (selector: string) => win.getComputedStyle(root.querySelector(selector)!);
      expect(computed('.collection-product-table-scroll').display).toBe('none');
      expect(computed('.collection-mobile-products').display).toBe('grid');
      expect(computed('#collection-product-search-box').display).toBe('none');
      expect(computed('#collection-product-export-controls').display).toBe('none');
      expect(root.querySelector('.collection-products-header')!.getBoundingClientRect().height).toBeLessThan(180);
      const card = root.querySelector('.collection-mobile-product') as HTMLElement;
      expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
      const tools = root.querySelectorAll<HTMLButtonElement>('.collection-mobile-tools button');
      tools[0].click(); fixture.detectChanges();
      expect(computed('#collection-product-search-box').display).not.toBe('none');
      tools[1].click(); fixture.detectChanges();
      expect(computed('#collection-product-export-controls').display).not.toBe('none');
      root.querySelector<HTMLInputElement>('.collection-mobile-variant input')!.click(); fixture.detectChanges();
      expect(fixture.componentInstance.selectedInventoryVariantIds.has(10)).toBeTrue();
    } finally {
      document.body.appendChild(fixture.nativeElement);
      frame.remove(); fixture.destroy();
    }
  });
  it('shows linked variants and quantities separately for orders and productions', async () => {
    query.next(convertToParamMap({ view: 'products' }));
    service.workspace.and.returnValue(of({ data: { ...structuredClone(snapshot), products: [{
      id: 12, name: 'Blusa', stock_total: 0, manufacture_units: 39, manufacture_variants: [
        { id: 1, variant_id: 10, name: 'PETITE', sku: '1659PET', quantity: 25, process_id: 3, source_id: 30, source_name: 'Orden de blusas', source_type: 'order' },
        { id: 2, variant_id: 10, name: 'PETITE', sku: '1659PET', quantity: 14, process_id: 4, source_id: 37, source_name: 'Produccion de blusas', source_type: 'production' },
      ],
    }] } }));
    const fixture = await setup();
    const rows = fixture.nativeElement.querySelectorAll('.collection-product-group tr');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('.collection-product-name').getAttribute('rowspan')).toBe('2');
    expect(rows[0].querySelector('.collection-product-name').textContent).toContain('39 unidades');
    expect(rows[0].querySelector('.collection-variant').textContent).toContain('PETITE');
    expect(rows[0].querySelector('.collection-variant').textContent).toContain('1659PET');
    expect(rows[0].querySelector('.collection-variant-units').textContent.trim()).toBe('25');
    expect(rows[1].querySelector('.collection-variant-units').textContent.trim()).toBe('14');
    expect(rows[0].querySelector('.collection-product-source a').getAttribute('href')).toContain('/orders/30/variants');
    expect(rows[1].querySelector('.collection-product-source a').getAttribute('href')).toContain('/productions/37/purchases?stage=corte&view=products');
    expect(fixture.nativeElement.querySelectorAll('[aria-label="Ver producto"]').length).toBe(1);
    fixture.destroy();
  });
  it('selects unique inventory variants across manufactures and preserves selections while filtering', async () => {
    query.next(convertToParamMap({ view: 'products' }));
    service.workspace.and.returnValue(of({ data: { ...structuredClone(snapshot), products: [
      { id: 12, name: 'Blusa', manufacture_units: 20, manufacture_variants: [
        { id: 1, variant_id: 10, name: 'S', sku: 'B-S', quantity: 9, source_id: 30, source_name: 'Orden', source_type: 'order' },
        { id: 2, variant_id: 10, name: 'S', sku: 'B-S', quantity: 11, source_id: 37, source_name: 'Produccion', source_type: 'production' },
      ] },
      { id: 13, name: 'Polo', manufacture_units: 5, manufacture_variants: [
        { id: 3, variant_id: 11, name: 'M', sku: 'P-M', quantity: 5, source_id: 37, source_name: 'Produccion', source_type: 'production' },
      ] },
    ] } }));
    const fixture = await setup(), component = fixture.componentInstance;
    const first: HTMLInputElement = fixture.nativeElement.querySelector('.collection-variant input');
    first.click(); fixture.detectChanges();
    expect(component.selectedInventoryVariantIds.size).toBe(1);
    expect(component.selectedInventoryProducts).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.collection-variant input:checked').length).toBe(2);
    component.productSearch = 'Polo'; fixture.detectChanges();
    component.toggleInventoryProducts(component.filteredProducts);
    expect([...component.selectedInventoryVariantIds]).toEqual([10, 11]);
    component.toggleInventoryProducts(component.filteredProducts);
    expect([...component.selectedInventoryVariantIds]).toEqual([10]);
    expect(component.inventoryPercentages[0]).toBe(20);
    expect(component.inventoryPercentages.at(-1)).toBe(100);
    const percent: HTMLSelectElement = fixture.nativeElement.querySelector('#collection-inventory-percent');
    expect(percent.options.length).toBe(9);
    percent.selectedIndex = 2; percent.dispatchEvent(new Event('change')); fixture.detectChanges();
    expect(component.inventoryPercentage).toBe(40);
    expect(component.selectedPlannedUnits).toBe(20);
    expect(component.selectedExportUnits).toBe(8);
    expect(component.selectedInventoryPreview).toEqual([{ variant_id: 10, sku: 'B-S', planned_units: 20, export_units: 8 }]);
    component.toggleInventoryVariant(11); component.inventoryPercentage = 50; fixture.detectChanges();
    expect(component.selectedPlannedUnits).toBe(25);
    expect(component.selectedExportUnits).toBe(12);
    expect(fixture.nativeElement.querySelector('.collection-export-result strong').textContent).toContain('12 unidades');
    expect(fixture.nativeElement.querySelector('.collection-export-result small').textContent).toContain('50 %');
    fixture.destroy();
  });
  it('requires inventory review and confirmation, prevents duplicate sends and removes the clear selection button', async () => {
    query.next(convertToParamMap({ view: 'products' }));
    const fixture = await setup(), component = fixture.componentInstance;
    const review = { domain: 'test-shop.myshopify.com', location_name: 'Principal', percentage: 40, token: 'approved-token',
      items: [{ variant_id: 10, sku: 'B-S', name: 'Blusa', planned_units: 20, export_units: 8, current_units: 5 }] };
    service.previewInventory.and.returnValue(of({ data: review }));
    const pending = new Subject<{ data: { sent_variants: number; sent_units: number; message: string } }>();
    service.sendInventory.and.returnValue(pending);
    component.selectedInventoryVariantIds.add(10); component.inventoryPercentage = 40;
    await component.prepareInventoryExport(); fixture.detectChanges();
    expect(service.previewInventory).toHaveBeenCalledOnceWith(7, [10], 40);
    expect(service.sendInventory).not.toHaveBeenCalled();
    const dialog: HTMLDialogElement = fixture.nativeElement.querySelector('.inventory-review-dialog');
    expect(dialog.open).toBeTrue(); expect(dialog.textContent).toContain('test-shop.myshopify.com');
    expect(dialog.textContent).toContain('Confirmar envío a Shopify');
    expect(fixture.nativeElement.textContent).not.toContain('Limpiar selección');
    const sending = component.confirmInventoryExport(); await component.confirmInventoryExport();
    expect(service.sendInventory).toHaveBeenCalledOnceWith(7, 'approved-token', [10]);
    pending.next({ data: { sent_variants: 1, sent_units: 8, message: 'Stock confirmado.' } }); pending.complete();
    await sending; expect(dialog.open).toBeFalse(); expect(component.notice).toContain('8 unidades');
    fixture.destroy();
  });
  it('refreshes stored ERP quantities before preparing an inventory overwrite', async () => {
    query.next(convertToParamMap({ view: 'products' }));
    const fixture = await setup(), component = fixture.componentInstance;
    const persisted = { ...structuredClone(snapshot), products: [{ id: 12, name: 'Blusa', manufacture_variants: [
      { id: 1, variant_id: 10, quantity: 18, sku: 'B-S', name: 'S', source_id: 30, source_name: 'Orden', source_type: 'order' },
    ] }] };
    service.workspace.and.returnValue(of({ data: persisted }));
    service.previewInventory.and.returnValue(of({ data: { domain: 'test-shop.myshopify.com', location_name: 'Principal', percentage: 100, token: 'fresh',
      items: [{ variant_id: 10, sku: 'B-S', name: 'Blusa', planned_units: 18, export_units: 18, current_units: 5 }] } }));
    component.notice = 'Confirmación anterior'; component.selectedInventoryVariantIds.add(10);
    await component.prepareInventoryExport(); fixture.detectChanges();
    expect(service.workspace).toHaveBeenCalledTimes(2);
    expect(component.selectedExportUnits).toBe(18);
    expect(component.inventoryReview?.items[0].export_units).toBe(18);
    expect(component.notice).toBe('');
    expect(service.sendInventory).not.toHaveBeenCalled();
    fixture.destroy();
  });
  it('keeps inventory column headers visible while scrolling the confirmation table', async () => {
    const fixture = await setup(), component = fixture.componentInstance;
    const items = Array.from({ length: 20 }, (_, index) => ({ variant_id: index + 10, sku: 'SKU-' + index, name: 'Blusa ' + index,
      planned_units: 18, export_units: 18, current_units: 5 }));
    service.previewInventory.and.returnValue(of({ data: { domain: 'test-shop.myshopify.com', location_name: 'Principal', percentage: 100, token: 'scroll', items } }));
    component.selectedInventoryVariantIds.add(10);
    await component.prepareInventoryExport(); fixture.detectChanges(); await fixture.whenStable();
    const scroll = fixture.nativeElement.querySelector('.inventory-review-scroll') as HTMLElement;
    const header = scroll.querySelector('thead th') as HTMLElement;
    expect(getComputedStyle(header).position).toBe('sticky');
    const before = header.getBoundingClientRect().top;
    scroll.scrollTop = 150;
    expect(scroll.scrollTop).toBeGreaterThan(0);
    expect(Math.abs(header.getBoundingClientRect().top - before)).toBeLessThan(2);
    fixture.destroy();
  });
  it('allows excluding variants in the review, updates totals and sends only the checked variants', async () => {
    const fixture = await setup(), component = fixture.componentInstance;
    service.previewInventory.and.returnValue(of({ data: { domain: 'test-shop.myshopify.com', location_name: 'Principal', percentage: 80, token: 'subset', items: [
      { variant_id: 10, sku: 'B-S', name: 'Blusa', planned_units: 18, export_units: 14, current_units: 5 },
      { variant_id: 11, sku: 'B-M', name: 'Blusa', planned_units: 15, export_units: 12, current_units: 4 },
    ] } }));
    const pending = new Subject<{ data: { sent_variants: number; sent_units: number; message: string } }>();
    service.sendInventory.and.returnValue(pending);
    component.selectedInventoryVariantIds = new Set([10, 11]);
    await component.prepareInventoryExport(); fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('.inventory-review-dialog') as HTMLDialogElement;
    const all = dialog.querySelector('thead input') as HTMLInputElement;
    const rows = dialog.querySelectorAll('tbody input') as NodeListOf<HTMLInputElement>;
    const confirm = dialog.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(all.checked).toBeTrue();
    rows[1].click(); fixture.detectChanges();
    expect(all.indeterminate).toBeTrue();
    expect(component.reviewedInventoryUnits).toBe(14);
    expect(dialog.querySelector('.inventory-review-summary')?.textContent).toContain('1 de 2');
    expect(component.selectedInventoryVariantIds.size).toBe(2);
    all.click(); fixture.detectChanges(); expect(component.reviewedInventoryIds.size).toBe(2);
    all.click(); fixture.detectChanges(); expect(confirm.disabled).toBeTrue();
    await component.confirmInventoryExport(); expect(service.sendInventory).not.toHaveBeenCalled();
    rows[0].click(); fixture.detectChanges();
    const sending = component.confirmInventoryExport(); fixture.detectChanges();
    expect(service.sendInventory).toHaveBeenCalledOnceWith(7, 'subset', [10]);
    expect(rows[0].disabled).toBeTrue();
    component.toggleReviewedInventory(11); expect(component.reviewedInventoryIds.has(11)).toBeFalse();
    pending.next({ data: { sent_variants: 1, sent_units: 14, message: 'Stock confirmado.' } }); pending.complete(); await sending;
    expect(component.notice).toContain('1 variantes');
    expect(component.reviewedInventoryIds.size).toBe(0);
    fixture.destroy();
  });
  it('keeps a variant only once when it is selected again in orders or productions', () => {
    const original = { id: 10, variant_id: 100, quantity: 20, price: 59 };
    const added = { id: 11, variant_id: 101, quantity: 0, price: 0 };
    const batch = jasmine.createSpy('batch').and.returnValue(of({ data: [{ ...original }, added, { ...added }] }));
    TestBed.overrideProvider(ManufactureVariantService, { useValue: { batch, setManufactureId: jasmine.createSpy() } });
    TestBed.overrideProvider(ManufactureService, { useValue: { setSummary: jasmine.createSpy() } });
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDenied: false, isDismissed: true });
    for (const production of [false, true]) {
      const fixture = production ? TestBed.createComponent(ManufactureProductionVariantIndexComponent) : TestBed.createComponent(ManufactureVariantIndexComponent);
      const component = fixture.componentInstance;
      component.manufacture_variants = [original]; component.manufacture_id = 31;
      component.modal = { close: jasmine.createSpy() };
      component.receiveSearchSelectedVariants([{ id: 100 }, { id: 101 }]);
      expect(component.manufacture_variants).toEqual([original, added]);
      expect(component.manufacture_variants[0]).toBe(original);
      expect(component.sum_variants).toBe(20);
      fixture.destroy();
    }
  });
  it('preserves the same inventory approval after a failed send so it can be retried safely', async () => {
    const fixture = await setup(), component = fixture.componentInstance;
    const review = { domain: 'test-shop.myshopify.com', location_name: 'Principal', percentage: 100, token: 'retry-token',
      items: [{ variant_id: 10, sku: 'B-S', name: 'Blusa', planned_units: 18, export_units: 18, current_units: 5 }] };
    component.selectedInventoryVariantIds.add(10);
    service.previewInventory.and.returnValue(of({ data: review }));
    service.sendInventory.and.returnValue(throwError(() => ({ error: { message: 'Shopify no confirmó el envío.' } })));
    await component.prepareInventoryExport(); await component.confirmInventoryExport();
    expect(component.inventoryReview?.token).toBe('retry-token'); expect(component.inventoryBusy).toBeFalse();
    expect(component.inventoryError).toContain('Shopify');
    expect(fixture.nativeElement.querySelector('.inventory-review-dialog').open).toBeTrue();
    await component.confirmInventoryExport();
    expect(service.sendInventory).toHaveBeenCalledTimes(2);
    component.closeInventoryReview(); fixture.destroy();
  });
  it('offers collection sections in a dropdown and a separate dashboard arrow', async () => {
    params.next(convertToParamMap({}));
    service.list.and.returnValue(of({ data: [structuredClone(snapshot.collection)], current_page: 1, last_page: 1, total: 1 }));
    const fixture = await setup();
    const actions = fixture.nativeElement.querySelector('.row-actions') as HTMLElement;
    expect(actions.querySelectorAll(':scope > a').length).toBe(1);
    expect(actions.querySelector('.collection-dashboard-link')?.getAttribute('href')).toBe('/sorelle/dashboard/collections/7?view=dashboard');
    const trigger = actions.querySelector('button') as HTMLButtonElement;
    expect(trigger.textContent).toContain('Secciones');
    trigger.click(); await fixture.whenStable(); fixture.detectChanges();
    const menu = document.querySelector('[aria-labelledby="collection-section-menu-7"]') as HTMLElement;
    const links = Array.from(menu.querySelectorAll('a'));
    expect(links.map(link => link.textContent?.trim())).toEqual(['Procesos', 'Productos', 'Compras', 'Ventas y cobros']);
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '/sorelle/dashboard/collections/7?view=processes', '/sorelle/dashboard/collections/7?view=products',
      '/sorelle/dashboard/collections/7?view=purchases', '/sorelle/dashboard/collections/7?view=sales',
    ]);
    expect(service.workspace).not.toHaveBeenCalled();
    fixture.destroy();
  });
  it('keeps collection actions accessible and opens the selected collection from its edit icon', async () => {
    query.next(convertToParamMap({ view: 'dashboard' }));
    const fixture = await setup();
    const edit: HTMLButtonElement = fixture.nativeElement.querySelector('.header-actions button');
    expect(edit.textContent).toContain('Editar colección');
    expect(edit.querySelector('i')).not.toBeNull();
    edit.click(); await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('dialog:not(.inventory-review-dialog)').open).toBeTrue();
    expect(fixture.componentInstance.draft.id).toBe(7);
    expect(fixture.componentInstance.draft.name).toBe('Verano');
    fixture.destroy();
  });
  it('selects multiple productions and orders, preserving hidden selections while searching', async () => {
    const fixture = await setup(); const component = fixture.componentInstance;
    service.options.and.callFake(kind => of({ data: kind === 'responsible' ? [] : [
      { id: 41, name: 'Polos', type: 'production', created_at: '2026-11-20T03:00:00Z' },
      { id: 42, name: 'Blusas', type: 'order', created_at: '2026-11-21T03:00:00Z' },
    ] }));
    await component.open('process'); fixture.detectChanges(); await fixture.whenStable();
    const existing: HTMLInputElement = fixture.nativeElement.querySelector('input[name="mode"][value="existing"]');
    existing.click(); fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges();
    expect(service.options).toHaveBeenCalledWith('manufacture', '');
    expect(fixture.nativeElement.querySelectorAll('.process-picker-row').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.process-picker-row').textContent).toContain('Creado el 19/11/2026');
    const first: HTMLInputElement = fixture.nativeElement.querySelector('.process-picker-row input');
    first.click(); fixture.detectChanges();
    component.optionSearch = '42'; fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.process-picker-row').length).toBe(1);
    component.toggleVisibleProcesses();
    expect([...component.selectedSourceIds]).toEqual([41, 42]);
    component.toggleVisibleProcesses();
    expect([...component.selectedSourceIds]).toEqual([41]);
    component.optionSearch = ''; component.toggleVisibleProcesses();
    service.attachProcesses.and.returnValue(of({}));
    const navigate = spyOn(component, 'navigate');
    await component.save();
    expect(service.attachProcesses).toHaveBeenCalledWith(7, jasmine.objectContaining({ sources: [
      { source_id: 41, kind: 'production' }, { source_id: 42, kind: 'order' },
    ] }));
    expect(service.process).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledOnceWith('processes');
    expect(component.view).toBe('processes');
    fixture.destroy();
  });
  it('blocks an empty batch and clears selections when changing the process type', async () => {
    const fixture = await setup(); const component = fixture.componentInstance;
    await component.open('process'); component.draft.mode = 'existing';
    await component.save(); expect(service.attachProcesses).not.toHaveBeenCalled();
    component.selectedSourceIds.add(41); component.draft.kind = 'photo_session'; component.processKindChanged();
    expect(component.selectedSourceIds.size).toBe(0);
    fixture.destroy();
  });
  it('measures the collection from the route without a parent project or collection filter', async () => {
    query.next(convertToParamMap({ collection: '99' }));
    const fixture = await setup();
    expect(service.workspace).toHaveBeenCalledWith(7);
    expect(fixture.nativeElement.querySelector('select[aria-label="Filtrar por colección"]')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.collection-tabs button').length).toBe(5);
    await fixture.componentInstance.open('process'); fixture.detectChanges();
    expect(fixture.componentInstance.draft.collection_id).toBe(7);
    expect(fixture.nativeElement.querySelector('dialog select[name="collection_id"]')).toBeNull();
    fixture.destroy();
  });
  it('keeps process actions outside the horizontal scrolling area and aligned with their row', async () => {
    query.next(convertToParamMap({ view: 'processes' }));
    const fixture = await setup();
    fixture.nativeElement.style.width = '800px';
    const scroller: HTMLElement = fixture.nativeElement.querySelector('.process-data-scroll');
    const actions: HTMLElement = fixture.nativeElement.querySelector('.process-actions-fixed');
    const edit: HTMLElement = actions.querySelector('[aria-label="Organizar proceso"]')!;
    const before = edit.getBoundingClientRect().left;
    expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    scroller.scrollLeft = 150;
    expect(edit.getBoundingClientRect().left).toBeCloseTo(before, 0);
    expect(actions.getBoundingClientRect().left).toBeGreaterThanOrEqual(scroller.getBoundingClientRect().right - 1);
    const dataRow = scroller.querySelector('tbody tr')!.getBoundingClientRect();
    const actionRow = actions.querySelector('tbody tr')!.getBoundingClientRect();
    expect(dataRow.top).toBeCloseTo(actionRow.top, 0);
    expect(dataRow.height).toBeCloseTo(actionRow.height, 0);
    const lastAction = actions.querySelector('tbody .row-actions')!.lastElementChild!;
    expect(actionRow.right - lastAction.getBoundingClientRect().right).toBeCloseTo(20, 0);
    expect(getComputedStyle(actions.querySelector('th')!).textAlign).toBe('right');
    fixture.destroy();
  });
  it('keeps recovery in the top row and redirects old Results links to dashboard', async () => {
    query.next(convertToParamMap({ view: 'results' }));
    const fixture = await setup();
    expect(fixture.componentInstance.view).toBe('dashboard');
    expect(fixture.nativeElement.querySelector('.dashboard-results')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.overview-metric').length).toBe(0);
    expect(fixture.nativeElement.querySelector('.metrics .metric:nth-child(2)').textContent).toContain('Ventas netas');
    expect(fixture.nativeElement.querySelector('.metrics .metric:last-child').textContent).toContain('Falta por recuperar');
    expect(fixture.nativeElement.querySelector('.overview-recovery').getAttribute('data-status')).toBe('progress');
    expect(fixture.nativeElement.querySelector('.overview-recovery').textContent).toContain('50 % recuperado');
    expect(fixture.nativeElement.querySelector('.overview-recovery strong').textContent).toContain('-');
    expect(fixture.nativeElement.querySelector('.collection-recovery-progress').value).toBe(50);
    expect(fixture.nativeElement.querySelector('.collection-tabs').textContent).not.toContain('Resultados');
    expect(fixture.nativeElement.querySelector('.dashboard-grid')).not.toBeNull();
    fixture.destroy();
  });
  it('switches collection sections without reloading data or flashing the loading screen', async () => {
    const fixture = await setup();
    const first = fixture.nativeElement.querySelector('.collection-section');
    query.next(convertToParamMap({ view: 'processes' }));
    fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges();
    expect(service.workspace).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.loading).toBeFalse();
    expect(fixture.nativeElement.querySelector('.loading')).toBeNull();
    expect(fixture.nativeElement.querySelector('.collection-section')).not.toBe(first);
    expect(fixture.nativeElement.querySelector('[aria-label="Procesos de la colección"]')).not.toBeNull();
    fixture.destroy();
  });
});

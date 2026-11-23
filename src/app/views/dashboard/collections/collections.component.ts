import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { BaseService } from '../../base.service';
import { CollectionService } from './collection.service';
import { CollectionRecord, CollectionProcess, CollectionWorkspace, CollectionManufactureVariant } from './collection.model';
import { PurchaseIndexComponent } from '../purchases/purchase-index/purchase-index.component';
import { todayInLima } from '@shared/components/delivery-tracking/delivery-tracking.model';

@Component({
  selector: 'app-collections', standalone: true, imports: [FormsModule, RouterLink, CurrencyPipe, DatePipe, PurchaseIndexComponent],
  templateUrl: './collections.component.html', styleUrl: './collections.component.scss',
})
export class CollectionsComponent implements OnInit, OnDestroy {
  private readonly service = inject(CollectionService);
  private readonly base = inject(BaseService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();
  private version = 0;
  private optionVersion = 0;
  private destroyed = false;
  private routeInitialized = false;
  @ViewChild('editor') editor?: ElementRef<HTMLDialogElement>;
  collectionId: number | null = null;
  view = 'dashboard';
  readonly tabs = [{ id: 'dashboard', name: 'Dashboard' }, { id: 'processes', name: 'Procesos' },
    { id: 'products', name: 'Productos' }, { id: 'purchases', name: 'Compras' }, { id: 'sales', name: 'Ventas y cobros' }];
  readonly statuses: Record<string, string> = { planning: 'Planificación', planned: 'Programado', pending: 'Pendiente', in_progress: 'En curso', commercializing: 'Comercialización', completed: 'Terminado', closed: 'Cerrado', archived: 'Archivado', editing: 'Edición', cancelled: 'Cancelado' };
  readonly tabIcons: Record<string, string> = { dashboard: 'fa-chart-pie', collections: 'fa-layer-group', processes: 'fa-list-check', products: 'fa-box', purchases: 'fa-cart-shopping', sales: 'fa-receipt', results: 'fa-chart-line' };
  readonly dialogIcons: Record<string, string> = { collection: 'fa-layer-group', process: 'fa-list-check', sale: 'fa-receipt', receipt: 'fa-money-bill-transfer' };
  readonly kinds: Record<string, string> = { production: 'Producción', order: 'Orden de manufactura', photo_session: 'Sesión fotográfica', other: 'Otro proceso' };
  readonly processIcons: Record<string, string> = { production: 'fa-industry', order: 'fa-clipboard-list', photo_session: 'fa-camera', other: 'fa-gears' };
  readonly today = todayInLima();
  collections: CollectionRecord[] = [];
  workspace: CollectionWorkspace | null = null;
  page = 1; lastPage = 1; total = 0; search = ''; status = '';
  loading = true; saving = false; optionsLoading = false; error = ''; formError = ''; notice = '';
  formKind = ''; draft: any = {}; options: any[] = []; optionSearch = '';
  selectedSourceIds = new Set<number>();
  get addingExisting(): boolean { return this.formKind === 'process' && !this.draft.id && this.draft.mode === 'existing' && this.draft.kind !== 'other'; }
  get filteredProcessOptions(): any[] {
    const search = this.optionSearch.trim().toLocaleLowerCase();
    return this.options.filter(item => !search || `${item.id} ${item.name}`.toLocaleLowerCase().includes(search));
  }
  get allVisibleProcessesSelected(): boolean { return this.filteredProcessOptions.length > 0 && this.filteredProcessOptions.every(item => this.selectedSourceIds.has(item.id)); }
  toggleProcess(id: number): void { this.selectedSourceIds.has(id) ? this.selectedSourceIds.delete(id) : this.selectedSourceIds.add(id); }
  toggleVisibleProcesses(): void {
    const remove = this.allVisibleProcessesSelected;
    for (const item of this.filteredProcessOptions) remove ? this.selectedSourceIds.delete(item.id) : this.selectedSourceIds.add(item.id);
  }
  responsibles: { id: number; name: string }[] = [];
  purchaseProcess: CollectionProcess | null = null;
  productSearch = '';
  get filteredProducts(): any[] {
    const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
    const terms = normalize(this.productSearch).trim().split(/\s+/).filter(Boolean);
    return (this.workspace?.products ?? []).filter(product => {
      const text = normalize([product.name, ...(product.manufacture_variants ?? []).flatMap((line: CollectionManufactureVariant) => [line.name, line.sku ?? ''])].join(' '));
      return terms.every(term => text.includes(term));
    });
  }

  get path(): string[] { return ['/', this.base.store ?? '', 'dashboard', 'collections']; }
  get processes(): CollectionProcess[] { return this.workspace?.processes ?? []; }
  get manufacturing(): CollectionProcess[] { return this.processes.filter(p => p.source_type === 'manufacture'); }
  get selectedOrder(): any { return this.options.find(o => o.id === Number(this.draft.order_id)); }
  get orderLines(): any[] { return this.selectedOrder?.lines ?? []; }
  get upcoming(): { name: string; date: string; view: string; overdue: boolean }[] {
    return [
      ...this.processes.filter(p => p.due_on && !['completed', 'cancelled', 'archived'].includes(p.status))
        .map(p => ({ name: p.name, date: p.due_on!, view: 'processes', overdue: p.due_on! < this.today })),
      ...(this.workspace?.collection.launch_on ? [{ name: 'Lanzamiento · ' + this.workspace.collection.name,
        date: this.workspace.collection.launch_on, view: 'dashboard', overdue: this.workspace.collection.launch_on < this.today }] : []),
    ].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
  }
  get dialogTitle(): string {
    return ({ collection: this.draft.id ? 'Editar colección' : 'Nueva colección',
      process: this.draft.id ? 'Organizar proceso' : 'Añadir proceso', sale: 'Atribuir una venta', receipt: 'Registrar cobro o devolución' } as Record<string, string>)[this.formKind] ?? '';
  }
  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(takeUntil(this.destroy$)).subscribe(([params, query]) => {
      const collectionId = params.has('collection_id') ? Number(params.get('collection_id')) : null;
      const changedCollection = !this.routeInitialized || this.collectionId !== collectionId;
      this.routeInitialized = true;
      this.collectionId = collectionId;
      this.view = this.tabs.some(t => t.id === query.get('view')) ? query.get('view')! : 'dashboard';
      this.purchaseProcess = null;
      if (changedCollection) { this.productSearch = ''; void this.load(); }
    });
  }
  async load(): Promise<void> {
    const version = ++this.version;
    this.loading = true; this.error = '';
    try {
      if (this.collectionId) {
        const response = await firstValueFrom(this.service.workspace(this.collectionId).pipe(takeUntil(this.destroy$)));
        if (version === this.version) this.workspace = response.data;
      } else {
        const response = await firstValueFrom(this.service.list(this.page, this.search, this.status).pipe(takeUntil(this.destroy$)));
        if (version === this.version) { this.collections = response.data; this.lastPage = response.last_page; this.total = response.total; }
      }
    } catch (error) { if (!this.destroyed && version === this.version) this.error = this.message(error); }
    finally { if (version === this.version) this.loading = false; }
  }
  navigate(view: string, collection: number | null = this.collectionId): void {
    if (collection && collection !== this.collectionId) { void this.router.navigate([...this.path, String(collection)], { queryParams: { view } }); return; }
    void this.router.navigate([], { relativeTo: this.route, queryParams: { view } });
  }
  async open(kind: string, value?: any): Promise<void> {
    if (this.saving) return;
    this.formKind = kind; this.formError = ''; this.options = []; this.optionSearch = ''; ++this.optionVersion; this.optionsLoading = false;
    this.selectedSourceIds.clear();
    const collection = this.collectionId ?? this.workspace?.collection.id ?? null;
    this.draft = kind === 'collection' ? { status: 'planning', name: '', description: '', starts_on: '', ends_on: '', launch_on: '', ...value }
      : kind === 'process' ? { collection_id: collection, kind: 'production', mode: 'new', source_id: null, name: '', status: 'pending', starts_on: '', due_on: '', notes: '', responsible_id: null, ...value }
      : kind === 'sale' ? { process_id: this.manufacturing[0]?.id ?? null, order_id: null, line_key: '', quantity: 1 }
      : { sale_id: value.id, direction: 'in', amount: '', date: this.today, reference: '', notes: '', sale_amount: value.amount, collected: value.collected };
    if (kind === 'process' && value) this.draft.status = ['pending', 'in_progress', 'completed', 'cancelled'].includes(value.status) ? value.status : 'pending';
    this.editor?.nativeElement.showModal();
    if (kind === 'process') {
      try { this.responsibles = (await firstValueFrom(this.service.options('responsible').pipe(takeUntil(this.destroy$)))).data; }
      catch (error) { if (!this.destroyed) this.formError = this.message(error); }
    }
    if (kind === 'sale') await this.loadOptions();
  }
  close(event?: Event): void { if (this.saving) { event?.preventDefault(); return; } this.editor?.nativeElement.close(); }
  async loadOptions(): Promise<void> {
    const version = ++this.optionVersion;
    this.optionsLoading = true;
    const kind = this.formKind === 'sale' ? 'order_sale' : this.draft.kind;
    try {
      const response = await firstValueFrom(this.service.options(kind, this.formKind === 'sale' ? this.optionSearch : '').pipe(takeUntil(this.destroy$)));
      if (version === this.optionVersion) { this.options = response.data; this.formError = ''; }
    } catch (error) { if (!this.destroyed && version === this.optionVersion) this.formError = this.message(error); }
    finally { if (version === this.optionVersion) this.optionsLoading = false; }
  }
  processModeChanged(): void {
    if (this.draft.mode === 'existing' && ['production', 'order'].includes(this.draft.kind)) this.draft.kind = 'manufacture';
    if (this.draft.mode === 'new' && this.draft.kind === 'manufacture') this.draft.kind = 'production';
    this.processKindChanged();
  }
  processKindChanged(): void {
    ++this.optionVersion; this.optionsLoading = false;
    this.draft.source_id = null; this.options = []; this.optionSearch = ''; this.selectedSourceIds.clear();
    if (this.draft.kind === 'other') this.draft.mode = 'new'; else if (this.draft.mode === 'existing') void this.loadOptions();
  }
  async save(): Promise<void> {
    if (this.saving || this.optionsLoading) return;
    if (this.addingExisting && (!this.selectedSourceIds.size || this.selectedSourceIds.size > 200)) { this.formError = 'Selecciona entre 1 y 200 procesos.'; return; }
    this.saving = true; this.formError = '';
    const data = { ...this.draft };
    for (const key of ['starts_on', 'ends_on', 'due_on', 'launch_on']) if (data[key] === '') data[key] = null;
    try {
      if (this.formKind === 'collection' && !data.id) {
        const response = await firstValueFrom(this.service.createCollection(data).pipe(takeUntil(this.destroy$)));
        this.editor?.nativeElement.close();
        await this.router.navigate([...this.path, String(response.data.id)]); return;
      }
      const id = this.collectionId!;
      const request = this.formKind === 'collection' ? this.service.saveCollection(id, data)
        : this.addingExisting ? this.service.attachProcesses(id, {
          sources: this.options.filter(item => this.selectedSourceIds.has(item.id)).map(item => ({ source_id: item.id, kind: item.type || data.kind })),
          responsible_id: data.responsible_id, starts_on: data.starts_on, due_on: data.due_on, notes: data.notes,
        })
        : this.formKind === 'process' ? this.service.process(id, { ...data, source_id: data.mode === 'existing' ? data.source_id : null }, data.id)
        : this.formKind === 'sale' ? this.service.sale(id, data)
        : this.service.receipt(id, data.sale_id, data);
      await firstValueFrom(request.pipe(takeUntil(this.destroy$)));
      this.editor?.nativeElement.close(); this.notice = 'Cambios guardados.'; this.purchaseProcess = null; await this.load();
    } catch (error) { if (!this.destroyed) this.formError = this.message(error); }
    finally { this.saving = false; }
  }
  async detach(process: CollectionProcess): Promise<void> {
    if (this.saving || !confirm(`¿Desvincular «${process.name}»? Su registro original y sus compras se conservarán.`)) return;
    await this.mutate(this.service.detach(this.collectionId!, process.id));
  }
  async removeSale(sale: any): Promise<void> {
    if (this.saving || !confirm('¿Retirar esta atribución? La venta original se conservará.')) return;
    await this.mutate(this.service.removeSale(this.collectionId!, sale.id));
  }
  private async mutate(request: ReturnType<CollectionService['detach']>): Promise<void> {
    this.saving = true; this.error = '';
    try { await firstValueFrom(request.pipe(takeUntil(this.destroy$))); await this.load(); }
    catch (error) { if (!this.destroyed) this.error = this.message(error); }
    finally { this.saving = false; }
  }
  originLink(process: CollectionProcess): string[] {
    return ['/', this.base.store ?? '', 'dashboard', ...(process.source_type === 'photo_session' ? ['photo-sessions', String(process.source_id)] : ['manufactures', process.kind === 'production' ? 'productions' : 'orders', String(process.source_id)])];
  }
  productLink(id: number): string[] { return ['/', this.base.store ?? '', 'dashboard', 'products', String(id)]; }
  productSources(lines: CollectionManufactureVariant[] = []): CollectionManufactureVariant[] {
    return lines.filter((line, index) => lines.findIndex(source => source.source_id === line.source_id) === index);
  }
  manufactureVariantLink(line: CollectionManufactureVariant): string[] {
    return ['/', this.base.store ?? '', 'dashboard', 'manufactures', line.source_type === 'production' ? 'productions' : 'orders', String(line.source_id), ...(line.source_type === 'order' ? ['variants'] : ['purchases'])];
  }
  collectionLink(id: number): string[] { return [...this.path, String(id)]; }
  filterList(): void { this.page = 1; void this.load(); }
  changePage(delta: number): void { this.page += delta; void this.load(); }
  async refreshPurchases(): Promise<void> { const id = this.purchaseProcess?.id; await this.load(); this.purchaseProcess = this.processes.find(p => p.id === id) ?? null; }
  chartPoints(field: 'paid' | 'collected'): string {
    const rows = this.workspace?.timeline ?? [];
    const max = Math.max(1, ...rows.flatMap(row => [row.paid, row.collected]));
    return rows.map((row, index) => `${20 + index * 560 / Math.max(1, rows.length - 1)},${180 - row[field] * 150 / max}`).join(' ');
  }
  private message(error: any): string {
    return error?.error?.errors ? Object.values(error.error.errors).flat().join(' ') : error?.error?.message || 'No se pudo completar la solicitud. Intenta nuevamente.';
  }
  ngOnDestroy(): void { this.destroyed = true; this.destroy$.next(); this.destroy$.complete(); this.editor?.nativeElement.close(); }
}

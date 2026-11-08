import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { InventoryCount, InventoryRackItem, InventoryWorkspaceLocation, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryCountService } from '../inventory-count.service';
import { InventoryStatusComponent } from '../../inventory-status/inventory-status.component';
import { ImagePreviewComponent } from 'src/app/views/shared/components/image-preview/image-preview.component';

interface RackShelf {
  location: InventoryWorkspaceLocation;
  label: string;
  items: InventoryRackItem[];
  summary: { units: number; captures: number; variants: number };
  page: number;
  lastPage: number;
  loading: boolean;
  error: string;
}
interface CaptureHistory {
  records: InventoryCount[];
  page: number;
  lastPage: number;
  loading: boolean;
  error: string;
}

@Component({
  selector: 'app-inventory-rack',
  imports: [DatePipe, DecimalPipe, UpperCasePipe, RouterLink, InventoryStatusComponent, ImagePreviewComponent],
  templateUrl: './inventory-rack.component.html',
  styleUrl: './inventory-rack.component.scss',
})
export class InventoryRackComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) inventoryId!: number;
  @Input({ required: true }) sessionId!: number;
  @Input({ required: true }) warehouseId!: number;
  @Input({ required: true }) options!: InventoryWorkspaceOptions;
  @Input() activeLocationId: number | null = null;
  zones: InventoryWorkspaceLocation[] = [];
  shelves: RackShelf[] = [];
  selectedZoneId: number | null = null;
  readonly history = new Map<string, CaptureHistory>();
  private nodes: InventoryWorkspaceLocation[] = [];
  private readonly cancel$ = new Subject<void>();
  private readonly destroy$ = new Subject<void>();
  private readonly collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

  constructor(private counts: InventoryCountService) {}

  get selectedZone() { return this.zones.find(zone => zone.id === this.selectedZoneId); }
  get loading() { return this.shelves.some(shelf => shelf.loading && shelf.page === 0); }
  get hasErrors() { return this.shelves.some(shelf => !!shelf.error); }
  get totalUnits() { return this.shelves.reduce((sum, shelf) => sum + shelf.summary.units, 0); }
  get totalCaptures() { return this.shelves.reduce((sum, shelf) => sum + shelf.summary.captures, 0); }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.options || !this.warehouseId) return;
    const source = this.options.location_tree ?? this.options.locations.flatMap(location => location.parent ? [
      { ...location.parent, warehouse_id: location.warehouse_id, parent_id: location.parent.parent_id ?? null }, location,
    ] : [location]);
    this.nodes = [...new Map(source.filter(node => node.warehouse_id === this.warehouseId).map(node => [node.id, node])).values()];
    const ids = new Set(this.nodes.map(node => node.id));
    this.zones = this.nodes.filter(node => node.parent_id === null || !ids.has(node.parent_id))
      .sort((a, b) => this.collator.compare(a.name, b.name));
    const activeZone = this.activeLocationId ? this.path(this.activeLocationId)[0] : null;
    if (changes['activeLocationId'] && activeZone) this.selectedZoneId = activeZone.id;
    if (!this.zones.some(zone => zone.id === this.selectedZoneId)) {
      this.selectedZoneId = activeZone?.id ?? this.zones[0]?.id ?? null;
    }
    this.reload();
  }

  selectZone(value: string): void {
    const id = Number(value);
    if (!this.zones.some(zone => zone.id === id) || id === this.selectedZoneId) return;
    this.selectedZoneId = id;
    this.reload();
  }

  reload(): void {
    this.cancel$.next();
    this.history.clear();
    const leaves = new Set(this.options.locations.map(location => location.id));
    this.shelves = this.nodes.filter(node => leaves.has(node.id) && this.path(node.id)[0]?.id === this.selectedZoneId)
      .map(location => ({
        location,
        label: this.path(location.id).slice(1).map(node => node.name).join(' / ') || location.name,
        items: [], summary: { units: 0, captures: 0, variants: 0 }, page: 0, lastPage: 1, loading: false, error: '',
      }))
      .sort((a, b) => {
        const topA = a.location.name.toLocaleUpperCase() === 'SUPERIOR';
        const topB = b.location.name.toLocaleUpperCase() === 'SUPERIOR';
        return Number(topB) - Number(topA) || this.collator.compare(a.label, b.label);
      });
    for (const shelf of this.shelves) this.loadShelf(shelf);
  }

  loadShelf(shelf: RackShelf): void {
    if (shelf.loading || (shelf.page > 0 && shelf.page >= shelf.lastPage)) return;
    shelf.loading = true;
    shelf.error = '';
    const page = shelf.page + 1;
    this.counts.rack(this.inventoryId, this.sessionId, shelf.location.id, page)
      .pipe(takeUntil(this.cancel$), takeUntil(this.destroy$), finalize(() => shelf.loading = false))
      .subscribe({
        next: response => {
          shelf.items = [...shelf.items, ...response.data];
          shelf.summary = response.summary;
          shelf.page = response.current_page;
          shelf.lastPage = response.last_page;
        },
        error: () => shelf.error = 'No se pudo cargar este nivel del rack.',
      });
  }

  historyKey(locationId: number, variantId: number): string { return `${locationId}:${variantId}`; }

  openHistory(event: Event, locationId: number, variantId: number): void {
    if (!(event.target as HTMLDetailsElement).open) return;
    const key = this.historyKey(locationId, variantId);
    if (!this.history.has(key)) {
      this.history.set(key, { records: [], page: 0, lastPage: 1, loading: false, error: '' });
      this.loadHistory(locationId, variantId);
    }
  }

  loadHistory(locationId: number, variantId: number): void {
    const state = this.history.get(this.historyKey(locationId, variantId));
    if (!state || state.loading || (state.page > 0 && state.page >= state.lastPage)) return;
    state.loading = true;
    state.error = '';
    this.counts.list(this.inventoryId, this.sessionId, state.page + 1, variantId, locationId)
      .pipe(takeUntil(this.cancel$), takeUntil(this.destroy$), finalize(() => state.loading = false))
      .subscribe({
        next: response => {
          state.records = [...state.records, ...response.data];
          state.page = response.current_page ?? state.page + 1;
          state.lastPage = response.last_page ?? 1;
        },
        error: () => state.error = 'No se pudo cargar el historial.',
      });
  }

  private path(id: number): InventoryWorkspaceLocation[] {
    const path: InventoryWorkspaceLocation[] = [];
    const visited = new Set<number>();
    let node = this.nodes.find(node => node.id === id);
    while (node && !visited.has(node.id)) {
      visited.add(node.id);
      path.unshift(node);
      node = this.nodes.find(candidate => candidate.id === node!.parent_id);
    }
    return path;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cancel$.complete();
  }
}
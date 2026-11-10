import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { DatePipe, DecimalPipe, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { InventoryCount, InventoryWorkspaceLocation, InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryCountService } from '../inventory-count.service';
import { InventoryStatusComponent } from '../../inventory-status/inventory-status.component';
import { ImagePreviewComponent } from 'src/app/views/shared/components/image-preview/image-preview.component';

interface RackShelf {
  location: InventoryWorkspaceLocation;
  label: string;
  items: InventoryCount[];
  summary: { units: number; captures: number; variants: number };
  page: number;
  lastPage: number;
  totalRecords: number;
  loading: boolean;
  error: string;
  expanded: boolean;
  summaryKnown: boolean;
  cancel$: Subject<void>;
}

@Component({
  selector: 'app-inventory-rack',
  imports: [DatePipe, DecimalPipe, NgTemplateOutlet, UpperCasePipe, RouterLink, InventoryStatusComponent, ImagePreviewComponent],
  templateUrl: './inventory-rack.component.html',
  styleUrl: './inventory-rack.component.scss',
})
export class InventoryRackComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) inventoryId!: number;
  @Input({ required: true }) sessionId!: number;
  @Input({ required: true }) warehouseId!: number;
  @Input({ required: true }) options!: InventoryWorkspaceOptions;
  @Input() activeLocationId: number | null = null;
  @Input() captureTemplate: TemplateRef<unknown> | null = null;
  @Input() locationsPath: (string | number)[] | null = null;
  @Input() canCapture = false;
  @Output() captureLocation = new EventEmitter<number>();
  @Input() canDelete = false;
  @Input() deletingId: number | null = null;
  @Input() deleteBusy = false;
  @Output() deleteCapture = new EventEmitter<InventoryCount>();
  zones: InventoryWorkspaceLocation[] = [];
  shelves: RackShelf[] = [];
  selectedZoneId: number | null = null;
  summaryLoading = false;
  summaryError = '';
  private summaryReady = false;
  private nodes: InventoryWorkspaceLocation[] = [];
  private readonly cancel$ = new Subject<void>();
  private readonly destroy$ = new Subject<void>();
  private readonly collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

  constructor(private counts: InventoryCountService) {}

  get selectedZone() { return this.zones.find(zone => zone.id === this.selectedZoneId); }
  get directZone() {
    return this.shelves.length === 1 && this.shelves[0].location.id === this.selectedZoneId
      ? this.shelves[0].location : null;
  }
  get loading() { return this.summaryLoading || this.shelves.some(shelf => shelf.loading && shelf.page === 0); }
  get totalUnits() { return this.shelves.reduce((sum, shelf) => sum + shelf.summary.units, 0); }
  get totalCaptures() { return this.shelves.reduce((sum, shelf) => sum + shelf.summary.captures, 0); }
  get totalsComplete() { return this.summaryReady && !this.summaryError; }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.options || !this.warehouseId) return;
    const dataChanged = ['options', 'inventoryId', 'sessionId', 'warehouseId'].some(key => !!changes[key]);
    if (!dataChanged && !changes['activeLocationId']) return;
    const previousLocationId = changes['activeLocationId']?.previousValue;
    if (previousLocationId != null && previousLocationId !== this.activeLocationId) {
      const previousShelf = this.shelves.find(shelf => shelf.location.id === previousLocationId);
      if (previousShelf) previousShelf.expanded = false;
    }
    const previousZoneId = this.selectedZoneId;
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
    if (dataChanged || previousZoneId !== this.selectedZoneId) {
      this.reload();
    } else if (changes['activeLocationId']) {
      const shelf = this.shelves.find(shelf => shelf.location.id === this.activeLocationId);
      if (shelf) {
        shelf.expanded = true;
        if (shelf.page === 0) this.loadShelf(shelf);
      }
    }
  }

  selectZone(value: string): void {
    const id = Number(value);
    if (this.activeLocationId !== null || !this.zones.some(zone => zone.id === id) || id === this.selectedZoneId) return;
    this.selectedZoneId = id;
    this.reload();
  }

  reload(): void {
    this.cancel$.next();
    for (const shelf of this.shelves) shelf.cancel$.complete();
    this.summaryReady = false;
    const expandedIds = new Set(this.shelves.filter(shelf => shelf.expanded).map(shelf => shelf.location.id));
    if (this.activeLocationId !== null) expandedIds.add(this.activeLocationId);
    const leaves = new Set(this.options.locations.map(location => location.id));
    this.shelves = this.nodes.filter(node => leaves.has(node.id) && this.path(node.id)[0]?.id === this.selectedZoneId)
      .map(location => ({
        location,
        label: this.path(location.id).slice(1).map(node => node.name).join(' / ') || location.name,
        items: [], summary: { units: 0, captures: 0, variants: 0 }, page: 0, lastPage: 1, totalRecords: 0, loading: false, error: '',
        expanded: expandedIds.has(location.id),
        summaryKnown: false,
        cancel$: new Subject<void>(),
      }))
      .sort((a, b) => {
        const topA = a.location.name.toLocaleUpperCase() === 'SUPERIOR';
        const topB = b.location.name.toLocaleUpperCase() === 'SUPERIOR';
        return Number(topB) - Number(topA) || this.collator.compare(a.label, b.label);
      });
    this.loadSummaries();
    for (const shelf of this.shelves) {
      if (shelf.expanded) this.loadShelf(shelf);
    }
  }

  loadSummaries(): void {
    if (this.summaryLoading) return;
    this.summaryLoading = true;
    this.summaryError = '';
    this.counts.rackSummary(this.inventoryId, this.sessionId)
      .pipe(takeUntil(this.cancel$), takeUntil(this.destroy$), finalize(() => this.summaryLoading = false))
      .subscribe({
        next: response => {
          const summaries = new Map(response.data.map(summary => [summary.location_id, summary]));
          for (const shelf of this.shelves) {
            if (shelf.page > 0) continue;
            const summary = summaries.get(shelf.location.id);
            shelf.summary = summary ?? { units: 0, captures: 0, variants: 0 };
            shelf.summaryKnown = true;
          }
          this.summaryReady = true;
        },
        error: () => this.summaryError = 'No se pudieron cargar los totales de los niveles.',
      });
  }

  toggleShelf(shelf: RackShelf): void {
    shelf.expanded = !shelf.expanded;
    if (shelf.expanded && shelf.page === 0) this.loadShelf(shelf);
  }

  refreshLocation(locationId: number, removedCaptureId?: number): void {
    const shelf = this.shelves.find(shelf => shelf.location.id === locationId);
    if (!shelf) return;
    shelf.cancel$.next();
    if (removedCaptureId !== undefined) shelf.items = shelf.items.filter(item => item.id !== removedCaptureId);
    shelf.page = 0;
    shelf.lastPage = 1;
    shelf.expanded = true;
    this.loadShelf(shelf);
  }

  loadShelf(shelf: RackShelf): void {
    if (!shelf.expanded || shelf.loading || (shelf.page > 0 && shelf.page >= shelf.lastPage)) return;
    shelf.loading = true;
    shelf.error = '';
    const page = shelf.page + 1;
    this.counts.rack(this.inventoryId, this.sessionId, shelf.location.id, page)
      .pipe(takeUntil(shelf.cancel$), takeUntil(this.cancel$), takeUntil(this.destroy$), finalize(() => shelf.loading = false))
      .subscribe({
        next: response => {
          shelf.items = page === 1 ? response.data : [...shelf.items, ...response.data];
          shelf.summary = response.summary;
          shelf.summaryKnown = true;
          shelf.page = response.current_page;
          shelf.lastPage = response.last_page;
          shelf.totalRecords = response.total;
        },
        error: () => shelf.error = 'No se pudieron cargar las capturas de esta ubicación.',
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
    for (const shelf of this.shelves) shelf.cancel$.complete();
  }
}

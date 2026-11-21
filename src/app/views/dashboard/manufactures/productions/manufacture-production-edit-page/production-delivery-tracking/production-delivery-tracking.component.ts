import { DeliveryTrackingComponent } from '@shared/components/delivery-tracking/delivery-tracking.component';
import { Component, Input, OnChanges, OnDestroy, OnInit, Output, EventEmitter, SimpleChanges, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, finalize, forkJoin, takeUntil } from 'rxjs';
import { ManufacturePurchaseService } from '../../../manufacture.purchase.service';
import { ProductionStage, ProductionStageService } from '../../production-stages/production-stage.service';
import { DeliveryTracking } from '@shared/components/delivery-tracking/delivery-tracking.model';
import { BaseService } from 'src/app/views/base.service';

export interface TrackedProductionPurchase {
  id: number;
  production_stage_id: number | null;
  items?: { name: string }[];
  supplier?: { name?: string; user?: { name: string } } | null;
  delivery_tracking?: DeliveryTracking | null;
}
interface DeliveryDateRow { key: string; event: string; date: string | null; status: string; tone: string; current: boolean; reason?: string | null; }

type TrackingFilter = 'all' | 'pending' | 'overdue' | 'received';

@Component({
  selector: 'app-production-delivery-tracking',
  imports: [RouterModule, DatePipe, DeliveryTrackingComponent],
  providers: [ManufacturePurchaseService],
  templateUrl: './production-delivery-tracking.component.html',
  styleUrl: './production-delivery-tracking.component.scss',
})
export class ProductionDeliveryTrackingComponent implements OnInit, OnDestroy, OnChanges {
  private readonly purchasesService = inject(ManufacturePurchaseService);
  private readonly stagesService = inject(ProductionStageService);
  private readonly route = inject(ActivatedRoute);
  private readonly base = inject(BaseService);
  private readonly destroy$ = new Subject<void>();
  readonly filters: { value: TrackingFilter; label: string }[] = [
    { value: 'all', label: 'Todas' }, { value: 'pending', label: 'Pendientes' },
    { value: 'overdue', label: 'Vencidas' }, { value: 'received', label: 'Recibidas' },
  ];
  @Input() embedded = false;
  @Input() manufactureId = 0;
  @Input() stageId = 0;
  @Input() stageSlug = '';
  @Output() purchasesChanged = new EventEmitter<TrackedProductionPurchase[]>();
  @Output() openPurchases = new EventEmitter<void>();
  @Input() purchases: TrackedProductionPurchase[] = [];
  @Input() stages: ProductionStage[] = [];
  filter: TrackingFilter = 'pending';
  search = '';
  loading = false;
  error = '';
  get productionId(): number { return this.manufactureId || Number(this.route.snapshot.paramMap.get('production_id') ?? this.route.parent?.snapshot.paramMap.get('production_id')); }

  ngOnInit(): void { if (!this.embedded) this.reload(); }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stageId']) { this.filter = 'pending'; this.search = ''; }
  }
  get returnQuery(): Record<string, string | number> {
    return this.embedded
      ? { production: this.productionId, returnTo: 'section-tracking', stage: this.stageSlug }
      : { production: this.productionId, returnTo: 'deliveries' };
  }
  get trackedPurchases(): TrackedProductionPurchase[] {
    return this.purchases.filter(purchase => !!purchase.delivery_tracking?.expected_on
      && (!this.embedded || purchase.production_stage_id === this.stageId));
  }
  private matches(purchase: TrackedProductionPurchase, filter: TrackingFilter): boolean {
    const tracking = purchase.delivery_tracking!;
    return filter === 'all' || (filter === 'pending' ? !tracking.received_on : tracking.status === filter);
  }
  count(filter: TrackingFilter): number { return this.trackedPurchases.filter(purchase => this.matches(purchase, filter)).length; }
  get visiblePurchases(): TrackedProductionPurchase[] {
    const term = this.search.trim().toLocaleLowerCase();
    return this.trackedPurchases.filter(purchase => this.matches(purchase, this.filter)
      && (!term || `${purchase.id} ${this.purchaseLabel(purchase)} ${this.concepts(purchase)} ${this.stageName(purchase)}`.toLocaleLowerCase().includes(term)))
      .sort((a, b) => {
        const priority = { overdue: 0, pending: 1, received: 2 };
        const left = a.delivery_tracking!, right = b.delivery_tracking!;
        return priority[left.status] - priority[right.status] || left.expected_on.localeCompare(right.expected_on) || a.id - b.id;
      });
  }
  purchaseLabel(purchase: TrackedProductionPurchase): string { return purchase.supplier?.user?.name || purchase.supplier?.name || `Compra #${purchase.id}`; }
  concepts(purchase: TrackedProductionPurchase): string { return (purchase.items ?? []).map(item => item.name).join(' · ') || 'Sin conceptos'; }
  stageName(purchase: TrackedProductionPurchase): string { return this.stages.find(stage => stage.id === purchase.production_stage_id)?.name ?? 'Sin etapa'; }
  purchaseLink(id: number): (string | number)[] { return ['/', this.base.store ?? '', 'dashboard', 'purchases', id]; }

  dateRows(tracking: DeliveryTracking): DeliveryDateRow[] {
    const status = tracking.received_on ? 'Recibido' : tracking.status === 'overdue' ? 'Vencido' : 'Pendiente';
    const tone = tracking.received_on ? 'received' : tracking.status === 'overdue' ? 'overdue' : 'pending';
    const events = [...(tracking.schedule_history ?? [])]
      .filter(event => !!event.changes['expected_on']?.after)
      .sort((a, b) => b.id - a.id);
    const rows: DeliveryDateRow[] = [{ key: 'current', event: tracking.reschedules_count > 0 ? 'Reprogramado' : 'Compromiso vigente', date: tracking.expected_on, status, tone, current: true, reason: events[0]?.reason }];
    for (const event of events.slice(1)) {
      rows.push({ key: 'event-' + event.id, event: event.type === 'rescheduled' ? 'Reprogramado' : 'Compromiso inicial', date: event.changes['expected_on'].after, status: 'Reemplazado', tone: 'previous', current: false, reason: event.reason });
    }
    if (tracking.received_on) rows.unshift({ key: 'received', event: 'Recepción real', date: tracking.received_on, status: 'Recibido', tone: 'received', current: false });
    if (tracking.handed_over_on) rows.push({ key: 'handed', event: 'Encargo / materiales entregados', date: tracking.handed_over_on, status: 'Registrado', tone: 'previous', current: false });
    return rows;
  }

  trackingUpdated(purchaseId: number, tracking: DeliveryTracking): void {
    this.purchases = this.purchases.map(purchase => purchase.id === purchaseId ? { ...purchase, delivery_tracking: tracking } : purchase);
    this.purchasesChanged.emit(this.purchases);
    if (!this.embedded) this.stagesService.changes.next(this.productionId);
  }

  reload(): void {
    if (this.embedded || this.loading) return;
    this.loading = true;
    this.error = '';
    this.purchasesService.setManufactureId(this.productionId);
    forkJoin({ purchases: this.purchasesService.listPurchases<TrackedProductionPurchase>(), stages: this.stagesService.list(this.productionId) })
      .pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
        next: ({ purchases, stages }) => { this.purchases = purchases.data ?? []; this.stages = stages.data; },
        error: () => this.error = 'No se pudo cargar el seguimiento de compras. Intenta nuevamente.',
      });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

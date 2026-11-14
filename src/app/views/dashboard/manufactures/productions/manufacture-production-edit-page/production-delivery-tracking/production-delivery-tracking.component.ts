import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
type TrackingFilter = 'all' | 'pending' | 'overdue' | 'received';

@Component({
  selector: 'app-production-delivery-tracking',
  imports: [RouterModule, DatePipe],
  providers: [ManufacturePurchaseService],
  templateUrl: './production-delivery-tracking.component.html',
  styleUrl: './production-delivery-tracking.component.scss',
})
export class ProductionDeliveryTrackingComponent implements OnInit, OnDestroy {
  private readonly purchasesService = inject(ManufacturePurchaseService);
  private readonly stagesService = inject(ProductionStageService);
  private readonly route = inject(ActivatedRoute);
  private readonly base = inject(BaseService);
  private readonly destroy$ = new Subject<void>();
  readonly filters: { value: TrackingFilter; label: string }[] = [
    { value: 'all', label: 'Todas' }, { value: 'pending', label: 'Pendientes' },
    { value: 'overdue', label: 'Vencidas' }, { value: 'received', label: 'Recibidas' },
  ];
  purchases: TrackedProductionPurchase[] = [];
  stages: ProductionStage[] = [];
  filter: TrackingFilter = 'all';
  search = '';
  loading = false;
  error = '';
  get productionId(): number { return Number(this.route.snapshot.paramMap.get('production_id') ?? this.route.parent?.snapshot.paramMap.get('production_id')); }

  ngOnInit(): void { this.reload(); }
  get trackedPurchases(): TrackedProductionPurchase[] {
    return this.purchases.filter(purchase => !!purchase.delivery_tracking);
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

  reload(): void {
    if (this.loading) return;
    this.loading = true;
    this.error = '';
    this.purchasesService.setManufactureId(this.productionId);
    forkJoin({ purchases: this.purchasesService.listPurchases<TrackedProductionPurchase>(), stages: this.stagesService.list(this.productionId) })
      .pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
        next: ({ purchases, stages }) => { this.purchases = purchases.data ?? []; this.stages = stages.data; },
        error: () => this.error = 'No se pudo cargar el seguimiento de entregas. Intenta nuevamente.',
      });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

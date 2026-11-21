import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, startWith, Subject, switchMap, combineLatest } from 'rxjs';
import { DateShopifyPipe } from '../../shared/pipes/date-shopify.pipe';
import { OrderStatusStepperComponent } from '../shopify/orders/shared/order-status-stepper/order-status-stepper.component';
import { ImportedOrderTimelineComponent } from '../initial-import/orders/imported-order-timeline.component';
import { OrderProductListComponent } from './order-product-list.component';
import { OrderPreparationBadgeComponent } from './order-preparation-badge.component';
import { WorkspaceOrderDetail } from './order-workspace.model';
import { OrderWorkspaceService } from './order-workspace.service';

@Component({
  selector: 'app-order-workspace-detail',
  imports: [RouterLink, DateShopifyPipe, OrderStatusStepperComponent, OrderProductListComponent, OrderPreparationBadgeComponent, ImportedOrderTimelineComponent],
  templateUrl: './order-workspace-detail.component.html',
  styleUrls: ['./order-workspace.scss', './order-workspace-detail.component.scss'],
})
export class OrderWorkspaceDetailComponent implements OnInit {
  private readonly service = inject(OrderWorkspaceService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refresh$ = new Subject<void>();
  data: WorkspaceOrderDetail | null = null;
  loading = false;
  error = '';

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.refresh$.pipe(startWith(undefined))]).pipe(
      switchMap(([params]) => {
        this.data = null;
        this.loading = true;
        this.error = '';
        return this.service.detail(Number(params.get('id'))).pipe(
          catchError(() => { this.error = 'No se pudo abrir este pedido. Vuelve a intentarlo.'; return EMPTY; }),
          finalize(() => this.loading = false),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(detail => this.data = detail);
  }

  retry(): void { this.refresh$.next(); }
}

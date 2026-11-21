import { Component, OnDestroy, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { ImportedAddress, ImportedOrderDetail, importedOrderView } from './imported-order.model';
import { ImportedOrdersService } from './imported-orders.service';
import { ImportedOrderTimelineComponent } from './imported-order-timeline.component';
import { ImportedOrderItemImageComponent } from './imported-order-item-image.component';
import { OrderStatusStepperComponent } from '../../shopify/orders/shared/order-status-stepper/order-status-stepper.component';
import { orderProgress, orderProgressDates, OrderProgressDates, OrderProgressStatus } from '../../shopify/orders/shared/order-status-stepper/order-status.model';

@Component({ selector: 'app-imported-order-detail', imports: [JsonPipe, RouterLink, ImportedOrderTimelineComponent, ImportedOrderItemImageComponent, OrderStatusStepperComponent], templateUrl: './imported-order-detail.component.html', styleUrl: './imported-orders.scss' })
export class ImportedOrderDetailComponent implements OnInit, OnDestroy {
  data: ImportedOrderDetail | null = null;
  loading = false;
  error = '';
  readonly view = importedOrderView;
  readonly relatedSections = [
    { key: 'shipping_lines', label: 'Gastos de envío' }, { key: 'discounts', label: 'Descuentos' }, { key: 'addresses', label: 'Direcciones originales' },
    { key: 'metafields', label: 'Metadatos' }, { key: 'fulfillment_items', label: 'Artículos enviados' }, { key: 'fulfillment_events', label: 'Eventos de entrega' },
    { key: 'refund_items', label: 'Artículos reembolsados' }, { key: 'refund_shipping_lines', label: 'Envíos reembolsados' }, { key: 'refund_adjustments', label: 'Ajustes de reembolso' },
  ];
  private readonly destroy$ = new Subject<void>();
  get progress(): OrderProgressStatus {
    if (!this.data) return 'desconocido';
    return orderProgress({ displayFinancialStatus: this.data.order.financial_status ?? undefined,
      displayFulfillmentStatus: this.data.order.fulfillment_status ?? undefined, fulfillments: this.data.related.fulfillments });
  }
  get progressDates(): OrderProgressDates {
    if (!this.data) return {};
    return orderProgressDates({ createdAt: this.data.order.created_at, displayFinancialStatus: this.data.order.financial_status,
      transactions: this.data.related.transactions, fulfillments: this.data.related.fulfillments, events: this.data.step_events });
  }
  constructor(private service: ImportedOrdersService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.paramMap.pipe(switchMap(params => {
      this.loading = true; this.error = ''; this.data = null;
      return this.service.detail(Number(params.get('id'))).pipe(catchError(() => { this.error = 'No se pudo abrir el pedido. Comprueba que pertenece a esta tienda o vuelve a intentarlo.'; return EMPTY; }), finalize(() => this.loading = false));
    }), takeUntil(this.destroy$)).subscribe(response => this.data = response.data);
  }
  address(value: ImportedAddress): string { return [value.company, value.address1, value.address2, [value.city, value.province].filter(Boolean).join(', '), [value.country, value.zip].filter(Boolean).join(' · ')].filter(Boolean).join('\n'); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

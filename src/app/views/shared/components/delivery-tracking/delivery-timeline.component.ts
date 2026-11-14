import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DeliveryEvent } from './delivery-tracking.model';

@Component({
  selector: 'app-delivery-timeline',
  imports: [DatePipe],
  templateUrl: './delivery-timeline.component.html',
  styleUrl: './delivery-timeline.component.scss',
})
export class DeliveryTimelineComponent {
  @Input() events: DeliveryEvent[] = [];
  readonly labels: Record<string, string> = {
    handed_over_on: 'Se mandó a hacer / materiales entregados',
    expected_on: 'Fecha tentativa de entrega', received_on: 'Fecha real de recepción',
  };
  readonly titles: Record<DeliveryEvent['type'], string> = {
    created: 'Seguimiento iniciado', rescheduled: 'Entrega reprogramada', received: 'Entrega recibida', corrected: 'Fechas actualizadas',
  };
  readonly dateFields = ['received_on', 'expected_on', 'handed_over_on'];
}

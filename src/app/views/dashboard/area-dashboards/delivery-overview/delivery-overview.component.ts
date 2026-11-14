import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DeliveryOverview } from './delivery-overview.model';
import { DELIVERY_LABELS } from '@shared/components/delivery-tracking/delivery-tracking.model';

@Component({
  selector: 'app-delivery-overview',
  imports: [DatePipe, RouterLink],
  templateUrl: './delivery-overview.component.html',
  styleUrl: './delivery-overview.component.scss',
})
export class DeliveryOverviewComponent {
  @Input({ required: true }) summary!: DeliveryOverview;
  @Input({ required: true }) store = '';
  readonly labels = DELIVERY_LABELS;

  link(path: string): string[] { return ['/', this.store, 'dashboard', ...path.split('/')]; }
}

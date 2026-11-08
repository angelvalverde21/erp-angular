import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Courier, DELIVERY_LABELS } from '../courier.model';

@Component({
  selector: 'app-courier-index',
  imports: [RouterLink],
  templateUrl: './courier-index.component.html',
  styleUrl: './courier-index.component.scss'
})
export class CourierIndexComponent {
  @Input() couriers: Courier[] = [];
  readonly deliveryLabels = DELIVERY_LABELS;
}
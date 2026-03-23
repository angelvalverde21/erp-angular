import { Component, Input } from '@angular/core';
import { DateShopifyPipe } from '../../../../shared/pipes/date-shopify.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-courier-index',
  imports: [
    DateShopifyPipe,
    JsonPipe,
  ],
  templateUrl: './courier-index.component.html',
  styleUrl: './courier-index.component.scss'
})

export class CourierIndexComponent {

  @Input() couriers: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  getCourierId(id: number = 0) {
    this.router.navigate([id], { relativeTo: this.route });
  }
}
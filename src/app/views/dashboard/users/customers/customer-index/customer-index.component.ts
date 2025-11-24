import { Component, Input } from '@angular/core';
import { DateShopifyPipe } from '../../../../shared/pipes/date-shopify.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-customer-index',
  imports: [
    DateShopifyPipe,
    JsonPipe,

  ],
  templateUrl: './customer-index.component.html',
  styleUrl: './customer-index.component.scss'
})
export class CustomerIndexComponent {

  @Input() customers: any[] = [];


  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  getCustomerId(id: number = 0) {
    this.router.navigate([id], { relativeTo: this.route });
  }
}



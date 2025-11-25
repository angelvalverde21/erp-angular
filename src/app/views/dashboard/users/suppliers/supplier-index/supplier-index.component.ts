import { Component, Input } from '@angular/core';
import { DateShopifyPipe } from '../../../../shared/pipes/date-shopify.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-supplier-index',
  imports: [
    DateShopifyPipe,
    JsonPipe,
  ],
  templateUrl: './supplier-index.component.html',
  styleUrl: './supplier-index.component.scss'
})
export class SupplierIndexComponent {

  @Input() suppliers: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  getSupplierId(id: number = 0) {
    this.router.navigate([id], { relativeTo: this.route });
  }
}

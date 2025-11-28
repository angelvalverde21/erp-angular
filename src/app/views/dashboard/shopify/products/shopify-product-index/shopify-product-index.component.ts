import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateShopifyPipe } from '../../../../shared/pipes/date-shopify.pipe';
import { InputGroupComponent } from '../../../../shared/components/form/input-group/input-group.component'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-shopify-product-index',
  imports: [
    DateShopifyPipe,
    InputGroupComponent,
    NgbAccordionModule,
    JsonPipe
  ],
  templateUrl: './shopify-product-index.component.html',
  styleUrl: './shopify-product-index.component.scss'
})
export class ShopifyProductIndexComponent {

  @Input() products: any[] = []; 

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  getProductId(id: number = 0) {
    this.router.navigate([id], { relativeTo: this.route });
  }
}

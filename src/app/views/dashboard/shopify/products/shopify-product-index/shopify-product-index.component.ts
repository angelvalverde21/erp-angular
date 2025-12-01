import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateShopifyPipe } from '../../../../shared/pipes/date-shopify.pipe';
import { InputGroupComponent } from '../../../../shared/components/form/input-group/input-group.component'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { ProductPriceMainEditComponent } from '../shared/product-price-main-edit/product-price-main-edit.component';
@Component({
  selector: 'app-shopify-product-index',
  imports: [
    DateShopifyPipe,
    InputGroupComponent,
    NgbAccordionModule,
    JsonPipe,
    ProductPriceMainEditComponent
  ],
  templateUrl: './shopify-product-index.component.html',
  styleUrl: './shopify-product-index.component.scss'
})
export class ShopifyProductIndexComponent {

  @Input() products: any[] = [];

  current_accordion: string = "";

  current_product_id: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  getProductId(id: number = 0) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  expandedId: any = null;

  onAccordionShown(value: any) {
    this.expandedId = value; // ID del panel abierto
    console.log('onAccordionShown');
    // console.log(this.expandedId);
    this.current_accordion = value;
    console.log(this.current_accordion);

  }

  onAccordionHidden(item: any) {
    // Si quieres permitir abrir solo 1 a la vez:
    this.expandedId = null;
    console.log('onAccordionHidden');
    this.current_accordion = "";
  }

  productSelectedId(product_id: number = 0){
    this.current_product_id = product_id;
  }
}

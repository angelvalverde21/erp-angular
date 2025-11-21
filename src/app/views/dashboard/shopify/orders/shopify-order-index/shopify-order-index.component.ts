import { CommonModule, JsonPipe, UpperCasePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTruck, faPrint, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faShopify } from '@fortawesome/free-brands-svg-icons';

import { IconOrigenComponent } from './icon-origen/icon-origen.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { DateShopifyPipe } from '../../../../shared/pipes/date-shopify.pipe'
import { Fancybox } from '@fancyapps/ui';
import { ButtonPdfComponent } from '../../../../shared/components/buttons/button-pdf/button-pdf.component';

@Component({
  selector: 'app-shopify-order-index',
  imports: [
    UpperCasePipe,
    JsonPipe,
    FontAwesomeModule,
    IconOrigenComponent,
    CommonModule,
    NgbAccordionModule,
    DateShopifyPipe,
    ButtonPdfComponent
  ],
  templateUrl: './shopify-order-index.component.html',
  styleUrl: './shopify-order-index.component.scss'
})
export class ShopifyOrderIndexComponent implements OnInit {

  @Input() orders: any[] = [];
  faTruck = faTruck;
  faPrint = faPrint;
  faShopify = faShopify;
  faEdit = faEdit;

  ordersPending: any[] = [];


  constructor(private elRef: ElementRef) {

  }
  

  getResizedImage(url: string, width: number, height: number): string {
    if (!url) return '';
    return url.replace(/(\.[a-zA-Z]+)(\?v=\d+)?$/, `_${width}x${height}$1$2`);
  }
  ngOnInit(): void {
    Fancybox.bind(this.elRef.nativeElement, '[data-fancybox]', {
      // Custom options
    })
    // this.ordersPending = this.orders.filter((order) => order.displayFinancialStatus === 'PENDING');
    // this.ordersPending = this.orders.filter((order) => order.displayFulfillmentStatus === 'UNFULFILLED');
  }

  ngOnDestroy(): void {
    Fancybox.unbind(this.elRef.nativeElement);
    Fancybox.close();

  }

  removeHash(name: string): number {
    const clean = name?.startsWith('#') ? name.substring(1) : name;
    return Number(clean);
  }

  getURlShopify(gid: string): string{
    const id = gid.split('/').pop() ?? '';
    return `https://admin.shopify.com/store/sorelleperu/orders/${id}`;
  }


}

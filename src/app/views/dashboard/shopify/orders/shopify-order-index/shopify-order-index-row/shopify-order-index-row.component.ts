import {
  CommonModule,
  CurrencyPipe,
  JsonPipe,
} from '@angular/common';
import {
  faTruck,
  faPrint,
  faEdit,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';
import { IconOrigenComponent } from './icon-origen/icon-origen.component';
import {
  Component,
  Input,
} from '@angular/core';

import { ShippingLinesComponent } from './shipping-lines/shipping-lines.component';
import { ShopifyNotesComponent } from './shopify-notes/shopify-notes.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { StatusPayComponent } from './status-pay/status-pay.component';
import { ShopifyTagsComponent } from './shopify-tags/shopify-tags.component';
import { ShopifyShippingStatusComponent } from './shopify-shipping-status/shopify-shipping-status.component';


@Component({
  selector: 'tr[app-shopify-order-index-row]',
  imports: [
    CurrencyPipe,
    FontAwesomeModule,
    DateShopifyPipe,
    CommonModule,
    IconOrigenComponent,
    JsonPipe,
    ShippingLinesComponent,
    ShopifyNotesComponent,
    OrderDetailsComponent,
    StatusPayComponent,
    ShopifyTagsComponent,
    ShopifyShippingStatusComponent
  ],
  templateUrl: './shopify-order-index-row.component.html',
  styleUrl: './shopify-order-index-row.component.scss'
})
export class ShopifyOrderIndexRowComponent {
  @Input() order: any;

  faCommentDots = faCommentDots;
  faTruck = faTruck;
  faPrint = faPrint;
}

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { faEdit, faEllipsis, faPrint } from '@fortawesome/free-solid-svg-icons';
import { ShopifyAddressComponent } from './shopify-address/shopify-address.component';
import { ImageShopifyComponent } from 'src/app/views/shared/components/image-shopify/image-shopify.component';
import { PenPipe } from 'src/app/views/shared/pipes/pen.pipe';
import { ShippingLinesComponent } from '../shipping-lines/shipping-lines.component';
import { ButtonPdfComponent } from 'src/app/views/shared/components/buttons/button-pdf/button-pdf.component';
import { IconOrigenComponent } from '../icon-origen/icon-origen.component';
import { StatusPayComponent } from '../status-pay/status-pay.component';
import { ShopifyTagsComponent } from '../shopify-tags/shopify-tags.component';
import { MenuButtonComponent } from './menu-button/menu-button.component';

@Component({
  selector: 'app-order-details',
  imports: [
    FontAwesomeModule,
    NgbTooltipModule,
    ShopifyAddressComponent,
    ImageShopifyComponent,
    PenPipe,
    ShippingLinesComponent,
    ButtonPdfComponent,
    IconOrigenComponent,
    StatusPayComponent,
    ShopifyTagsComponent,
    MenuButtonComponent
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailsComponent {
  @Input() order: any;

  faEllipsis = faEllipsis;
  faEdit = faEdit;

  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }
  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, {
      centered: true,
      size: 'xl',
    });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  closeModal() {
    this.modal.close();
  }


}

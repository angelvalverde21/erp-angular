import { Component, Input } from '@angular/core';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { ButtonEditComponent } from "@shared/components/buttons/button-edit/button-edit.component";
import { ButtonTrashComponent } from '@shared/components/buttons/button-trash/button-trash.component';
import { DateShopifyPipe } from '../../../shared/pipes/date-shopify.pipe';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'tr[app-gateway-index-row]',
  imports: [
    ButtonComponent,
    ButtonEditComponent,
    ButtonTrashComponent,
    DateShopifyPipe,
    RouterModule
  ],
  templateUrl: './gateway-index-row.component.html',
  styleUrl: './gateway-index-row.component.scss'
})
export class GatewayIndexRowComponent {

  constructor(
    public route: ActivatedRoute
  ) {

  }

  @Input() gateway: any;

  // getPageEdit(gateway_id: number) {
  //   this.router.navigate([gateway_id, 'edit'], {
  //     relativeTo: this.route
  //   });
  // }
}

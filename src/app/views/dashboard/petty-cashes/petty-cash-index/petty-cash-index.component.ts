import { Component, Input } from '@angular/core';
import { DateShopifyPipe } from '../../../shared/pipes/date-shopify.pipe';
import { ButtonEditComponent } from '../../../shared/components/buttons/button-edit/button-edit.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-petty-cash-index',
  imports: [
    DateShopifyPipe,
    ButtonEditComponent,
    RouterModule
  ],
  templateUrl: './petty-cash-index.component.html',
  styleUrl: './petty-cash-index.component.scss'
})
export class PettyCashIndexComponent {

  constructor(
    public route: ActivatedRoute
  ) {

  }
  
  @Input() petty_cashes: any;

}

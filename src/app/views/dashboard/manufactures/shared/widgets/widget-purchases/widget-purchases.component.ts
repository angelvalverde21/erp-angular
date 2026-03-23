import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-widget-purchases',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './widget-purchases.component.html',
  styleUrl: './widget-purchases.component.scss'
})
export class WidgetPurchasesComponent {


  faBagShopping = faBagShopping;
  @Input() total_purchases_amount: number = 0;

}

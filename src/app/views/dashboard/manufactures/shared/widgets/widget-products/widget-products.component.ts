import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-widget-products',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './widget-products.component.html',
  styleUrl: './widget-products.component.scss'
})
export class WidgetProductsComponent {


  faBarcode = faBarcode;
  @Input() total_products: number = 0;

}

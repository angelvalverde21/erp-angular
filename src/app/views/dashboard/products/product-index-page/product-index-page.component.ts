import { Component } from '@angular/core';
import { ProductIndexComponent } from '../product-index/product-index.component';
import { ButtonComponent } from "@shared/components/buttons/button/button.component";
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-index-page',
  imports: [ProductIndexComponent, ButtonComponent],
  templateUrl: './product-index-page.component.html',
  styleUrl: './product-index-page.component.scss'
})
export class ProductIndexPageComponent {

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;

}

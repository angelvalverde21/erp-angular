import { Component } from '@angular/core';
import { ProductIndexComponent } from '../product-index/product-index.component';
import { ButtonComponent } from "@shared/components/buttons/button/button.component";
import { faMagnifyingGlass, faFilter, faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonLinkComponent } from 'src/app/views/shared/components/buttons/button-link/button-link.component';


@Component({
  selector: 'app-product-index-page',
  imports: [ProductIndexComponent, ButtonComponent, FontAwesomeModule, ButtonLinkComponent],
  templateUrl: './product-index-page.component.html',
  styleUrl: './product-index-page.component.scss'
})
export class ProductIndexPageComponent {

  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  faTag = faTag;

}

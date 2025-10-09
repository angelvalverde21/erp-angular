import { Component, Input } from '@angular/core';
import { ProductIndexRowComponent } from './product-index-row/product-index-row.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { TableVariantComponent } from './table-variant/table-variant.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-product-index',
  imports: [BadgeComponent, ButtonLinkComponent, FontAwesomeModule, TableVariantComponent],
  templateUrl: './product-index.component.html',
  styleUrl: './product-index.component.scss',
})
export class ProductIndexComponent {

  @Input() products: any[] = [];

  faTrash = faTrash;
  faEdit = faEdit;

  reListProducts(id: any) {
    // this.images = this.images.filter((image) => image.id !== id);/
    console.log('Re-listing product after deletion of ID:', id);
    this.products = this.products.filter((product) => product.id !== id);
  }
  
}

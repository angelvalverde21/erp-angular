import { Component, Input } from '@angular/core';
import { ProductIndexRowComponent } from './product-index-row/product-index-row.component';

@Component({
  selector: 'app-product-index',
  imports: [ProductIndexRowComponent],
  templateUrl: './product-index.component.html',
  styleUrl: './product-index.component.scss',
})
export class ProductIndexComponent {

  @Input() products: any[] = [];

  reListProducts(id: any) {
    // this.images = this.images.filter((image) => image.id !== id);/
    console.log('Re-listing product after deletion of ID:', id);
    this.products = this.products.filter((product) => product.id !== id);
  }
  
}

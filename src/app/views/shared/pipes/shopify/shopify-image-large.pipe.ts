import { Pipe, PipeTransform } from '@angular/core';
import { ShopifyImageResizePipe } from './shopify-image-resize.pipe';

@Pipe({
  name: 'shopifyImageLarge',
  standalone: true
})
export class ShopifyImageLargePipe implements PipeTransform {

  private resize = new ShopifyImageResizePipe();

  transform(src: string): string {
    return this.resize.transform(src, 1000, 1000);
  }
}

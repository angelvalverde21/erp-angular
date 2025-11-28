import { Pipe, PipeTransform } from '@angular/core';
import { ShopifyImageResizePipe } from './shopify-image-resize.pipe';

@Pipe({
  name: 'shopifyImageMedium',
  standalone: true
})
export class ShopifyImageMediumPipe implements PipeTransform {

  private resize = new ShopifyImageResizePipe();

  transform(src: string): string {
    return this.resize.transform(src, 500, 500);
  }
}
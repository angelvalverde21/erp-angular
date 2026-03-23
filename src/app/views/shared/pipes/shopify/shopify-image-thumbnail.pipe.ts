import { Pipe, PipeTransform } from '@angular/core';
import { ShopifyImageResizePipe } from './shopify-image-resize.pipe';

@Pipe({
  name: 'shopifyImageThumbnail',
  standalone: true
})
export class ShopifyImageThumbnailPipe implements PipeTransform {

  private resize = new ShopifyImageResizePipe();

  transform(src: string): string {
    return this.resize.transform(src, 200, 200);
  }
}
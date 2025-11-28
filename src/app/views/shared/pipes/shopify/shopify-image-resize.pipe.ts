import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shopifyImageResize',
  standalone: true
})
export class ShopifyImageResizePipe implements PipeTransform {

  transform(src: string, width: number, height: number): string {
    if (!src) return src;

    const dotIndex = src.lastIndexOf('.');
    if (dotIndex === -1) return src;

    const base = src.substring(0, dotIndex);
    const ext  = src.substring(dotIndex); // ".jpg", ".png", ".webp"

    return `${base}_${width}x${height}${ext}`;
  }
}
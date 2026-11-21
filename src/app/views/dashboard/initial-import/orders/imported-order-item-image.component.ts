import { Component, Input, OnChanges } from '@angular/core';
import { ImportedItemImage } from './imported-order.model';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';

@Component({
  selector: 'app-imported-order-item-image',
  host: { '[class.compact]': 'compact' },
  imports: [ImagePreviewComponent],
  template: `
    @if (currentImage; as picture) {
      <span class="thumbnail" [style.width.px]="compact ? 40 : 66" [style.height.px]="compact ? 48 : 78"><app-image-preview [image]="picture" [title]="title" [height]="compact ? 46 : 76" [width]="compact ? 38 : 64" previewVariant="large" objectFit="contain" (imageError)="nextThumbnail()" /></span>
    } @else { <span class="no-image" role="img" [attr.aria-label]="'Sin imagen para ' + title"><i class="fa-regular fa-image" aria-hidden="true"></i><small>Sin imagen</small></span> }
  `,
  styles: `:host{display:block;flex-shrink:0}.thumbnail,.no-image{width:66px;height:78px;border:1px solid #e0e6f0;border-radius:8px;background:#f6f8fc;overflow:hidden}.thumbnail{display:block}.thumbnail app-image-preview{display:block;border-radius:inherit}.no-image{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;color:#a0aec2;font-size:1.1rem}.no-image small{font-size:.55rem}:host(.compact) .no-image{width:40px;height:48px;font-size:.9rem}:host(.compact) .no-image small{display:none}`,
})
export class ImportedOrderItemImageComponent implements OnChanges {
  @Input() image: ImportedItemImage | null = null;
  @Input() compact = false;
  @Input() title = 'Artículo';
  private images: { url_thumbnail: string; url_large: string }[] = [];
  private thumbnailIndex = 0;
  get currentImage(): { url_thumbnail: string; url_large: string } | null { return this.images[this.thumbnailIndex] ?? null; }
  ngOnChanges(): void {
    this.images = this.image ? [this.image, ...(this.image.fallback_images ?? [])] : [];
    this.thumbnailIndex = 0;
  }
  nextThumbnail(): void { this.thumbnailIndex++; }
}

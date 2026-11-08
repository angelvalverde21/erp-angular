import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Fancybox } from '@fancyapps/ui';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss',
})
export class ImagePreviewComponent implements OnInit, OnDestroy {
  @Input() image: any;
  @Input() title = '';
  @Input() height = 45;
  @Input() width: number | null = null;
  @Input() previewSize: number | null = null;
  @Output() imageError = new EventEmitter<void>();

  constructor(private elRef: ElementRef<HTMLElement>) {}

  get thumbnailUrl(): string {
    const source = this.image?.url_thumbnail || 'assets/images/300x300.svg';
    return this.previewSize ? this.resizeShopifyImage(source, Math.min(200, this.height * 2)) : source;
  }

  get previewUrl(): string | null {
    const source = this.image?.url_medium || this.image?.url_thumbnail || this.image?.url_large;
    if (!source) return null;
    return this.previewSize ? this.resizeShopifyImage(source, this.previewSize) : source;
  }

  ngOnInit(): void {
    Fancybox.bind(this.elRef.nativeElement, '[data-fancybox]', this.previewSize ? {
      mainClass: 'image-preview-bounded',
      Images: { initialSize: 'fit', Panzoom: { maxScale: 1 } },
      on: {
        initLayout: instance => instance.container?.style.setProperty('--image-preview-size', `${this.previewSize}px`),
      },
    } : {});
  }

  ngOnDestroy(): void {
    Fancybox.unbind(this.elRef.nativeElement);
    Fancybox.close();
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.onerror = null;
    if (image.getAttribute('src') !== 'assets/images/300x300.svg') {
      image.src = 'assets/images/300x300.svg';
    }
    this.imageError.emit();
  }

  private resizeShopifyImage(source: string, size: number): string {
    try {
      const url = new URL(source.startsWith('//') ? `https:${source}` : source);
      if (url.hostname !== 'cdn.shopify.com') return source;
      url.searchParams.set('width', String(size));
      url.searchParams.set('height', String(size));
      url.searchParams.delete('crop');
      return url.toString();
    } catch {
      return source;
    }
  }
}
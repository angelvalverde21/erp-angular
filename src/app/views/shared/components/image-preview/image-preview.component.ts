import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Fancybox } from '@fancyapps/ui';
import { ShopifyImageThumbnailPipe } from '../../pipes/shopify/shopify-image-thumbnail.pipe';
import { ShopifyImageMediumPipe } from '../../pipes/shopify/shopify-image-medium.pipe';
import { ShopifyImageLargePipe } from '../../pipes/shopify/shopify-image-large.pipe';

@Component({
  selector: 'app-image-preview',
  imports: [
    ShopifyImageThumbnailPipe,
    ShopifyImageMediumPipe,
    ShopifyImageLargePipe
  ],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss'
})
export class ImagePreviewComponent implements OnInit, OnDestroy {


  @Input() image: any; //es un array de url

  @Input() title: string = '';

  constructor(
    private elRef: ElementRef,
  ) {

  }

  ngOnInit(): void {

    Fancybox.bind(this.elRef.nativeElement, '[data-fancybox]', {
      // Custom options
    })

  }

  ngOnDestroy(): void {
    Fancybox.unbind(this.elRef.nativeElement);
    Fancybox.close();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/300x300.svg';
  }

}

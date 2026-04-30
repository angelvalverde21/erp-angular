import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Fancybox } from '@fancyapps/ui';
import { ShopifyImageThumbnailPipe } from '../../pipes/shopify/shopify-image-thumbnail.pipe';
import { ShopifyImageMediumPipe } from '../../pipes/shopify/shopify-image-medium.pipe';
import { ShopifyImageLargePipe } from '../../pipes/shopify/shopify-image-large.pipe';

@Component({
  selector: 'app-image-shopify',
  imports: [
    ShopifyImageThumbnailPipe,
    ShopifyImageMediumPipe,
    ShopifyImageLargePipe
  ],
  templateUrl: './image-shopify.component.html',
  styleUrl: './image-shopify.component.scss'
})
export class ImageShopifyComponent implements OnInit, OnDestroy {

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

  @Input() image: any;

  @Input() title: string = '';

}

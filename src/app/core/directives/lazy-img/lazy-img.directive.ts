import { Directive, ElementRef, Input, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[lazyImg]',
})
export class LazyImgDirective implements OnInit {

  @Input('lazyImg') src!: string;

  constructor(private el: ElementRef<HTMLImageElement>,
              @Inject(PLATFORM_ID) private platformId: Object) {}

ngOnInit(): void {
  const imgElement = this.el.nativeElement;

  // si src viene null, undefined o vacío, no tocamos nada → se mantiene el placeholder
  if (!this.src || this.src === 'null' || this.src === 'undefined') {
    return;
  }

  if (isPlatformBrowser(this.platformId) && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          imgElement.src = this.src;
          observer.unobserve(imgElement);
        }
      });
    });

    observer.observe(imgElement);
  } else {
    imgElement.src = this.src;
  }
}
}

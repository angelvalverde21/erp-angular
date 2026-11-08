import { TestBed } from '@angular/core/testing';
import { Fancybox } from '@fancyapps/ui';
import { ImagePreviewComponent } from './image-preview.component';

describe('ImagePreviewComponent', () => {
  it('requests a reduced Shopify image for the viewer and a small thumbnail without cropping', () => {
    const bind = spyOn(Fancybox, 'bind');
    const fixture = TestBed.createComponent(ImagePreviewComponent);
    const original = 'https://cdn.shopify.com/s/files/1/test/product.png?v=123&crop=center';
    fixture.componentRef.setInput('image', { url_thumbnail: original, url_medium: original, url_large: original });
    fixture.componentRef.setInput('title', 'Vestido Clara');
    fixture.componentRef.setInput('height', 64);
    fixture.componentRef.setInput('width', 64);
    fixture.componentRef.setInput('previewSize', 600);
    fixture.detectChanges();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    const preview = new URL(link.href);
    const thumbnail = new URL(fixture.nativeElement.querySelector('img').src);
    expect(preview.searchParams.get('width')).toBe('600');
    expect(preview.searchParams.get('height')).toBe('600');
    expect(preview.searchParams.get('v')).toBe('123');
    expect(preview.searchParams.has('crop')).toBeFalse();
    expect(thumbnail.searchParams.get('width')).toBe('128');
    expect(link.getAttribute('aria-label')).toContain('Vestido Clara');
    const settings = bind.calls.mostRecent().args[2] as any;
    expect(settings.mainClass).toBe('image-preview-bounded');
    expect(settings.Images.initialSize).toBe('fit');
    const container = document.createElement('div');
    settings.on.initLayout({ container });
    expect(container.style.getPropertyValue('--image-preview-size')).toBe('600px');
    fixture.destroy();
  });

  it('uses the existing medium image for local files and preserves default previews elsewhere', () => {
    spyOn(Fancybox, 'bind');
    const fixture = TestBed.createComponent(ImagePreviewComponent);
    fixture.componentRef.setInput('image', { url_thumbnail: '/small.webp', url_medium: '/medium.webp', url_large: '/original.webp' });
    fixture.detectChanges();
    expect(fixture.componentInstance.previewUrl).toBe('/medium.webp');
    expect(fixture.componentInstance.thumbnailUrl).toBe('/small.webp');
    fixture.componentRef.setInput('previewSize', 600);
    fixture.detectChanges();
    expect(fixture.componentInstance.previewUrl).toBe('/medium.webp');
    fixture.destroy();
  });
});
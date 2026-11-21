import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { KardexIndexSelectedComponent } from './kardex-index-selected.component';
import { KardexIndexSelectedRowComponent } from '../kardex-index-selected-row/kardex-index-selected-row.component';
import { ImagePreviewComponent } from 'src/app/views/shared/components/image-preview/image-preview.component';

describe('Kardex variant selection', () => {
  const variants = [
    { id: 1, sku: 'BLUSA-FRESA-S', product: { name: 'Blusa Barquillo' }, option_values: [{ id: 11, value: 'Talla S', option: { name: 'size' } }, { id: 12, value: 'Fresa', option: { name: 'color' } }] },
    { id: 2, sku: 'BLUSA-COCO-M', product: { name: 'Blusa Barquillo' }, option_values: [{ id: 13, value: 'Talla M', option: { name: 'size' } }, { id: 14, value: 'Coco', option: { name: 'color' } }] },
  ];
  function setup(tone = 'success') {
    const fixture = TestBed.createComponent(KardexIndexSelectedComponent);
    fixture.componentRef.setInput('variants', variants);
    fixture.componentRef.setInput('color_check', tone);
    if (tone === 'success') fixture.componentRef.setInput('comments', ['Recepcion', 'Correccion']);
    fixture.detectChanges();
    return fixture;
  }
  function quantity(fixture: ReturnType<typeof setup>, index: number, value: string) {
    const input = fixture.nativeElement.querySelectorAll('.entry-quantity-cell input')[index] as HTMLInputElement;
    input.value = value; input.dispatchEvent(new Event('input')); fixture.detectChanges();
  }

  it('prevents the mouse wheel from changing a focused quantity', () => {
    const fixture = setup(); quantity(fixture, 0, '12');
    const input = fixture.nativeElement.querySelector('.entry-quantity-cell input') as HTMLInputElement;
    input.focus(); const wheel = new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true }); input.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBeTrue(); expect(input.value).toBe('12'); expect(fixture.componentInstance.sum).toBe(12); fixture.destroy();
  });

  it('sums quantities numerically, updates reasons without duplicates and excludes empty rows', () => {
    const fixture = setup(); const component = fixture.componentInstance;
    quantity(fixture, 0, '2'); quantity(fixture, 1, '3');
    expect(component.sum).toBe(5); expect(component.kardex_variants.length).toBe(2);
    const reason = fixture.nativeElement.querySelector('tbody select') as HTMLSelectElement;
    reason.value = 'Correccion'; reason.dispatchEvent(new Event('change')); fixture.detectChanges();
    expect(component.kardex_variants.length).toBe(2); expect(component.sum).toBe(5);
    expect(component.kardex_variants.find(row => row.variant_id === 1).comment).toBe('Correccion');
    quantity(fixture, 1, '');
    expect(component.sum).toBe(2); expect(component.kardex_variants.length).toBe(1);
    quantity(fixture, 0, '-1');
    expect(component.sum).toBe(0); expect(component.kardex_variants).toEqual([]); fixture.destroy();
  });

  it('filters without destroying entered quantities or excluding hidden selections', () => {
    const fixture = setup(); quantity(fixture, 0, '4');
    const row = fixture.debugElement.queryAll(By.directive(KardexIndexSelectedRowComponent))[0].componentInstance;
    const search = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    search.value = 'COCO'; search.dispatchEvent(new Event('input')); fixture.detectChanges();
    const first = fixture.nativeElement.querySelector('tr[app-kardex-index-selected-row]') as HTMLElement;
    expect(first.hidden).toBeTrue(); expect(getComputedStyle(first).display).toBe('none');
    expect(fixture.componentInstance.sum).toBe(4); expect(fixture.componentInstance.visibleCount).toBe(1);
    search.value = ''; search.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(first.hidden).toBeFalse();
    expect(fixture.debugElement.queryAll(By.directive(KardexIndexSelectedRowComponent))[0].componentInstance).toBe(row);
    expect(row.form.get('quantity').value).toBe(4); fixture.destroy();
  });

  it('keeps reception values compatible with the API and repairs usable without a supplied reason list', () => {
    const fixture = setup('warning'); quantity(fixture, 0, '1');
    expect(fixture.componentInstance.kardex_variants[0].comment).toBe('Reparado');
    const select = fixture.nativeElement.querySelector('tbody select') as HTMLSelectElement;
    expect(select.selectedOptions[0].textContent).toContain('Reparado'); fixture.destroy();
  });

  it('identifies each variant with its SKU and options and uses a clear placeholder when no photo exists', () => {
    const fixture = setup();
    expect(fixture.nativeElement.querySelectorAll('thead th').length).toBe(4);
    expect(fixture.nativeElement.textContent).toContain('BLUSA-FRESA-S');
    expect(fixture.nativeElement.textContent).toContain('Talla S');
    const names = Array.from(fixture.nativeElement.querySelectorAll('.entry-product-copy > strong') as NodeListOf<HTMLElement>).map(element => element.textContent?.trim());
    expect(names).toEqual(['Blusa Barquillo Fresa', 'Blusa Barquillo Coco']);
    expect(fixture.nativeElement.querySelector('.entry-options').textContent.trim()).toBe('Talla S');
    expect(fixture.nativeElement.querySelector('.entry-image-placeholder')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-button')).toBeNull(); fixture.destroy();
  });

  it('preserves the complete product name and identifies color by its metadata, not by its text', () => {
    const fixture = setup();
    fixture.componentRef.setInput('variants', [{ ...variants[0], product: { name: 'Blusa Barquillo Edición Especial' }, option_values: [
      { id: 11, value: 'Talla S', option: { name: 'size' } },
      { id: 12, value: 'Fresa', option: { name: 'material' } },
      { id: 15, value: 'COCO', option: { name: 'color' } },
    ] }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.entry-product-copy > strong').textContent.trim()).toBe('Blusa Barquillo Edición Especial COCO');
    expect(fixture.nativeElement.querySelector('.entry-options').textContent).toContain('Fresa');
    expect(fixture.nativeElement.querySelector('.entry-options').textContent).not.toContain('COCO');
    fixture.componentInstance.search = 'Blusa Barquillo Edición Especial COCO';
    expect(fixture.componentInstance.visibleCount).toBe(1); fixture.destroy();
  });

  it('shows valid variants and an explicit warning when the API includes missing variant references', () => {
    const fixture = setup();
    fixture.componentRef.setInput('variants', [null, variants[0], null, variants[1]]);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.nativeElement.querySelectorAll('tr[app-kardex-index-selected-row]').length).toBe(2);
    expect(fixture.componentInstance.availableVariants.length).toBe(2);
    expect(fixture.componentInstance.unavailableCount).toBe(2);
    expect(fixture.nativeElement.querySelector('.entry-unavailable').textContent).toContain('2 variantes vinculadas');
    expect(fixture.nativeElement.querySelector('tbody select').value).toBe('Recepcion');
    quantity(fixture, 0, '2');
    fixture.componentInstance.receiveVariantKardex({ variant_id: 999, quantity: 4, comment: 'Recepcion' });
    expect(fixture.componentInstance.kardex_variants.map(item => item.variant_id)).toEqual([1]);
    expect(fixture.componentInstance.sum).toBe(2); fixture.destroy();
  });

  it('removes a no-longer-available variant from the selected payload when the list refreshes', async () => {
    const fixture = setup(); quantity(fixture, 0, '2');
    const emit = spyOn(fixture.componentInstance.emitKardexVariants, 'emit');
    fixture.componentRef.setInput('variants', [null, variants[1]]); fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.kardex_variants).toEqual([]);
    expect(fixture.componentInstance.sum).toBe(0);
    expect(emit).toHaveBeenCalledWith([]); fixture.destroy();
  });

  it('shows an empty state without creating incomplete rows when every variant is unavailable', () => {
    const fixture = setup();
    fixture.componentRef.setInput('variants', [null, { id: null }, null]); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tr[app-kardex-index-selected-row]').length).toBe(0);
    expect(fixture.nativeElement.querySelector('.entry-empty').textContent).toContain('No hay variantes disponibles');
    expect(fixture.componentInstance.visibleCount).toBe(0);
    expect(fixture.componentInstance.unavailableCount).toBe(3);
    expect(fixture.componentInstance.kardex_variants).toEqual([]); fixture.destroy();
  });

  it('uses the existing image viewer with thumbnails in the row and large images for the zoom', () => {
    const fixture = setup();
    fixture.componentRef.setInput('variants', [{ ...variants[0], product: { name: 'Blusa Barquillo', image: { url_thumbnail: 'assets/images/300x300.svg', url_large: 'https://example.test/original.jpg' } } }]);
    fixture.detectChanges();
    const preview = fixture.debugElement.query(By.directive(ImagePreviewComponent)).componentInstance as ImagePreviewComponent;
    expect(preview.thumbnailUrl).toBe('assets/images/300x300.svg');
    expect(preview.previewUrl).toBe('https://example.test/original.jpg');
    expect(preview.previewVariant).toBe('large'); fixture.destroy();
  });
});

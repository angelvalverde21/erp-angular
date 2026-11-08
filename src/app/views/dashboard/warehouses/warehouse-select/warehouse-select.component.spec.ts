import { TestBed } from '@angular/core/testing';
import { WarehouseSelectComponent } from './warehouse-select.component';

describe('Warehouse subtitles', () => {
  it('renders the subtitle below the selected name and searches it', async () => {
    const fixture = TestBed.createComponent(WarehouseSelectComponent);
    const item = { id: 4, name: 'Tienda 420', subtitle: 'Showroom' };
    fixture.componentRef.setInput('items', [item]);
    fixture.componentRef.setInput('value', 4);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.warehouse-option-name').textContent).toContain('Tienda 420');
    expect(fixture.nativeElement.querySelector('small').textContent).toBe('Showroom');
    expect(fixture.componentInstance.search('showroom', item)).toBeTrue();
    expect(fixture.componentInstance.search('otra tienda', item)).toBeFalse();
  });

  it('keeps a warehouse selected when the options input is refreshed', async () => {
    const fixture = TestBed.createComponent(WarehouseSelectComponent);
    const items = [{ id: 4, name: 'Tienda 420', subtitle: 'Showroom' }];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.nativeElement.querySelector('.ng-select-container').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();
    const option: HTMLElement = fixture.nativeElement.querySelector('.ng-option');
    option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.componentRef.setInput('items', [...items]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ng-option')).toBe(option);
    option.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    option.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentRef.setInput('items', [...items]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(4);
    expect(fixture.nativeElement.querySelector('.ng-value').textContent).toContain('Tienda 420');
  });
});

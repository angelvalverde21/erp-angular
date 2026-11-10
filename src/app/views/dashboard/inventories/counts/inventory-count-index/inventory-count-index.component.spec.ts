import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { InventoryCount } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryCountIndexComponent } from './inventory-count-index.component';

describe('Individual inventory captures', () => {
  it('shows every capture independently and exposes each record for editing', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(InventoryCountIndexComponent);
    const records = [
      { id: 1, variant_id: 7, quantity: 1, status: 'valid' },
      { id: 2, variant_id: 7, quantity: 5, status: 'valid' },
      { id: 3, variant_id: 8, quantity: 3, status: 'valid' },
      { id: 4, variant_id: 7, quantity: 9, status: 'cancelled' },
      { id: 5, variant_id: 7, quantity: 2, status: 'replaced' },
    ] as InventoryCount[];
    fixture.componentRef.setInput('records', records);
    fixture.detectChanges();
    expect(fixture.componentInstance.records.map(record => record.quantity)).toEqual([1, 5, 3, 9, 2]);
    expect(fixture.nativeElement.querySelectorAll('.count-group-row').length).toBe(0);
    expect(fixture.nativeElement.querySelector('.count-group-toggle')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.count-capture-row').length).toBe(5);
    expect(fixture.nativeElement.querySelectorAll('.count-capture-row a').length).toBe(5);
  });

  it('shows size and color in uppercase for each variant without mixing captures', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(InventoryCountIndexComponent);
    const variant = (id: number, size: string, color: string) => ({
      id, sku: `SKU-${id}`, product: { id: 1, name: 'Básico Martina' },
      variant_option_values: [
        { id: id * 2, option: { name: 'size', label: 'Tallas' }, option_value: { value: size } },
        { id: id * 2 + 1, option: { name: 'color', label: 'Colores' }, option_value: { value: color } },
      ],
    });
    fixture.componentRef.setInput('records', [
      { id: 1, variant_id: 7, quantity: 25, status: 'valid', variant: variant(7, 'l', 'Negro') },
      { id: 2, variant_id: 7, quantity: 13, status: 'valid', variant: variant(7, 'l', 'Negro') },
      { id: 3, variant_id: 8, quantity: 4, status: 'valid', variant: variant(8, 'm', 'Azul') },
    ]);
    fixture.detectChanges();
    const groups = fixture.nativeElement.querySelectorAll('.count-capture-row');
    expect(groups[0].querySelector('.count-variant-options').textContent).toContain('Tallas: L');
    expect(groups[0].querySelector('.count-variant-options').textContent).toContain('Colores: NEGRO');
    expect(groups[0].querySelectorAll('.count-variant-options > span').length).toBe(2);
    expect(groups[2].querySelector('.count-variant-options').textContent).toContain('Tallas: M');
    expect(groups[2].querySelector('.count-variant-options').textContent).toContain('Colores: AZUL');
    expect(fixture.componentInstance.records.map(record => record.quantity)).toEqual([25, 13, 4]);
    fixture.destroy();
  });
});

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ManufactureVariantService } from '../../manufacture.variants.service';
import { ManufactureService } from '../../manufacture.service';
import { ManufactureProductionVariantIndexComponent } from '../../productions/manufacture-production-edit-page/manufacture-production-variant-index/manufacture-production-variant-index.component';
import { buildVariantMatrices, ManufactureMatrixVariant } from './variant-matrix.model';
import { ManufactureVariantRowsPipe } from '../manufacture-variant-rows.pipe';

function record(id: number, color: string, size: string, quantity: number, price = '10.00', productId = 713): ManufactureMatrixVariant {
  return {
    id, manufacture_id: 24, quantity, price,
    variant: {
      id: id + 100, sku: `SKU-${id}`, product: { id: productId, name: 'Blusa Barquillo' },
      option_values: [
        { id: id * 2, option: { id: 1, name: 'color', label: 'Colores' }, value: color },
        { id: id * 2 + 1, option: { id: 2, name: 'size', label: 'Tallas' }, value: size },
      ],
    },
  };
}

describe('Manufacturing quantities by color and size', () => {
  it('alternates stripes by product and color while keeping sizes together in order', () => {
    const input = [
      record(1, 'VERDE', 'L', 1), record(2, 'AZUL', 'M', 2),
      record(3, 'VERDE', 'S', 3), record(4, 'AZUL', 'S', 4),
    ];
    const output = new ManufactureVariantRowsPipe().transform(input);
    expect(output.map(item => item.record.id)).toEqual([4, 2, 3, 1]);
    expect(output.map(item => item.striped)).toEqual([false, false, true, true]);
    expect(output.map(item => item.startsGroup)).toEqual([true, false, true, false]);
    expect(input.map(item => item.id)).toEqual([1, 2, 3, 4]);
  });

  it('turns the 12 production variants into four color rows and sorts S, M and L', () => {
    let id = 218;
    const rows = [
      ...['L', 'M', 'S'].map((size, i) => record(id++, 'COCO', `TALLA ${size}`, [9, 14, 14][i])),
      ...['L', 'M', 'S'].map(size => record(id++, 'FRESA', `TALLA ${size}`, 8)),
      ...['L', 'M', 'S'].map(size => record(id++, 'PISTACHO', `TALLA ${size}`, 8)),
      ...['L', 'M', 'S'].map((size, i) => record(id++, 'VANILLA', `TALLA ${size}`, [10, 12, 12][i])),
    ];
    const groups = buildVariantMatrices(rows);
    expect(groups.length).toBe(1);
    expect(groups[0].sizes).toEqual(['S', 'M', 'L']);
    expect(groups[0].rows.map(row => row.label)).toEqual(['COCO', 'FRESA', 'PISTACHO', 'VANILLA']);
    expect(groups[0].rows.map(row => row.quantity)).toEqual([37, 24, 24, 34]);
    expect(groups[0].sizes.map(size => groups[0].totals.get(size)?.quantity)).toEqual([42, 42, 35]);
    expect(groups[0].quantity).toBe(119);
    expect(groups[0].amount).toBe(1190);
    expect(groups[0].count).toBe(12);
  });

  it('supports the nested options response, numeric sizes and absent combinations', () => {
    const a = record(1, 'Verde', '30', 2);
    a.variant!.variant_option_values = a.variant!.option_values!.map(value => ({ option: value.option, option_value: value }));
    delete a.variant!.option_values;
    const group = buildVariantMatrices([a, record(2, 'Azul', '26', 3)])[0];
    expect(group.sizes).toEqual(['26', '30']);
    expect(group.rows.find(row => row.label === 'Azul')?.cells.get('30')).toBeUndefined();
    expect(group.quantity).toBe(5);
  });

  it('keeps product identities, additional options and duplicate combinations separate', () => {
    const first = record(1, 'Verde', 'S', 2);
    const duplicate = record(2, 'Verde', 'S', 3);
    const otherFit = record(3, 'Verde', 'S', 4);
    otherFit.variant!.option_values!.push({ option: { id: 3, name: 'fit', label: 'Corte' }, value: 'Slim' });
    const groups = buildVariantMatrices([first, duplicate, otherFit, record(4, 'Verde', 'S', 9, '10.00', 714)]);
    expect(groups.length).toBe(2);
    expect(groups[0].rows.length).toBe(2);
    expect(groups[0].rows.find(row => !row.details)?.cells.get('S')?.map(item => item.id)).toEqual([1, 2]);
    expect(groups[0].rows.find(row => !!row.details)?.details).toContain('Corte: Slim');
    expect(groups[0].quantity).toBe(9);
    expect(groups[1].quantity).toBe(9);
  });

  it('retains products with no size or color as a single presentation', () => {
    const row = record(1, '', '', 0);
    row.variant!.option_values = [];
    const group = buildVariantMatrices([row])[0];
    expect(group.sizes).toEqual(['ÚNICA']);
    expect(group.rows[0].cells.get('ÚNICA')?.[0].id).toBe(1);
    expect(group.quantity).toBe(0);
  });
});

describe('Production variant list editing', () => {
  let service: jasmine.SpyObj<ManufactureVariantService>;
  const rows = [record(1, 'COCO', 'S', 2), record(2, 'COCO', 'M', 4)];

  beforeEach(() => {
    service = jasmine.createSpyObj('ManufactureVariantService', ['index', 'setManufactureId', 'update', 'destroy']);
    service.index.and.returnValue(of({ data: rows }) as any);
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ManufactureVariantService, useValue: service },
        { provide: ManufactureService, useValue: { setSummary: jasmine.createSpy('setSummary') } }],
    });
  });

  it('shows one row per variant and preserves another draft when a quantity is saved', () => {
    const response = new Subject<any>();
    service.update.and.returnValue(response);
    const fixture = TestBed.createComponent(ManufactureProductionVariantIndexComponent);
    fixture.componentRef.setInput('manufacture_id', 24);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-variant-matrix')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
    expect(fixture.nativeElement.querySelector('tbody tr').textContent).toContain('S');
    const inputs = fixture.nativeElement.querySelectorAll('tbody input');
    inputs[1].value = '9';
    inputs[1].dispatchEvent(new Event('input'));
    inputs[0].value = '3';
    inputs[0].dispatchEvent(new Event('input'));
    inputs[0].dispatchEvent(new Event('blur'));
    expect(service.update).toHaveBeenCalledOnceWith(1, { quantity: '3', price: '10.00' });
    response.next({ data: { ...rows[0], quantity: 3 } });
    response.complete();
    fixture.detectChanges();
    expect(fixture.componentInstance.sum_variants).toBe(7);
    expect(inputs[1].value).toBe('9');
    expect(service.index).toHaveBeenCalledTimes(1);
    fixture.destroy();
  });

  it('accepts zero without removing the variant', () => {
    service.update.and.returnValue(of({ data: { ...rows[0], quantity: 0 } }));
    const fixture = TestBed.createComponent(ManufactureProductionVariantIndexComponent);
    fixture.componentRef.setInput('manufacture_id', 24);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('tbody input');
    input.value = '0';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(fixture.componentInstance.sum_variants).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
    expect(service.destroy).not.toHaveBeenCalled();
    fixture.destroy();
  });
});

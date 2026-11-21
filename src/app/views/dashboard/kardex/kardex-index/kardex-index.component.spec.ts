import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BaseService } from 'src/app/views/base.service';
import { KardexService } from '../kardex.service';

import { KardexIndexComponent } from './kardex-index.component';

describe('KardexIndexComponent', () => {
  let component: KardexIndexComponent;
  let fixture: ComponentFixture<KardexIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexIndexComponent],
      providers: [
        provideRouter([]),
        { provide: BaseService, useValue: { store: 'test-store' } },
        { provide: KardexService, useValue: { summary: KardexService.prototype.summary } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the empty state centered across all columns', () => {
    const empty: HTMLTableCellElement = fixture.nativeElement.querySelector('tbody td');
    expect(empty.colSpan).toBe(5);
    expect(empty.textContent).toContain('No hay registros');
    expect(fixture.nativeElement.querySelector('tfoot').textContent).toContain('0');
  });

  it('distinguishes incoming and outgoing quantities with badges and signs', () => {
    fixture.componentRef.setInput('kardexes', [
      { id: 1, variant_id: 1276, direction: 'in', quantity: 8, comment: 'Compra' },
      { id: 2, variant_id: 1276, direction: 'out', quantity: 3, comment: 'Venta' },
    ]);
    fixture.detectChanges();
    const badges: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.kardex-quantity-badge');
    expect(badges[0].classList.contains('kardex-in')).toBeTrue();
    expect(badges[0].textContent?.trim()).toBe('+8');
    expect(badges[1].classList.contains('kardex-out')).toBeTrue();
    expect(badges[1].textContent?.trim()).toBe('−3');
    expect(fixture.nativeElement.querySelector('.kardex-balance').textContent.trim()).toBe('5');
  });

  it('renders grouped movements and emits their balance', () => {
    const emitSummary = spyOn(component.emitKardexSummary, 'emit');
    fixture.componentRef.setInput('kardexes', [{ date: '2026-10-29', items: [
      { id: 1, variant_id: 1276, direction: 'in', quantity: 4, comment: 'Recepcion' },
    ] }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.kardex-quantity-badge').textContent.trim()).toBe('+4');
    expect(emitSummary).toHaveBeenCalledWith(jasmine.objectContaining({ reception: 4 }));
  });

  it('renders the production API date and direction groups as four real movements', () => {
    const records = [432, 431, 430, 429].map((id, index) => ({
      id, variant_id: 3131 - index, direction: 'in', quantity: '1', created_at: '2026-11-18T10:00:00-05:00',
      variant: { id: 3131 - index, product: { id: 12, name: 'Blusa Renata' } },
    }));
    const emitSummary = spyOn(component.emitKardexSummary, 'emit');
    fixture.componentRef.setInput('kardexes', [{ date: '2026-11-18', groups: [{ direction: 'in', total_quantity: 4, kardexes: records }] }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(4);
    expect(component.kardexesFlat.map(record => record.id)).toEqual([432, 431, 430, 429]);
    expect(fixture.nativeElement.textContent).not.toContain('NaN');
    expect(fixture.nativeElement.textContent).not.toContain('Variante #—');
    expect(fixture.nativeElement.querySelector('.kardex-balance').textContent.trim()).toBe('4');
    expect(emitSummary).toHaveBeenCalledWith(jasmine.objectContaining({ reception: 4 }));
  });

  it('combines nested, legacy and newly appended movements without counting group totals twice', () => {
    fixture.componentRef.setInput('kardexes', [
      { date: '2026-11-18', groups: [{ direction: 'in', total_quantity: 500, kardexes: [{ id: 1, direction: 'in', quantity: '8' }] }] },
      { date: '2026-11-17', items: [{ id: 2, direction: 'out', quantity: '2' }] },
      { id: 3, direction: 'out', quantity: 1 },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.kardex-quantity-badge').length).toBe(3);
    expect(fixture.nativeElement.querySelector('.kardex-balance').textContent.trim()).toBe('5');
  });

  it('sums decimal strings numerically and keeps invalid quantities from corrupting the summary', () => {
    expect(KardexService.prototype.summary([
      { direction: 'in', quantity: '5.5' },
      { direction: 'out', quantity: '2', comment: 'Fallado' },
      { direction: 'out', quantity: '3', comment: 'Fallado' },
      { direction: 'in', quantity: '1', comment: 'Reparado' },
      { direction: 'out', quantity: undefined },
      { direction: 'out', quantity: 'invalid' },
      { direction: 'out', quantity: Infinity },
    ])).toEqual({ reception: 1.5, fallados: 5, reparados: 1, saldo: 4 });
  });

  it('does not render empty direction groups as phantom movements', () => {
    fixture.componentRef.setInput('kardexes', [{ date: '2026-11-18', groups: [{ direction: 'in', kardexes: [] }] }]);
    fixture.detectChanges();
    expect(component.kardexesFlat).toEqual([]);
    expect(fixture.nativeElement.querySelector('.kardex-empty')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.kardex-balance').textContent.trim()).toBe('0');
  });
});

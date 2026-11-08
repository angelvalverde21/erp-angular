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
});

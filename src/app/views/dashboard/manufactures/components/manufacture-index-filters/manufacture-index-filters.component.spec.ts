import { TestBed } from '@angular/core/testing';
import { ManufactureIndexFiltersComponent } from './manufacture-index-filters.component';

describe('ManufactureIndexFiltersComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ManufactureIndexFiltersComponent] }).compileComponents();
  });

  it('submits one trimmed query with optional dates through the form', () => {
    const fixture = TestBed.createComponent(ManufactureIndexFiltersComponent);
    fixture.detectChanges();
    const emit = spyOn(fixture.componentInstance.applyFilters, 'emit');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="search"]');
    input.value = '  Lote verano  ';
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(emit).toHaveBeenCalledOnceWith({ search: 'Lote verano', start_date: '', end_date: '' });
  });

  it('rejects an inverted date range and explains the error', () => {
    const fixture = TestBed.createComponent(ManufactureIndexFiltersComponent);
    fixture.detectChanges();
    const emit = spyOn(fixture.componentInstance.applyFilters, 'emit');
    fixture.componentInstance.form.patchValue({ start_date: '2026-10-29', end_date: '2026-10-01' });
    fixture.detectChanges();
    fixture.componentInstance.apply();
    expect(emit).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Desde');
    fixture.componentInstance.form.controls.end_date.setValue('2026-10-29');
    fixture.componentInstance.apply();
    expect(emit).toHaveBeenCalledTimes(1);
  });

  it('clears every criterion and notifies the list once', () => {
    const fixture = TestBed.createComponent(ManufactureIndexFiltersComponent);
    fixture.detectChanges();
    fixture.componentInstance.form.setValue({ search: 'Pedido', start_date: '2026-10-01', end_date: '2026-10-29' });
    const emit = spyOn(fixture.componentInstance.clearFilters, 'emit');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button[type="button"]').click();
    expect(emit).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.form.getRawValue()).toEqual({ search: '', start_date: '', end_date: '' });
  });

  it('blocks repeated searches and resets while a request is pending', () => {
    const fixture = TestBed.createComponent(ManufactureIndexFiltersComponent);
    fixture.componentRef.setInput('busy', true);
    fixture.detectChanges();
    const apply = spyOn(fixture.componentInstance.applyFilters, 'emit');
    const clear = spyOn(fixture.componentInstance.clearFilters, 'emit');
    fixture.componentInstance.apply();
    fixture.componentInstance.clear();
    expect(apply).not.toHaveBeenCalled();
    expect(clear).not.toHaveBeenCalled();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
    expect(Array.from(buttons).every(button => button.disabled)).toBeTrue();
  });
});

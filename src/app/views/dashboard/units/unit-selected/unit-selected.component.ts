import { Component, EventEmitter, forwardRef, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UnitOption, UnitService } from '../unit.service';

@Component({
  selector: 'app-unit-selected', imports: [FormsModule],
  templateUrl: './unit-selected.component.html', styleUrl: './unit-selected.component.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UnitSelectedComponent), multi: true }],
})
export class UnitSelectedComponent implements OnInit, OnDestroy, ControlValueAccessor {
  constructor(private readonly service: UnitService) {}
  private readonly destroy$ = new Subject<void>();
  @Output() emitUnitSelected = new EventEmitter<UnitOption | undefined>();
  units: UnitOption[] = [];
  value: number | null = null;
  loading = false;
  disabled = false;
  error = '';
  private onChangeFn: (value: number | null) => void = () => {};
  private onTouchedFn: () => void = () => {};
  ngOnInit(): void { this.load(); }
  load(): void {
    if (this.loading) return;
    this.loading = true; this.error = '';
    this.service.options().pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => this.units = response.data ?? [],
      error: () => this.error = 'No se pudieron actualizar las unidades.',
    });
  }
  writeValue(value: number | string | null): void { this.value = value == null || value === '' ? null : Number(value); }
  registerOnChange(fn: (value: number | null) => void): void { this.onChangeFn = fn; }
  registerOnTouched(fn: () => void): void { this.onTouchedFn = fn; }
  setDisabledState(disabled: boolean): void { this.disabled = disabled; }
  onTouched(): void { this.onTouchedFn(); }
  onUnitChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value ? Number(value) : null;
    this.onChangeFn(this.value); this.onTouchedFn();
    this.emitUnitSelected.emit(this.units.find(unit => unit.id === this.value));
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

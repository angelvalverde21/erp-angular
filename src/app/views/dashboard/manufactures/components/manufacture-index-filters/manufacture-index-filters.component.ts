import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

export interface ManufactureListFilters {
  search: string;
  start_date: string;
  end_date: string;
}

function validateDateRange(control: AbstractControl): ValidationErrors | null {
  const { start_date, end_date } = control.value;
  return start_date && end_date && start_date > end_date ? { dateRange: true } : null;
}

@Component({
  selector: 'app-manufacture-index-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './manufacture-index-filters.component.html',
  styleUrl: './manufacture-index-filters.component.scss',
})
export class ManufactureIndexFiltersComponent {
  @Input() busy = false;
  @Input() hasAppliedFilters = false;
  @Input() searchLabel = 'Buscar';
  @Input() placeholder = 'Nombre o código';
  @Output() applyFilters = new EventEmitter<ManufactureListFilters>();
  @Output() clearFilters = new EventEmitter<void>();

  readonly form = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    start_date: new FormControl('', { nonNullable: true }),
    end_date: new FormControl('', { nonNullable: true }),
  }, { validators: validateDateRange });

  get hasValues(): boolean {
    const { search, start_date, end_date } = this.form.getRawValue();
    return !!(search.trim() || start_date || end_date);
  }

  apply(): void {
    this.form.markAllAsTouched();
    if (this.busy || this.form.invalid) return;

    const filters = this.form.getRawValue();
    this.applyFilters.emit({ ...filters, search: filters.search.trim() });
  }

  clear(): void {
    if (this.busy) return;

    this.form.reset({ search: '', start_date: '', end_date: '' });
    this.clearFilters.emit();
  }
}

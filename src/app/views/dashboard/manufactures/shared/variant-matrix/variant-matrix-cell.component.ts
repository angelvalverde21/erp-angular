import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, finalize, takeUntil } from 'rxjs';
import { ManufactureVariantService } from '../../manufacture.variants.service';
import { ManufactureMatrixVariant } from './variant-matrix.model';

@Component({
  selector: 'app-variant-matrix-cell',
  imports: [ReactiveFormsModule],
  templateUrl: './variant-matrix-cell.component.html',
  styleUrl: './variant-matrix-cell.component.scss',
})
export class VariantMatrixCellComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) record!: ManufactureMatrixVariant;
  @Input() manufactureId = 0;
  @Input() showPrice = false;
  @Input() label = '';
  @Output() updated = new EventEmitter<ManufactureMatrixVariant>();
  readonly form = new FormGroup({
    quantity: new FormControl('0', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+$/), Validators.max(2147483647)] }),
    price: new FormControl('0', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.max(99999999.99)] }),
  });
  saving = false;
  saved = false;
  error = '';
  private readonly destroy$ = new Subject<void>();

  constructor(private service: ManufactureVariantService) {}

  ngOnChanges(): void {
    if (!this.record || this.form.dirty || this.saving) return;
    this.form.reset({ quantity: String(this.record.quantity ?? 0), price: String(this.record.price ?? 0) });
  }

  markEdited(): void {
    this.saved = false;
    this.error = '';
  }

  save(): void {
    if (this.saving) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();
    if (Number(payload.quantity) === Number(this.record.quantity ?? 0) && Number(payload.price) === Number(this.record.price ?? 0)) return;
    this.saving = true;
    this.error = '';
    this.service.setManufactureId(this.record.manufacture_id ?? this.record.production_id ?? this.manufactureId);
    this.service.update(this.record.id, payload)
      .pipe(takeUntil(this.destroy$), finalize(() => this.saving = false))
      .subscribe({
        next: (response: any) => {
          const updated: ManufactureMatrixVariant = {
            ...this.record,
            ...response.data,
            variant: { ...this.record.variant, ...response.data?.variant },
          };
          this.record = updated;
          this.form.reset({ quantity: String(updated.quantity ?? 0), price: String(updated.price ?? 0) });
          this.saved = true;
          this.updated.emit(updated);
        },
        error: () => this.error = 'No se guardó. Vuelve a salir del campo para reintentar.',
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

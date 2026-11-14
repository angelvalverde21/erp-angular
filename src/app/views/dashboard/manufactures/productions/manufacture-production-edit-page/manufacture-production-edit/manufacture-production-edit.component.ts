import { Component, OnDestroy, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { ManufactureService } from '../../../manufacture.service';
import { ManufactureProductionService } from '../../manufacture.production.service';

@Component({
  selector: 'app-manufacture-production-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './manufacture-production-edit.component.html',
  styleUrl: './manufacture-production-edit.component.scss',
})
export class ManufactureProductionEditComponent implements OnDestroy {
  private readonly manufacture = inject(ManufactureService);
  private readonly productionService = inject(ManufactureProductionService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();
  readonly form = inject(FormBuilder).group({ name: ['', [Validators.required, Validators.maxLength(255)]] });
  saving = false;
  nameError = '';
  message = '';
  get productionId(): number { return Number(this.route.snapshot.paramMap.get('production_id') ?? this.route.parent?.snapshot.paramMap.get('production_id')); }

  constructor() {
    effect(() => {
      const production = this.manufacture.manufactureSingnalEvent();
      if (production?.id === this.productionId && !this.form.dirty) this.form.patchValue({ name: production.name });
    });
  }
  update(): void {
    if (this.saving) return;
    const name = this.form.value.name?.trim() ?? '';
    if (!name || this.form.invalid) { this.form.controls.name.setErrors({ required: true }); this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.nameError = '';
    this.message = '';
    this.productionService.update(this.productionId, { name }).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => {
        this.form.patchValue({ name });
        this.form.markAsPristine();
        this.manufacture.setManufacture({ ...this.manufacture.manufactureSingnalEvent(), id: this.productionId, name });
        this.message = 'Nombre actualizado.';
      },
      error: response => {
        const errors = response.error?.errors;
        this.nameError = errors ? Object.values(errors).flat().join(' ') : 'No se pudo guardar el nombre. Intenta nuevamente.';
      },
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

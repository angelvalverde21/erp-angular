import { Component, Input, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, finalize, takeUntil } from 'rxjs';
import { ProductionStage, ProductionStageService } from './production-stage.service';

@Component({
  selector: 'app-production-stage-status',
  imports: [FormsModule, NgbDropdownModule],
  templateUrl: './production-stage-status.component.html',
  styleUrl: './production-stage-status.component.scss',
})
export class ProductionStageStatusComponent implements OnDestroy {
  @Input({ required: true }) stage!: Pick<ProductionStage, 'id' | 'name' | 'status'> & Partial<ProductionStage>;
  @Input({ required: true }) productionId = 0;
  @Input() completionAction = false;
  readonly options = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En proceso' },
    { value: 'completed', label: 'Completado' },
  ];
  saving = false;
  reviewing = false;
  quantity: number | null = null;
  error = '';
  private readonly service = inject(ProductionStageService);
  private readonly destroy$ = new Subject<void>();

  get label(): string { return this.options.find(option => option.value === this.stage.status)?.label ?? 'No aplica'; }
  get canComplete(): boolean { return !this.stage.locked && (this.stage.manual_status === true || this.stage.reuses_mold === true || Number(this.stage.purchases_count ?? 0) > 0); }

  complete(menu: NgbDropdown): void {
    this.select('completed', menu);
    if (this.reviewing) menu.open();
  }

  select(status: string, menu: NgbDropdown): void {
    if (this.stage.locked || this.saving || this.stage.revision == null || status === this.stage.status) return;
    if (status === 'completed' && !this.canComplete) return;
    this.error = '';
    this.reviewing = status === 'completed' && this.stage.code === 'samples'
      && (this.stage.sample_review !== 'approved' || !this.stage.sample_quantity);
    if (this.reviewing) { this.quantity = this.stage.sample_quantity ?? null; return; }
    this.save(status, menu);
  }

  save(status: string, menu: NgbDropdown): void {
    if (this.stage.locked || this.saving || this.stage.revision == null || (this.reviewing && (!this.quantity || this.quantity < 1 || !Number.isInteger(this.quantity)))) return;
    if (status === 'completed' && !this.canComplete) return;
    this.saving = true;
    this.error = '';
    const approval = this.reviewing ? { sample_quantity: this.quantity, sample_review: 'approved' } : {};
    this.service.save(this.productionId, this.stage.slug ?? this.stage.id, { status, revision: this.stage.revision, ...approval })
      .pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
        next: response => {
          const updated = { ...response.data, purchases_count: this.stage.purchases_count };
          this.stage = updated;
          this.reviewing = false;
          menu.close();
        },
        error: response => {
          const errors = response.error?.errors;
          this.error = errors ? Object.values(errors).flat().join(' ') : 'No se pudo cambiar el estado. Intenta nuevamente.';
          menu.open();
        },
      });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

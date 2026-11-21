import { Component, EventEmitter, Input, OnChanges, Output, inject, DestroyRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { InventoryReception, InventoryReceptionService } from '../inventory-reception.service';
import { InventoryReceptionPrintComponent } from '../inventory-reception-print/inventory-reception-print.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ReceptionItemRowsPipe } from './reception-item-rows.pipe';

@Component({
  selector: 'app-inventory-reception-index', imports: [DatePipe, FormsModule, InventoryReceptionPrintComponent, NgbTooltipModule, ReceptionItemRowsPipe],
  templateUrl: './inventory-reception-index.component.html', styleUrl: './inventory-reception-index.component.scss',
})
export class InventoryReceptionIndexComponent implements OnChanges {
  @Input({ required: true }) manufactureId = 0;
  @Output() changed = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<InventoryReception>();
  receptions: InventoryReception[] = [];
  loading = false;
  saving = false;
  error = '';
  page = 1;
  lastPage = 1;
  reversingId: number | null = null;
  postingId: number | null = null;
  reason = '';
  private readonly service = inject(InventoryReceptionService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnChanges(): void { this.refresh(); }
  refresh(page = 1): void {
    if (!this.manufactureId) return;
    this.loading = true; this.error = '';
    this.service.list(this.manufactureId, page).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading = false)).subscribe({
      next: response => { this.receptions = response.data; this.page = response.current_page; this.lastPage = response.last_page; },
      error: () => this.error = 'No se pudieron cargar las recepciones. Vuelve a intentarlo.',
    });
  }
  total(reception: InventoryReception): number { return reception.items.reduce((sum, item) => sum + Number(item.quantity), 0); }
  startReversal(id: number): void { this.reversingId = id; this.postingId = null; this.reason = ''; this.error = ''; }
  requestPost(id: number): void { this.postingId = id; this.reversingId = null; this.error = ''; }
  post(reception: InventoryReception): void {
    if (this.saving || this.postingId !== reception.id || reception.status !== 'draft') return;
    this.saving = true; this.error = '';
    this.service.post(this.manufactureId, reception.id, reception.revision).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving = false)).subscribe({
      next: () => { this.postingId = null; this.refresh(this.page); this.changed.emit(); },
      error: response => this.showError(response, 'No se pudo confirmar el ingreso. La recepción guardada se conserva.'),
    });
  }
  reverse(): void {
    if (!this.reversingId || this.reason.trim().length < 5 || this.saving) return;
    this.saving = true; this.error = '';
    this.service.reverse(this.manufactureId, this.reversingId, this.reason.trim()).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving = false)).subscribe({
      next: () => { this.reversingId = null; this.refresh(this.page); this.changed.emit(); },
      error: response => {
        this.showError(response, 'No se pudo revertir la recepción. Intenta nuevamente.');
      },
    });
  }
  private showError(response: any, fallback: string): void {
    const errors = response.error?.errors as Record<string, string[]> | undefined;
    this.error = errors ? Object.values(errors).flat().join(' ') : fallback;
  }
}

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { InventoryReceptionService, ReceptionDraft, InventoryReception } from '../../inventory-receptions/inventory-reception.service';
import { KardexIndexSelectedComponent } from '../kardex-index-selected/kardex-index-selected.component';
import { KardexService } from '../kardex.service';

@Component({
  selector: 'app-kardex-register-in', imports: [KardexIndexSelectedComponent, DecimalPipe, FormsModule],
  templateUrl: './kardex-register-in.component.html', styleUrl: './kardex-register-in.component.scss',
})
export class KardexRegisterInComponent implements OnInit, OnDestroy {
  @Input() variants: any[] = [];
  @Input() kardexable_type = '';
  @Input() kardexable_id = 0;
  @Input() documentReception = false;
  @Input() reception?: InventoryReception;
  @Output() emitKardexes = new EventEmitter<any>();
  @Output() saved = new EventEmitter<InventoryReception>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() saving = new EventEmitter<boolean>();
  variantsKardex: any[] = [];
  initialSelection: any[] = [];
  savedReceipt?: InventoryReception;
  loading = false;
  error = '';
  buttonDisabled = true;
  receivedOn = this.localToday();
  readonly maxDate = this.receivedOn;
  notes = '';
  private requestId = crypto.randomUUID();
  private submittedFingerprint = '';
  private readonly destroy$ = new Subject<void>();

  constructor(private kardex: KardexService, private receptions: InventoryReceptionService) {}

  ngOnInit(): void {
    if (this.reception) {
      this.savedReceipt = this.reception;
      this.receivedOn = this.reception.received_on.slice(0, 10);
      this.notes = this.reception.notes || '';
      this.initialSelection = this.reception.items.map(item => ({ variant_id: item.variant_id, quantity: item.quantity, comment: item.comment }));
      this.receiveKardexVariants(this.initialSelection.map(item => ({ ...item })));
    }
  }
  private localToday(): string {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  get invalidReception(): boolean { return this.documentReception && (!this.receivedOn || this.receivedOn > this.maxDate || this.notes.length > 2000 || this.variantsKardex.some(item => !Number.isInteger(Number(item.quantity)))); }
  get totalQuantity(): number { return this.variantsKardex.reduce((sum, item) => sum + Number(item.quantity), 0); }
  get unsavedChanges(): boolean {
    if (!this.savedReceipt) return true;
    return this.fingerprint(this.draft()) !== this.fingerprint({
      request_id: '', received_on: this.savedReceipt.received_on.slice(0, 10), notes: this.savedReceipt.notes || '',
      items: this.savedReceipt.items.map(item => ({ variant_id: item.variant_id, quantity: item.quantity, comment: item.comment })),
    });
  }
  receiveKardexVariants(variants: any[]): void {
    this.variantsKardex = variants;
    this.buttonDisabled = variants.length === 0;
  }
  private draft(): ReceptionDraft {
    return {
      request_id: this.requestId, received_on: this.receivedOn, notes: this.notes,
      items: this.variantsKardex.map(item => ({ variant_id: Number(item.variant_id), quantity: Number(item.quantity), comment: item.comment })),
    };
  }
  private fingerprint(draft: ReceptionDraft): string {
    return JSON.stringify([draft.received_on, draft.notes || '', [...draft.items].sort((a, b) => a.variant_id - b.variant_id)]);
  }
  registerIn(): void {
    if (this.loading || this.buttonDisabled || this.invalidReception) return;
    if (this.documentReception && this.savedReceipt && (!this.unsavedChanges || this.savedReceipt.status !== 'draft')) return;
    this.loading = true; this.error = ''; this.saving.emit(true);
    const draft = this.draft();
    const fingerprint = this.fingerprint(draft);
    if (this.submittedFingerprint && this.submittedFingerprint !== fingerprint) draft.request_id = this.requestId = crypto.randomUUID();
    this.submittedFingerprint = fingerprint;
    const request = this.documentReception
      ? this.savedReceipt
        ? this.receptions.updateDraft(this.kardexable_id, this.savedReceipt.id, draft, this.savedReceipt.revision)
        : this.receptions.save(this.kardexable_id, draft)
      : this.kardex.batch(this.variantsKardex.map(item => ({
          ...item, direction: 'in', kardexable_type: this.kardexable_type, kardexable_id: this.kardexable_id,
        })));
    request.pipe(takeUntil(this.destroy$), finalize(() => { this.loading = false; this.saving.emit(false); })).subscribe({
      next: (response: any) => {
        if (this.documentReception) { this.savedReceipt = response.data; this.saved.emit(response.data); }
        else this.emitKardexes.emit(response.data);
      },
      error: response => this.showError(response, 'No se pudo guardar la recepción. Las cantidades se mantienen para volver a intentarlo.'),
    });
  }
  private showError(response: any, fallback: string): void {
    const errors = response.error?.errors as Record<string, string[]> | undefined;
    this.error = errors ? Object.values(errors).flat().join(' ') : fallback;
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

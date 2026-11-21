import { Component, Input, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { InventoryReceptionService } from '../inventory-reception.service';

@Component({
  selector: 'app-inventory-reception-print',
  template: `<button type="button" [disabled]="disabled || loading" (click)="print()"><i class="fa-solid" [class.fa-print]="!loading" [class.fa-spinner]="loading" [class.fa-spin]="loading" aria-hidden="true"></i>{{ loading ? 'Preparando hoja…' : 'Imprimir hoja' }}</button>@if (error) { <span role="alert">{{ error }}</span> }`,
  styles: [`:host{display:inline-flex;align-items:center;gap:.5rem;flex-wrap:wrap}button{display:inline-flex;align-items:center;gap:.5rem;min-height:38px;padding:.5rem .8rem;border:1px solid #dce5ee;border-radius:8px;color:#52657d;background:#fff;font-size:.75rem;font-weight:600}button:hover:not(:disabled){background:#f4f6f9}button:focus-visible{outline:2px solid #9cbfae;outline-offset:3px}button:disabled{opacity:.5}@media(max-width:600px){:host{width:100%}button{width:100%;min-height:44px}}span{font-size:.75rem;color:#b34e59}`],
})
export class InventoryReceptionPrintComponent {
  @Input({ required: true }) manufactureId = 0;
  @Input({ required: true }) receptionId = 0;
  @Input() receptionNumber = 0;
  @Input() disabled = false;
  loading = false;
  error = '';
  private readonly service = inject(InventoryReceptionService);

  print(): void {
    if (this.loading || this.disabled || !this.receptionId) return;
    const preview = window.open('', '_blank');
    if (preview) { preview.opener = null; preview.document.title = 'Hoja de recepción'; preview.document.body.textContent = 'Preparando hoja de recepción…'; }
    this.loading = true; this.error = '';
    // Complete the PDF request even if a parent refreshes the receipt list.
    this.service.pdf(this.manufactureId, this.receptionId).pipe(finalize(() => this.loading = false)).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        if (preview && !preview.closed) preview.location.href = url;
        else { const link = document.createElement('a'); link.href = url; link.download = this.receptionNumber ? `recepcion-${this.receptionNumber}.pdf` : 'hoja-recepcion.pdf'; link.click(); }
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      },
      error: () => { preview?.close(); this.error = 'No se pudo generar la hoja. Intenta nuevamente.'; },
    });
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ImportedAttachment } from './imported-order.model';
import { ImportedOrdersService } from './imported-orders.service';

@Component({
  selector: 'app-imported-order-attachment',
  template: `
    <article class="file-card">
      @if (previewUrl) { <button class="preview" type="button" (click)="viewer.showModal()" [attr.aria-label]="'Ampliar ' + file.name"><img [src]="previewUrl" [alt]="file.name" loading="lazy"></button> }
      @else { <div class="placeholder"><i [class]="loading ? 'fa-solid fa-spinner fa-spin' : file.is_image ? 'fa-regular fa-image' : 'fa-regular fa-file-lines'" aria-hidden="true"></i><span>{{ loading ? 'Cargando…' : file.status === 'downloaded' ? 'Documento adjunto' : 'Copia local pendiente' }}</span></div> }
      <div class="file-info"><strong [title]="file.name">{{ file.name }}</strong><small>{{ file.status === 'downloaded' ? 'Respaldo local' : 'Enlace de Shopify disponible' }}</small>
        <div class="actions">@if (file.status === 'downloaded') { <button type="button" (click)="download()" [disabled]="loading"><i class="fa-solid fa-download" aria-hidden="true"></i>Descargar</button> }
          @if (file.remote_url) { <a [href]="file.remote_url" target="_blank" rel="noopener noreferrer">Ver enlace<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a> }
        </div>
        @if (error) { <p role="alert">{{ error }} @if (file.is_image) { <button type="button" (click)="loadPreview()">Reintentar</button> }</p> }
      </div>
    </article>
    <dialog #viewer aria-label="Imagen adjunta"><div class="dialog-bar"><strong>{{ file.name }}</strong><button type="button" (click)="viewer.close()" aria-label="Cerrar imagen"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>@if (previewUrl) { <img [src]="previewUrl" [alt]="file.name"> }</dialog>
  `,
  styles: `:host{display:block;min-width:0}.file-card{border:1px solid #dce3ee;border-radius:8px;overflow:hidden;background:#fff}.preview{border:0;display:block;background:#f4f6fb;width:100%;height:145px;padding:.4rem;cursor:zoom-in}.preview img{width:100%;height:100%;object-fit:contain}.placeholder{height:110px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.6rem;background:#f5f7fb;color:#899bb5;font-size:.7rem}.placeholder i{font-size:1.6rem}.file-info{padding:.7rem}.file-info strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.7rem;color:#405776}.file-info small{font-size:.64rem;color:#8997aa}.actions{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:.65rem}button,a{font:inherit}.actions button,.actions a,p button{display:inline-flex;align-items:center;gap:.35rem;border:0;padding:0;background:none;color:#4669a7;font-size:.65rem;text-decoration:none;cursor:pointer}.actions button:disabled{opacity:.5}p{color:#a46c28;font-size:.65rem;margin:.6rem 0 0}dialog{max-width:90vw;max-height:90vh;border:1px solid #dce3ee;border-radius:12px;padding:0;color:#304866}dialog::backdrop{background:#15263bc9}dialog>img{display:block;max-width:88vw;max-height:78vh;object-fit:contain;margin:auto}.dialog-bar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem;font-size:.8rem}.dialog-bar button{background:#f1f4fa;border:0;border-radius:6px;padding:.4rem .65rem;color:#405776}button:focus-visible,a:focus-visible{outline:2px solid #4669a7;outline-offset:3px}`,
})
export class ImportedOrderAttachmentComponent implements OnInit, OnDestroy {
  @Input({ required: true }) orderId!: number;
  @Input({ required: true }) file!: ImportedAttachment;
  loading = false;
  error = '';
  previewUrl = '';
  private blob: Blob | null = null;
  private readonly destroy$ = new Subject<void>();
  constructor(private service: ImportedOrdersService) {}
  ngOnInit(): void { if (this.file.is_image && this.file.status === 'downloaded') this.loadPreview(); }
  loadPreview(): void {
    if (this.loading || this.previewUrl) return;
    this.loading = true; this.error = '';
    this.service.attachment(this.orderId, this.file.id).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: blob => { this.blob = blob; this.previewUrl = URL.createObjectURL(blob); },
      error: () => this.error = 'No se pudo cargar la imagen.',
    });
  }
  download(): void {
    if (this.blob) { this.save(this.blob); return; }
    if (this.loading) return;
    this.loading = true; this.error = '';
    this.service.attachment(this.orderId, this.file.id).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({ next: blob => this.save(blob), error: () => this.error = 'No se pudo descargar el archivo.' });
  }
  private save(blob: Blob): void {
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = this.file.name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); if (this.previewUrl) URL.revokeObjectURL(this.previewUrl); }
}

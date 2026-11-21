import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject, catchError, finalize, from, map, mergeMap, of, takeUntil } from 'rxjs';
import { ProductionStageService } from '../../../dashboard/manufactures/productions/production-stages/production-stage.service';
import { PurchaseService } from '../../../dashboard/purchases/purchase.service';

export interface StageAttachment { id: number; name: string; size: number; created_at: string; mime_type?: string | null; }

@Component({
  selector: 'app-record-attachments, app-production-stage-attachments, app-purchase-attachments',
  imports: [DatePipe],
  template: `
    <section class="attachments" aria-labelledby="stage-files-heading">
      <header><div><h3 id="stage-files-heading"><i class="fa-solid fa-paperclip" aria-hidden="true"></i> {{ purchaseId ? 'Archivos adjuntos' : 'Archivos de la etapa' }}</h3><p>{{ purchaseId ? 'Adjunta fotos, PDF y otros archivos de esta compra.' : 'Guarda moldes, fichas técnicas y documentos de esta etapa.' }}</p></div>
        <button type="button" class="btn btn-secondary" [disabled]="loading || uploading || loadFailed" (click)="picker.click()"><i class="fa-solid fa-upload" aria-hidden="true"></i> {{ uploading ? 'Subiendo…' : 'Adjuntar archivo' }}</button>
        <input #picker class="visually-hidden" type="file" tabindex="-1" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.jpg,.jpeg,.png,.webp,.gif,.dxf,.ai,.psd" (change)="upload(picker)">
      </header>
      <p class="hint">Imágenes, PDF, Word, PowerPoint, Excel, ZIP y archivos de diseño. Máximo 10 MB por archivo.</p>
      @if (error) { <p class="file-error" role="alert">{{ error }}</p> }
      @if (message) { <p class="file-message" role="status">{{ message }}</p> }
      @if (loading) { <p role="status">Cargando archivos…</p> }
      @else if (loadFailed) { <button type="button" class="btn btn-outline-secondary" (click)="load()">Reintentar</button> }
      @else {
        @if (previewUrl) {
          <figure><button type="button" class="preview-close btn btn-outline-secondary" (click)="clearPreview()" aria-label="Cerrar vista previa"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button><img [src]="previewUrl" [alt]="previewName"><figcaption>{{ previewName }}</figcaption></figure>
        }
        <ul class="attachment-grid">
          @for (file of files; track file.id) {
            <li class="attachment-card">
              @if (purchaseId && isImage(file)) {
                <button type="button" class="attachment-preview" (click)="preview(file)" [attr.aria-label]="'Ver foto ' + file.name">
                  @if (thumbnailUrls[file.id]) { <img [src]="thumbnailUrls[file.id]" [alt]="file.name"> }
                  @else { <i class="fa-regular fa-image" aria-hidden="true"></i><small>{{ thumbnailErrors[file.id] ? 'Vista previa no disponible' : 'Cargando imagen…' }}</small> }
                </button>
              } @else {
                <div class="attachment-preview attachment-document" [attr.data-format]="format(file)"><i [class]="fileIcon(file)" aria-hidden="true"></i><small>{{ format(file) }}</small></div>
              }
              <div class="attachment-info"><strong>{{ file.name }}</strong><small>{{ size(file.size) }} · {{ file.created_at | date:'dd/MM/yyyy' }}</small></div>
              <button type="button" class="btn btn-outline-secondary attachment-download" [disabled]="downloading === file.id" (click)="download(file)" [attr.aria-label]="'Descargar ' + file.name"><i class="fa-solid fa-download" aria-hidden="true"></i> Descargar</button>
            </li>
          } @empty { <li class="empty">{{ purchaseId ? 'Todavía no hay archivos en esta compra.' : 'Todavía no hay archivos adjuntos en esta etapa.' }}</li> }
        </ul>
      }
    </section>
  `,
  styles: `
    :host { display: block; }
    .attachments { padding: 20px 24px; border: 1px solid var(--cui-border-color, #dce2ea); border-radius: 12px; background: var(--cui-body-bg, #fff); font-size: 14px; }
    header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    h3 { display: flex; gap: 8px; margin: 0; font-size: 16px; font-weight: 600; }
    p { margin: 8px 0 0; color: var(--cui-secondary-color, #64748b); }
    .hint, small { font-size: 12px; color: var(--cui-secondary-color, #64748b); }
    .attachment-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; list-style: none; padding: 0; margin: 16px 0 0; }
    .attachment-card { display: flex; flex-direction: column; min-width: 0; border: 1px solid var(--cui-border-color, #dce2ea); border-radius: 10px; overflow: hidden; }
    .attachment-preview { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; width: 100%; height: 140px; padding: 0; border: 0; border-bottom: 1px solid var(--cui-border-color, #dce2ea); border-radius: 0; background: var(--cui-tertiary-bg, #f3f4f8); color: var(--cui-secondary-color, #64748b); }
    .attachment-preview img { display: block; width: 100%; height: 100%; object-fit: contain; } .attachment-preview > i { font-size: 38px; }
    .attachment-document[data-format='PDF'] { color: #b42318; } .attachment-document[data-format='Word'] { color: #245ba6; } .attachment-document[data-format='PowerPoint'] { color: #b64d24; } .attachment-document[data-format='Excel'] { color: #247452; }
    .attachment-info { padding: 12px; } .attachment-info strong { display: block; font-size: 13px; font-weight: 500; overflow-wrap: anywhere; } .attachment-info small { display: block; margin-top: 6px; }
    .attachment-download { margin: auto 12px 12px; } .empty { grid-column: 1 / -1; padding: 24px 0; }
    button { min-height: 44px; font-size: 13px; } .file-error { color: #b42318; } .file-message { color: #247452; } .empty { color: var(--cui-secondary-color, #64748b); }
    figure { position: relative; margin: 16px 0; padding: 16px; border: 1px solid var(--cui-border-color, #dce2ea); border-radius: 10px; text-align: center; } figure img { display: block; max-width: 100%; max-height: 360px; margin: auto; object-fit: contain; } figcaption { margin-top: 10px; overflow-wrap: anywhere; font-size: 13px; } .preview-close { position: absolute; top: 8px; right: 8px; background: var(--cui-body-bg, #fff); }
    @media(max-width: 575.98px) { .attachments { padding: 16px; } .attachment-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); } }
  `,
})
export class RecordAttachmentsComponent implements OnChanges, OnDestroy {
  @Input() productionId = 0;
  @Input() stageId = 0;
  @Input() purchaseId = 0;
  @Output() filesChange = new EventEmitter<StageAttachment[]>();
  @Output() busyChange = new EventEmitter<boolean>();
  files: StageAttachment[] = [];
  loading = false;
  uploading = false;
  downloading: number | null = null;
  error = '';
  message = '';
  loadFailed = false;
  previewUrl = '';
  previewName = '';
  previewing: number | null = null;
  thumbnailUrls: Record<number, string> = {};
  thumbnailErrors: Record<number, boolean> = {};
  private borrowedPreview = false;
  private readonly service = inject(ProductionStageService);
  private readonly purchaseService = inject(PurchaseService);
  private readonly stop$ = new Subject<void>();
  ngOnChanges(): void { this.stop$.next(); this.uploading = false; this.downloading = null; this.message = ''; this.load(); }
  load(): void {
    this.stop$.next(); this.clearMedia();
    this.loading = true; this.error = ''; this.loadFailed = false; this.files = [];
    (this.purchaseId ? this.purchaseService.attachments(this.purchaseId) : this.service.attachments(this.productionId, this.stageId)).pipe(takeUntil(this.stop$), finalize(() => this.loading = false)).subscribe({
      next: response => { this.files = response.data; this.filesChange.emit([...this.files]); this.loadThumbnails(this.files); },
      error: () => { this.loadFailed = true; this.error = 'No se pudieron cargar los archivos.'; },
    });
  }
  size(bytes: number): string { return bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`; }
  upload(picker: HTMLInputElement): void {
    const file = picker.files?.[0]; picker.value = '';
    if (!file || this.uploading) return;
    this.error = ''; this.message = '';
    if (file.size > 10 * 1024 * 1024) { this.error = 'El archivo supera el máximo de 10 MB.'; return; }
    this.uploading = true; this.busyChange.emit(true);
    (this.purchaseId ? this.purchaseService.uploadAttachment(this.purchaseId, file) : this.service.uploadAttachment(this.productionId, this.stageId, file)).pipe(takeUntil(this.stop$), finalize(() => { this.uploading = false; this.busyChange.emit(false); })).subscribe({
      next: response => { this.files = [response.data, ...this.files]; this.message = 'Archivo guardado correctamente.'; this.filesChange.emit([...this.files]); this.loadThumbnails([response.data]); },
      error: response => this.error = response.error?.errors?.file?.join(' ') || 'No se pudo subir el archivo. Intenta nuevamente.',
    });
  }
  download(file: StageAttachment): void {
    this.downloading = file.id; this.error = '';
    (this.purchaseId ? this.purchaseService.downloadAttachment(this.purchaseId, file.id) : this.service.downloadAttachment(this.productionId, this.stageId, file.id)).pipe(takeUntil(this.stop$), finalize(() => this.downloading = null)).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = file.name; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      error: () => this.error = 'No se pudo descargar el archivo.',
    });
  }
  isImage(file: StageAttachment): boolean { return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mime_type ?? ''); }
  clearPreview(): void { if (this.previewUrl && !this.borrowedPreview) URL.revokeObjectURL(this.previewUrl); this.previewUrl = ''; this.previewName = ''; this.previewing = null; this.borrowedPreview = false; }
  preview(file: StageAttachment): void {
    if (!this.purchaseId || !this.isImage(file)) return;
    if (this.thumbnailUrls[file.id]) { this.clearPreview(); this.previewUrl = this.thumbnailUrls[file.id]; this.previewName = file.name; this.borrowedPreview = true; return; }
    if (this.previewing !== null) return;
    this.previewing = file.id; this.error = '';
    this.purchaseService.previewAttachment(this.purchaseId, file.id).pipe(takeUntil(this.stop$), finalize(() => this.previewing = null)).subscribe({
      next: blob => { this.clearPreview(); this.previewUrl = URL.createObjectURL(blob); this.previewName = file.name; },
      error: () => this.error = 'No se pudo cargar la foto.',
    });
  }
  private loadThumbnails(files: StageAttachment[]): void {
    if (!this.purchaseId) return;
    from(files.filter(file => this.isImage(file) && !this.thumbnailUrls[file.id])).pipe(
      mergeMap(file => this.purchaseService.previewAttachment(this.purchaseId, file.id).pipe(map(blob => ({ file, blob })), catchError(() => of({ file, blob: null }))), 3),
      takeUntil(this.stop$),
    ).subscribe(({ file, blob }) => {
      if (blob) this.thumbnailUrls = { ...this.thumbnailUrls, [file.id]: URL.createObjectURL(blob) };
      else this.thumbnailErrors = { ...this.thumbnailErrors, [file.id]: true };
    });
  }
  private clearMedia(): void {
    this.clearPreview(); Object.values(this.thumbnailUrls).forEach(url => URL.revokeObjectURL(url)); this.thumbnailUrls = {}; this.thumbnailErrors = {};
  }
  format(file: StageAttachment): string {
    if (this.isImage(file)) return 'Imagen';
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (extension === 'pdf') return 'PDF';
    if (['doc', 'docx'].includes(extension)) return 'Word';
    if (['ppt', 'pptx'].includes(extension)) return 'PowerPoint';
    if (['xls', 'xlsx', 'csv'].includes(extension)) return 'Excel';
    return extension.toUpperCase() || 'Archivo';
  }
  fileIcon(file: StageAttachment): string {
    const icons: Record<string, string> = { PDF: 'fa-file-pdf', Word: 'fa-file-word', PowerPoint: 'fa-file-powerpoint', Excel: 'fa-file-excel', ZIP: 'fa-file-zipper', Imagen: 'fa-image' };
    return 'fa-regular ' + (icons[this.format(file)] || 'fa-file-lines');
  }
  ngOnDestroy(): void { this.stop$.next(); this.stop$.complete(); this.clearMedia(); }
}

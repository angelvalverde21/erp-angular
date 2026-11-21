import { Component, DestroyRef, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PhotoSessionUploadService, PhotoUploadTask } from '../photo-session-upload.service';
import { PhotoSessionService } from '../photo-session.service';
import { PHOTO_ASSET_CATEGORIES, photoFileSize, photoSessionError } from '../photo-session.model';

@Component({
  selector: 'app-photo-session-upload', templateUrl: './photo-session-upload.component.html',
  styleUrls: ['../photo-session.scss', './photo-session-upload.component.scss'],
})
export class PhotoSessionUploadComponent {
  @Input({ required: true }) sessionId!: number;
  @Input() configured = false;
  @Input() maxBytes = 100 * 1024 ** 3;
  @Input() embedded = false;
  @Output() completed = new EventEmitter<void>();
  @Output() uploading = new EventEmitter<boolean>();
  readonly categories = PHOTO_ASSET_CATEGORIES;
  readonly size = photoFileSize;
  private readonly uploader = inject(PhotoSessionUploadService);
  private readonly api = inject(PhotoSessionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly active = new Map<PhotoUploadTask, AbortController>();
  private destroyed = false;
  tasks: PhotoUploadTask[] = [];
  category = 'original';
  busy = false;
  dragging = false;
  error = '';

  constructor() {
    this.destroyRef.onDestroy(() => { this.destroyed = true; this.active.forEach(controller => controller.abort()); });
  }
  @HostListener('window:beforeunload', ['$event']) beforeUnload(event: BeforeUnloadEvent): void {
    if (this.busy) { event.preventDefault(); event.returnValue = ''; }
  }
  select(event: Event): void {
    const input = event.target as HTMLInputElement; this.add(Array.from(input.files || [])); input.value = '';
  }
  drop(event: DragEvent): void { event.preventDefault(); this.dragging = false; this.add(Array.from(event.dataTransfer?.files || [])); }
  private add(files: File[]): void {
    if (!this.configured) return;
    this.error = '';
    for (const file of files) {
      if (!file.size || file.size > this.maxBytes) { this.error = `El archivo ${file.name} supera el límite de ${this.size(this.maxBytes)} o está vacío.`; continue; }
      if (!/\.(jpe?g|png|webp|avif|heic|heif|tiff?|dng|cr[23]|nef|arw|rw2|raf|orf|mp4|mov|m4v|webm|avi|mkv|mxf)$/i.test(file.name)) { this.error = `Formato no admitido: ${file.name}`; continue; }
      this.tasks.push({ file, category: this.category, state: 'waiting', progress: 0, nextPart: 1 });
    }
    void this.process();
  }
  retry(task: PhotoUploadTask): void { task.state = 'waiting'; task.error = ''; void this.process(); }
  clear(): void { this.tasks = this.tasks.filter(task => !['ready', 'cancelled'].includes(task.state)); }
  cancel(task: PhotoUploadTask): void {
    if (this.active.has(task)) this.active.get(task)!.abort();
    else task.state = 'cancelled';
  }
  private async process(): Promise<void> {
    if (this.busy || this.destroyed || !this.tasks.some(task => task.state === 'waiting')) return;
    this.busy = true; this.uploading.emit(true);
    try {
      await Promise.all([this.worker(), this.worker()]);
    } finally { this.busy = false; if (!this.destroyed) this.uploading.emit(false); }
  }

  private async worker(): Promise<void> {
    while (!this.destroyed) {
      const task = this.tasks.find(item => item.state === 'waiting');
      if (!task) return;
      const controller = new AbortController();
      this.active.set(task, controller); task.state = 'uploading';
      try {
        await this.uploader.upload(this.sessionId, task, controller.signal);
        task.state = 'ready'; if (!this.destroyed) this.completed.emit();
      } catch (error) {
        if (controller.signal.aborted) {
          task.state = 'cancelled';
          if (task.plan && !task.originalReady) {
            try { await firstValueFrom(this.api.abort(this.sessionId, task.plan.id)); }
            catch { task.error = 'La carga se detuvo. Quedaron partes pendientes de limpieza en B2.'; }
          }
          if (task.originalReady && !this.destroyed) this.completed.emit();
        } else {
          task.state = 'error';
          task.error = `${task.originalReady ? 'Original guardado. No se pudo terminar la vista previa. ' : ''}${error instanceof Error ? error.message : photoSessionError(error)}`;
          if (task.originalReady && !this.destroyed) this.completed.emit();
        }
      } finally { this.active.delete(task); }
    }
  }

  taskLabel(task: PhotoUploadTask): string {
    if (task.state !== 'uploading') return { waiting: 'En espera', ready: 'Guardado en B2', error: 'Carga interrumpida', cancelled: 'Detenida' }[task.state];
    if (task.phase === 'uploading') return `Subiendo original ${task.progress}%`;
    return { preparing: 'Preparando carga…', verifying: 'Verificando original…', previews: 'Generando vistas previas…',
      uploading_previews: 'Subiendo vistas previas…', finishing: 'Verificando vistas previas…' }[task.phase || 'preparing'];
  }
}

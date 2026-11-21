import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PhotoSessionService } from './photo-session.service';
import { PhotoUploadPlan } from './photo-session.model';
import { photoPreviews } from './photo-session-previews';

export interface PhotoUploadTask {
  file: File; category: string; progress: number; state: 'waiting' | 'uploading' | 'ready' | 'error' | 'cancelled';
  plan?: PhotoUploadPlan; nextPart: number; originalReady?: boolean; error?: string;
  phase?: 'preparing' | 'uploading' | 'verifying' | 'previews' | 'uploading_previews' | 'finishing';
}

@Injectable({ providedIn: 'root' })
export class PhotoSessionUploadService {
  private readonly api = inject(PhotoSessionService);

  async upload(session: number, task: PhotoUploadTask, signal: AbortSignal): Promise<void> {
    task.phase = 'preparing';
    task.plan ??= (await firstValueFrom(this.api.beginUpload(session, task.file, task.category))).data;
    const plan = task.plan;
    for (let part = task.nextPart; part <= plan.parts && !task.originalReady; part++) {
      signal.throwIfAborted();
      const start = (part - 1) * plan.part_bytes;
      // Slice streams one part; never read the whole RAW/video into memory.
      const chunk = task.file.slice(start, Math.min(task.file.size, start + plan.part_bytes));
      for (let attempt = 0; ; attempt++) {
        try {
          const { data } = await firstValueFrom(this.api.part(session, plan.id, part));
          task.phase = 'uploading';
          await this.put(data.url, chunk, signal, bytes => task.progress = Math.min(100, Math.round((start + bytes) / task.file.size * 100)), data.headers);
          break;
        } catch (error) { if (signal.aborted || attempt >= 2) throw error; }
      }
      task.nextPart = part + 1;
    }
    signal.throwIfAborted();
    task.phase = 'verifying';
    if (!task.originalReady) { await firstValueFrom(this.api.complete(session, plan.id)); task.originalReady = true; }
    // Unsupported RAW/HEIC/video formats retain the original and show a file icon.
    let previews: Awaited<ReturnType<typeof photoPreviews>> = [];
    task.phase = 'previews';
    try { previews = await photoPreviews(task.file); } catch { /* Original remains available without a preview. */ }
    if (previews.length) {
      signal.throwIfAborted();
      task.phase = 'uploading_previews';
      const { data } = await firstValueFrom(this.api.previewBatch(session, plan.id, previews.map(preview => ({ size: preview.size, bytes: preview.blob.size }))));
      const results = await Promise.allSettled(previews.map(async preview => {
        const target = data.uploads.find(upload => upload.size === preview.size);
        if (!target) throw new Error('No se pudo preparar la vista previa.');
        return this.put(target.url, preview.blob, signal, () => {}, { 'Content-Type': 'image/webp' });
      }));
      const failed = results.find((result): result is PromiseRejectedResult => result.status === 'rejected');
      if (failed) throw failed.reason;
      signal.throwIfAborted();
      task.phase = 'finishing';
      await firstValueFrom(this.api.confirmPreviews(session, plan.id));
    }
    task.progress = 100;
  }

  private put(url: string, blob: Blob, signal: AbortSignal, progress: (bytes: number) => void, headers: Record<string, string> = {}): Promise<void> {
    signal.throwIfAborted();
    // Raw XHR intentionally bypasses ERP interceptors: never send the ERP bearer to B2.
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const abort = () => xhr.abort();
      signal.addEventListener('abort', abort, { once: true });
      const cleanup = () => signal.removeEventListener('abort', abort);
      xhr.open('PUT', url);
      for (const [name, value] of Object.entries(headers)) xhr.setRequestHeader(name, value);
      xhr.upload.onprogress = event => progress(event.loaded);
      xhr.onload = () => { cleanup(); xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('B2 rechazó la carga. Revisa la conexión y los permisos.')); };
      xhr.onerror = () => { cleanup(); reject(new Error('No se pudo conectar con B2. Revisa la conexión y la configuración CORS.')); };
      xhr.onabort = () => { cleanup(); reject(new DOMException('Carga cancelada', 'AbortError')); };
      xhr.send(blob);
    });
  }
}

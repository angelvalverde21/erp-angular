//Este componente se encarga de subir imágenes y mostrarlas en una lista (su contenedor natural es el componente ImageIndexComponent)

import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImageService } from '../image.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    NgxDropzoneModule,
    FontAwesomeModule
  ],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnDestroy {

  images: File[] = [];
  faFileCirclePlus = faFileCirclePlus;

  @Output() emitImagesUpload = new EventEmitter<any>();
  

  @Input() imageable_type: string = '';
  @Input() imageable_id: number = 0;
  @Input() acceptedFiles = 'image/*';
  @Input() maxFileSize = Number.MAX_SAFE_INTEGER;
  uploading = false;
  private destroyed = false;
  error = '';

  destroy$ = new Subject<void>();

  constructor(private _image: ImageService) {}

  // Cada vez que se agregan archivos
  onSelect(event: any) {
    this.error = event.rejectedFiles?.length ? 'Hay archivos con formato o tamaño no permitido.' : '';
    this.images.push(...event.addedFiles);

    // Subir todos los archivos automáticamente
    this.uploadAll();
  }

  // Eliminar un archivo de la lista
  onRemove(file: any) {
    this.images = this.images.filter(f => f !== file);
    console.log("Archivo eliminado");
  }

  // Subida automática de todos los archivos en un solo POST
  private uploadAll() {
    if (this.images.length === 0 || this.uploading || this.destroyed) return;
    this.uploading = true;
    const batch = [...this.images];
    let succeeded = false;

    const data = new FormData();

    // Todos los archivos
    batch.forEach(file => data.append('images[]', file));

    // Campos polimórficos
    data.append('imageable_type', this.imageable_type);
    data.append('imageable_id', this.imageable_id.toString());

    // Llamada al servicio
    this._image.store(data)
      .pipe(takeUntil(this.destroy$), finalize(() => {
        this.uploading = false;
        if (succeeded && this.images.length) this.uploadAll();
      }))
      .subscribe({
        next: (resp: any) => {
          succeeded = true;
          this.images = this.images.filter(file => !batch.includes(file));
          this.emitImagesUpload.emit(resp.data);
        },
        error: (error: any) => {
          this.error = error?.error?.errors ? Object.values(error.error.errors).flat().join(' ') : error?.error?.message || 'No se pudieron subir las imágenes. Vuelve a intentarlo.';
        }
      });
  }

  retry(): void { this.error = ''; this.uploadAll(); }
  ngOnDestroy(): void {
    this.destroyed = true;
    this.destroy$.next();
    this.destroy$.complete();
  }

}

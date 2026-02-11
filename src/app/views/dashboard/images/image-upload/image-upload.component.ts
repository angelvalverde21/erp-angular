//Este componente se encarga de subir imágenes y mostrarlas en una lista (su contenedor natural es el componente ImageIndexComponent)

import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImageService } from '../image.service';
import { Subject, takeUntil } from 'rxjs';
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

  destroy$ = new Subject<void>();

  constructor(private _image: ImageService) {}

  // Cada vez que se agregan archivos
  onSelect(event: any) {
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
    if (this.images.length === 0) return;

    const data = new FormData();

    // Todos los archivos
    this.images.forEach(file => data.append('images[]', file));

    // Campos polimórficos
    data.append('imageable_type', this.imageable_type);
    data.append('imageable_id', this.imageable_id.toString());

    // Llamada al servicio
    this._image.store(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          console.log('Todos los archivos subidos correctamente', resp);
          this.images = []; // limpiar lista después de subir
          this.emitImagesUpload.emit(resp.data);
        },
        error: (error: any) => {
          console.error('Error subiendo archivos', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

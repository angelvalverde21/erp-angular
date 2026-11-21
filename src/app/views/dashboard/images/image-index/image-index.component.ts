//Este componente se encarga de subir imágenes y mostrarlas en una lista
import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { ImageIndexRowComponent } from '../image-index-row/image-index-row.component';
import { ImageIndexRowComponent } from '../image-index-row/image-index-row.component';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ImageService } from '../image.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';

@Component({
  selector: 'app-image-index',
  imports: [
    ImageIndexRowComponent,
    ImageUploadComponent,
    ImagePreviewComponent
  ],
  templateUrl: './image-index.component.html',
  styleUrl: './image-index.component.scss'
})
export class ImageIndexComponent {

  @Input() images: any[] = [];
  @Input() showUpload = true;
  @Input() allowRemove = true;
  @Input() layout: 'table' | 'grid' = 'table';
  @Input() acceptedFiles = 'image/*';
  @Input() maxFileSize = Number.MAX_SAFE_INTEGER;
  @Input() previewVariant: 'medium' | 'large' = 'medium';
  @Input() imageable_type: string = '';
  @Input() imageable_id: number = 0;

  @Output() emitImagePreview = new EventEmitter<any>();
  @Output() imagesChange = new EventEmitter<any[]>();

  constructor(
    private _image: ImageService
  ) {

  }

  loading: boolean = false;
  removingImageId: number | null = null;
  error = '';

  onRemoveImage(image_id: number) {
    if (!this.allowRemove || this.loading) return;

    const body = {
      imageable_type: this.imageable_type,
      imageable_id: this.imageable_id
    };

    this.loading = true;
    this.removingImageId = image_id;
    this.error = '';
    // Handle the image removal logic here

    this._image.destroy(image_id, body).pipe(takeUntil(this.destroy$), finalize(() => {
      this.loading = false;
      this.removingImageId = null;
    })).subscribe({

      next: (resp: any) => {
        // const image = resp.data;
        this.images = this.images.filter((image: any) => image.id !== image_id);
        this.imagesChange.emit(this.images);
      },

      error: (error: any) => {
        this.error = 'No se pudo eliminar la imagen. Inténtalo nuevamente.';
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveImagesUpload(images: any) {

    // Agregar las nuevas imágenes al inicio
    this.images = [...images, ...(this.images ?? [])];
    this.imagesChange.emit(this.images);


    // Emitir la primera imagen para previsualización
    this.emitImagePreview.emit(this.images[0]);
  }

}

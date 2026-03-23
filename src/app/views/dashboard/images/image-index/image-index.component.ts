//Este componente se encarga de subir imágenes y mostrarlas en una lista
import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { ImageIndexRowComponent } from '../image-index-row/image-index-row.component';
import { ImageIndexRowComponent } from '../image-index-row/image-index-row.component';
import { Subject, takeUntil } from 'rxjs';
import { ImageService } from '../image.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

@Component({
  selector: 'app-image-index',
  imports: [
    ImageIndexRowComponent,
    ImageUploadComponent
  ],
  templateUrl: './image-index.component.html',
  styleUrl: './image-index.component.scss'
})
export class ImageIndexComponent {

  @Input() images: any;
  @Input() imageable_type: string = '';
  @Input() imageable_id: number = 0;

  @Output() emitImagePreview = new EventEmitter<any>();

  constructor(
    private _image: ImageService
  ) {

  }

  loading: boolean = false;

  onRemoveImage(image_id: number) {

    const body = {
      imageable_type: this.imageable_type,
      imageable_id: this.imageable_id
    };

    this.loading = true;
    // Handle the image removal logic here

    this._image.destroy(image_id, body).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        // const image = resp.data;
        this.loading = false;
        this.images = this.images.filter((image: any) => image.id !== image_id);
      },

      error: (error: any) => {
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveImagesUpload(images: any) {
    console.log("Imágenes recibidas", images);

    // Agregar las nuevas imágenes al inicio
    this.images = [...images, ...this.images];

    console.log("Primera imagen ahora:", this.images[0]);

    // Emitir la primera imagen para previsualización
    this.emitImagePreview.emit(this.images[0]);
  }

}

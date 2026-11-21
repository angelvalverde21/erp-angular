import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageIndexComponent } from '../../../images/image-index/image-index.component';
import { PhotoReferenceImage } from '../photo-contact.model';

@Component({
  selector: 'app-photo-model-image-index', imports: [ImageIndexComponent], styleUrl: '../../photo-session.scss',
  template: `<section class="panel" id="reference-images" aria-label="Galería referencial del modelo">
    <header class="panel-header"><div><h2><i class="fa-solid fa-images" aria-hidden="true"></i>Imágenes referenciales</h2><p>Retratos, cuerpo completo y referencias de trabajos anteriores. JPG, PNG o WebP · Hasta 10 MB por imagen.</p></div></header>
    <div class="panel-body"><app-image-index [images]="images" (imagesChange)="imagesChange.emit($event)" imageable_type="photo_model" [imageable_id]="modelId" layout="grid" previewVariant="large" acceptedFiles="image/jpeg,image/png,image/webp" [maxFileSize]="10485760" /></div>
  </section>`,
})
export class PhotoModelImageIndexComponent {
  @Input({ required: true }) modelId!: number;
  @Input() images: PhotoReferenceImage[] = [];
  @Output() imagesChange = new EventEmitter<PhotoReferenceImage[]>();
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImagePreviewComponent } from 'src/app/views/shared/components/image-preview/image-preview.component';

@Component({
  selector: 'tr[app-image-index-row]',
  imports: [
    ImagePreviewComponent
  ],
  templateUrl: './image-index-row.component.html',
  styleUrl: './image-index-row.component.scss'
})
export class ImageIndexRowComponent {

  @Input() image: any;
  @Input() allowRemove = true;
  @Input() disabled = false;
  @Input() removing = false;
  @Input() imageable_type: string = '';
  @Input() imageable_id: number = 0;

  @Output() emitRemoveImage = new EventEmitter<number>();
  
  get format(): string {
    const extension = String(this.image?.name ?? '').split('.').pop()?.toUpperCase() ?? '';
    return ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF', 'SVG'].includes(extension) ? extension : 'Imagen';
  }

  removeImage(image_id: number = 0){
    if (this.disabled) return;
    this.emitRemoveImage.emit(image_id);
  }
  
}

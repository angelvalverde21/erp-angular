import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ButtonTrashComponent } from '@buttons/button-trash/button-trash.component';

@Component({
  selector: 'tr[app-image-index-row]',
  imports: [
    LoadingComponent,  
    ButtonTrashComponent
  ],
  templateUrl: './image-index-row.component.html',
  styleUrl: './image-index-row.component.scss'
})
export class ImageIndexRowComponent {

  @Input() image: any;
  @Input() imageable_type: string = '';
  @Input() imageable_id: number = 0;

  @Output() emitRemoveImage = new EventEmitter<number>();
  
  loading: boolean = false;

  removeImage(image_id: number = 0){
    this.loading = true;
    this.emitRemoveImage.emit(image_id);
  }
  
}

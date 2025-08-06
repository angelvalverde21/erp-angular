import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ImageService } from './image.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image',
  imports: [FontAwesomeModule, LoadingComponent, CommonModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent {
  faUpDownLeftRight = faUpDownLeftRight;
  faTrash = faTrash;
  @Input() image: any;
  loading: boolean = false;

  @Output() imageIdDelete = new EventEmitter<number>();

  constructor(private _image: ImageService) {}

  borrarImage(id: number) {
    console.log('Borrando imagen con ID:', id);

    this.loading = true;
    // this.images = this.images.filter((image) => image.id !== id);/

    this._image.destroy(id).subscribe((resp: any) => {
      console.log(resp);
      this.loading = false;
      if (resp.success) {
        console.log(resp);
        this.imageIdDelete.emit(id);
        // this.images = this.images.filter((image) => image.id !== id);
      }
    });
  }
}

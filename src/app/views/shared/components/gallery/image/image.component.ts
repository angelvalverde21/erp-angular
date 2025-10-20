import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import { LoadingComponent } from '../../loading/loading.component';
import { ImageService } from './image.service';
import { LightboxModule, Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-image',
  imports: [FontAwesomeModule, LoadingComponent, LightboxModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  providers: [Lightbox]
})
export class ImageComponent implements OnInit {
  faUpDownLeftRight = faUpDownLeftRight;
  faTrash = faTrash;
  @Input() image: any;
  album: any;
  loading: boolean = false;

  @Output() imageIdDelete = new EventEmitter<number>();

  constructor(private _image: ImageService, private _lightbox: Lightbox) {

  }
  ngOnInit(): void {
    const src = this.image.url_large;
    const caption = 'Image';
    const thumb = this.image.url_thumbail;
    this.album = [{
      src: src,
      caption: caption,
      thumb: thumb,
    }];
  }

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

  open(): void {
    // open lightbox
    this._lightbox.open(this.album, 0);
  }
}

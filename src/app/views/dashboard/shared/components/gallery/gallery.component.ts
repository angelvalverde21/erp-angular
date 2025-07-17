import { Component, Input, OnInit } from '@angular/core';
import { UploadDropzoneComponent } from '../../upload-dropzone/upload-dropzone.component';
import { SizesComponent } from '../../../products/product-edit-page/product-colors/sizes/sizes.component';
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { ButtonAddComponent } from '../buttons/button-add/button-add.component';
@Component({
  selector: 'app-gallery',
  imports: [UploadDropzoneComponent, SizesComponent, NgbCarouselModule, CommonModule, ButtonAddComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {

  @Input() path: string = 'products/colors/store';

	images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

	constructor(config: NgbCarouselConfig) {
		// customize default values of carousels used by this component tree
		config.interval = 10000;
		config.pauseOnHover = false;
	}

  ngOnInit(): void {
    // Aquí puedes realizar cualquier inicialización adicional si es necesario
  }
}

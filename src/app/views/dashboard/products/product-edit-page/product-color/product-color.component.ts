import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { SizesComponent } from './sizes/sizes.component';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faGear,
  faImages,
  faImage,
  faTrash,
  faUpDownLeftRight,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { UploadDropzoneComponent } from '../../../shared/upload-dropzone/upload-dropzone.component';
import { ColorService } from './color.service';
import { ImageService } from './image/image.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ImageComponent } from './image/image.component';
@Component({
  selector: 'app-product-color',
  imports: [
    SizesComponent,
    FontAwesomeModule,
    UploadDropzoneComponent,
    CommonModule,
    LoadingComponent,
    ImageComponent
  ],
  templateUrl: './product-color.component.html',
  styleUrl: './product-color.component.scss',
})
export class ProductColorComponent implements OnInit, OnDestroy {
  @Input() color: any;
  modal: any;

  faGear = faGear;
  faImages = faImages;
  faImage = faImage;
  faTrash = faTrash;
  faUpDownLeftRight = faUpDownLeftRight;
  faCircleCheck = faCircleCheck;

  images: any[] = [];

  loading: boolean = false;
 

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _color: ColorService,
    private _image: ImageService
  ) {
    // customize default values of carousels used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, {
      centered: true,
      size: 'lg',
    });

    this.loading = true;

    this._color.setProductId(this.color.product_id);

    this._color.get(this.color.id).subscribe((resp: any) => {
      console.log(resp);
      this.loading = false;
      this.images = resp.data.images;
      console.log(this.images);
    });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  closeModal() {
    this.modal.close();
  }

  fileUpload(event: any) {
    console.log(event);
    this.images.unshift(event);
    // this.images.
  }

  reListImages(id: any) {

    // this.images = this.images.filter((image) => image.id !== id);/
    console.log('Re-listing images after deletion of ID:', id);
    
    this.images = this.images.filter((image) => image.id !== id);

  }

}

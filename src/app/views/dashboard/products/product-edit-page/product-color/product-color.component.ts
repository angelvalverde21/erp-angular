import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { SizesComponent } from './sizes/sizes.component';
import { CommonModule, JsonPipe } from '@angular/common';
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
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ImageComponent } from '../../../shared/components/gallery/image/image.component';
import { ImageService } from '../../../shared/components/gallery/image/image.service';
import { ColorService } from '../colors/color/color.service';
@Component({
  selector: 'app-product-color',
  imports: [
    SizesComponent,
    FontAwesomeModule,
    UploadDropzoneComponent,
    CommonModule,
    LoadingComponent,
    ImageComponent,
    JsonPipe
  ],
  templateUrl: './product-color.component.html',
  styleUrl: './product-color.component.scss',
})
export class ProductColorComponent implements OnInit, OnDestroy {
  @Input() color: any;
  @Output() colorIdDelete = new EventEmitter<number>();
  
  modal: any;

  faGear = faGear;
  faImages = faImages;
  faImage = faImage;
  faTrash = faTrash;
  faUpDownLeftRight = faUpDownLeftRight;
  faCircleCheck = faCircleCheck;

  images: any[] = [];

  loading: boolean = false;
  loadingDelete: boolean = false;
 

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

  borrarColor(color_id: number){


    console.log('Borrando color con ID:', color_id);

    this._color.setProductId(this.color.product_id);

    this.loadingDelete = true;
    // this.images = this.images.filter((image) => image.id !== id);/

    this._color.destroy(color_id).subscribe((resp: any) => {
      console.log(resp);
      this.loadingDelete = false;
      if (resp.success) {
        console.log(resp);
        this.colorIdDelete.emit(color_id);
        // this.images = this.images.filter((image) => image.id !== id);
      }
    });
  }

}

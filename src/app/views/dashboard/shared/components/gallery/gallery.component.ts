import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { UploadDropzoneComponent } from '../../upload-dropzone/upload-dropzone.component';
import { SizesComponent } from '../../../products/product-edit-page/product-colors/sizes/sizes.component';
import {
  NgbCarouselConfig,
  NgbCarouselModule,
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ButtonAddComponent } from '../buttons/button-add/button-add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear, faImages, faImage, faTrash, faUpDownLeftRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../buttons/button/button.component';
@Component({
  selector: 'app-gallery',
  imports: [
    UploadDropzoneComponent,
    SizesComponent,
    NgbCarouselModule,
    CommonModule,
    ButtonAddComponent,
    NgbDropdownModule,
    FontAwesomeModule,
    ButtonComponent,
    UploadDropzoneComponent
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GalleryComponent implements OnInit, OnDestroy {
  @Input() path: string = 'products/colors/store';

  faGear = faGear;
  faImages = faImages;
  faImage = faImage;
  faTrash = faTrash;
  faUpDownLeftRight = faUpDownLeftRight;
  faCircleCheck = faCircleCheck;

  modal: any;

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(
    config: NgbCarouselConfig,
    configModal: NgbModalConfig,
    private modalService: NgbModal
  ) {
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.pauseOnHover = false;

    configModal.backdrop = 'static';
    configModal.keyboard = false;
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  closeModal() {
    this.modal.close();
  }
}

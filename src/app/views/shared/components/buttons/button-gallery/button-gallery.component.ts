import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faImage, faCamera } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { GalleryComponent } from '../../gallery/gallery.component';


@Component({
  selector: 'app-button-gallery',
  imports: [
    FontAwesomeModule,
    GalleryComponent
  ],
  templateUrl: './button-gallery.component.html',
  styleUrl: './button-gallery.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ButtonGalleryComponent implements OnInit, OnDestroy {

  faImage = faImage;
  faCamera = faCamera;

  @Input() path: any; 

  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true });
  }


  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
  closeModal() {
    this.modal.close();
  }
}

import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../button/button.component';
import { UploadDropzoneComponent } from '../../../upload-dropzone/upload-dropzone.component';

@Component({
  selector: 'app-button-add-color',
  imports: [ButtonComponent, UploadDropzoneComponent],
  templateUrl: './button-add-color.component.html',
  styleUrl: './button-add-color.component.scss',
  encapsulation: ViewEncapsulation.None,
})

export class ButtonAddColorComponent implements OnInit, OnDestroy {
  modal: any;
  faPlus = faPlus;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }
  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { size: 'lg', centered: true });
  }

  @Input() product_id: number | null = null; 
  

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  closeModal() {
    this.modal.close();
  }

  fileUpload(event: any) {
    console.log('File uploaded:', event);
    // Aquí puedes manejar el evento de carga de archivos
    // Por ejemplo, enviar el archivo al servidor o procesarlo de alguna manera
  } 

}

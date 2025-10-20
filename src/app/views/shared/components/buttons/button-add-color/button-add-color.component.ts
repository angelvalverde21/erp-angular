import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faPalette } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../button/button.component';
import { UploadDropzoneComponent } from '../../../upload-dropzone/upload-dropzone.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-button-add-color',
  imports: [ButtonComponent, UploadDropzoneComponent, FontAwesomeModule],
  templateUrl: './button-add-color.component.html',
  styleUrl: './button-add-color.component.scss',
  encapsulation: ViewEncapsulation.None,
})

export class ButtonAddColorComponent implements OnInit, OnDestroy {
  modal: any;
  faPlus = faPlus;
  faPalette = faPalette;

  @Input() colortext: string = ""; 
  @Output() colorCreate = new EventEmitter<[]>();
  @Input() color: string = "primary"; 
    @Input() size: string = 'sm';

  

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

  fileUpload(color: any) { //el file upload devuelve en realidad un color
    // Emit the uploaded file event
    this.colorCreate.emit(color);
    console.log('File uploaded:', color);

    
    // Aquí puedes manejar el evento de carga de archivos
    // Por ejemplo, enviar el archivo al servidor o procesarlo de alguna manera
  } 

  filesComplete(status: boolean){
    Swal.fire({
      icon: 'success',
      title: 'Correcto',
      text: 'Los colores han sido subidos correctamente',
      confirmButtonText: 'OK',
      showConfirmButton: true
    })

    this.closeModal();
  }

}

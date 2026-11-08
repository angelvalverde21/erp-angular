import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { faHome, faUser, faPhone, faImagePortrait, faLocationDot, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manufacture-production-form',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './manufacture-production-form.component.html',
  styleUrl: './manufacture-production-form.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class ManufactureProductionFormComponent {

  faUser = faUser;
  faHome = faHome;
  faImagePortrait = faImagePortrait;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faPlus = faPlus;

  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  @Input({ required: true }) form!: FormGroup;
  @Input() type: string = 'production';


  isInvalid(value: string): boolean {
    if (
      this.form.get(value)?.invalid &&
      this.form.get(value)?.touched
    ) {
      // console.log('INVALIDO');
      return true;
    } else {
      return false;
    }
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, {
      centered: true,
      size: 'lg',
    });
  }

  closeModal() {
    this.modal.close();
  }


}




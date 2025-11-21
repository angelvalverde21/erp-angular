import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { MpPagoLinkCreateComponent } from '../../dashboard/mercadopago/mp-pago-link-create/mp-pago-link-create.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pago-link',
  imports: [
    MpPagoLinkCreateComponent,
    FontAwesomeModule
  ],
  templateUrl: './pago-link.component.html',
  styleUrl: './pago-link.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PagoLinkComponent implements OnInit, OnDestroy {

  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  
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
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }


  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
  closeModal() {
    this.modal.close();
  }

}
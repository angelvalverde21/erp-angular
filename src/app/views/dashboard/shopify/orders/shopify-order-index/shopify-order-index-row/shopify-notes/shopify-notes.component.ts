import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shopify-notes',
  imports: [
    FontAwesomeModule,
    NgbTooltipModule
  ],
  templateUrl: './shopify-notes.component.html',
  styleUrl: './shopify-notes.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ShopifyNotesComponent implements OnInit, OnDestroy {

  @Input() note: string = '';

  faCommentDots = faCommentDots;

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

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  closeModal() {
    this.modal.close();
  }
}

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
import { ButtonComponent } from '../button/button.component';
import { faPlus, faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { PurchaseCreateComponent } from '../../../../dashboard/purchases/purchase-create/purchase-create.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-button-purchase-create',
  imports: [ButtonComponent, PurchaseCreateComponent, FontAwesomeModule],
  templateUrl: './button-purchase-create.component.html',
  styleUrl: './button-purchase-create.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ButtonPurchaseCreateComponent implements OnInit, OnDestroy {
  modal: any;
  faPlus = faPlus;
  faCashRegister = faCashRegister;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  @Output() emitPurchaseCreate = new EventEmitter<number>();

  @Input() section: any;
  @Input() purchaseable_type: string = '';
  @Input() purchaseable_id: number = 0;

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, {
      centered: true,
      size: 'lg',
    });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  closeModal() {
    this.modal.close();
  }

  receivePurchaseCreate($event: any) {
    if ($event) {
      this.emitPurchaseCreate.emit($event);
      this.modal.close();
    } else {
      console.log('Error');
    }
  }
}

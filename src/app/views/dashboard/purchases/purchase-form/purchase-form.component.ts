import {
  Component, Input, TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { faEdit, faTags, faPlus, faIdCard, faUser, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { UnitSelectedComponent } from '../../units/unit-selected/unit-selected.component';
import { SupplierCreateComponent } from '../../users/suppliers/supplier-create/supplier-create.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-purchase-form',
  imports: [
    InputGroupComponent,
    NgbAccordionModule,
    ReactiveFormsModule,
    ButtonComponent,
    CommonModule,
    UnitSelectedComponent,
    SupplierCreateComponent,
    FontAwesomeModule,
    NgSelectModule,
    JsonPipe
  ],
  templateUrl: './purchase-form.component.html',
  styleUrl: './purchase-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseFormComponent {

  faEdit = faEdit;
  faTags = faTags;
  faPlus = faPlus;
  faIdCard = faIdCard;
  faUser = faUser;
  faAddressCard = faAddressCard;
  @Input() supplier_id: number | null = 0;

  modal: any;

  @Input({ required: true }) form!: FormGroup;
  @Input() suppliers: any;
  @Input() units: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
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

  get(path: string) {
    return this.form?.get(path) ?? null;
  }

  supplierReceiveCreate(supplier: any) {

    console.log(supplier);

    this.suppliers = [supplier, ...this.suppliers];

    this.form.get('supplier_id')?.setValue(supplier.id);
    // this.form.get('supplier_id')?.setValue(supplier.id);

    if (supplier) {
      this.modal.close();
    }
  }


}

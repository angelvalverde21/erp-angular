import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { faHome, faUser, faPhone, faImagePortrait, faLocationDot, faPlus } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TwoDecimalsDirective } from 'src/app/core/directives/two-decimals.directive';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { SupplierCreateComponent } from '../../../users/suppliers/supplier-create/supplier-create.component';
import { SupplierSelectedComponent } from '../../../users/suppliers/supplier-selected/supplier-selected.component';
import { InputDistrictIdComponent } from '../../../addresses/input-district-id/input-district-id.component';

@Component({
  selector: 'app-manufacture-order-form',
  imports: [
    InputGroupComponent,
    CommonModule,
    InputDistrictIdComponent,
    ReactiveFormsModule,
    JsonPipe,
    TwoDecimalsDirective,
    SupplierSelectedComponent,
    ButtonComponent,
    SupplierCreateComponent
  ],
  templateUrl: './manufacture-order-form.component.html',
  styleUrl: './manufacture-order-form.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class ManufactureOrderFormComponent {

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
  @Input() suppliers: any[] = [];

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

  supplierReceiveCreate(supplier: any) {

    console.log('listado de suppliers en el componente padre', this.suppliers);
    console.log('nuevo supplier', supplier);

    const newSupplier = {
      id: supplier.id,
      name: supplier.user.name,
    };

    console.log('new supplier', newSupplier);


    this.suppliers = [newSupplier, ...this.suppliers];

    this.form.get('supplier_id')?.setValue(supplier.id);
    // this.form.get('supplier_id')?.setValue(supplier.id);

    if (supplier) {
      this.modal.close();
    }

  }

}




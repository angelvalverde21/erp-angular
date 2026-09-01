import {
  Component, Input, OnInit, TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { SupplierSelectedComponent } from '../../users/suppliers/supplier-selected/supplier-selected.component';
import { TwoDecimalsDirective } from '../../../../core/directives/two-decimals.directive';

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
    JsonPipe,
    SupplierSelectedComponent,
    TwoDecimalsDirective,
    ReactiveFormsModule
  ],
  templateUrl: './purchase-form.component.html',
  styleUrl: './purchase-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseFormComponent implements OnInit {

  faEdit = faEdit;
  faTags = faTags;
  faPlus = faPlus;
  faIdCard = faIdCard;
  faUser = faUser;
  faAddressCard = faAddressCard;
  @Input() supplier_id: number | null = 0;

  modal: any;

  ngOnInit(): void {
    console.log(this.suppliers);

  }

  @Input({ required: true }) form!: FormGroup;
  @Input() suppliers: any;
  @Input() units: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    console.log(this.suppliers);
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

  @Input() purchase_items!: FormArray<FormGroup>;


}

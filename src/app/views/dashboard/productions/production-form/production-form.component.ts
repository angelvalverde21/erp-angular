import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { faHome, faUser, faPhone, faImagePortrait, faLocationDot, faPlus } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputDistrictIdComponent } from '../../addresses/input-district-id/input-district-id.component';
import { TwoDecimalsDirective } from 'src/app/core/directives/two-decimals.directive';
import { SupplierSelectedComponent } from '../../users/suppliers/supplier-selected/supplier-selected.component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { SupplierCreateComponent } from '../../users/suppliers/supplier-create/supplier-create.component';

@Component({
  selector: 'app-production-form',
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
  templateUrl: './production-form.component.html',
  styleUrl: './production-form.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class ProductionFormComponent {

  faUser = faUser;
  faHome = faHome;
  faImagePortrait = faImagePortrait;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faPlus = faPlus;

  modal: any;
  constructor(

  ) {
    // customize default values of modals used by this component tree

  }

  @Input({ required: true }) form!: FormGroup;

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

}




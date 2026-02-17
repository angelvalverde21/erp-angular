import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { faHome, faUser, faPhone, faImagePortrait, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputDistrictIdComponent } from '../../addresses/input-district-id/input-district-id.component';
import { TwoDecimalsDirective } from 'src/app/core/directives/two-decimals.directive';
import { SupplierSelectedComponent } from '../../users/suppliers/supplier-selected/supplier-selected.component';

@Component({
  selector: 'app-manufacture-form',
  imports: [
    InputGroupComponent,
    CommonModule,
    InputDistrictIdComponent,
    ReactiveFormsModule,
    JsonPipe,
    TwoDecimalsDirective,
    SupplierSelectedComponent
  ],
  templateUrl: './manufacture-form.component.html',
  styleUrl: './manufacture-form.component.scss'
  
})
export class ManufactureFormComponent {

  faUser = faUser;
  faHome = faHome;
  faImagePortrait = faImagePortrait;
  faPhone = faPhone;
  faLocationDot = faLocationDot;

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

}

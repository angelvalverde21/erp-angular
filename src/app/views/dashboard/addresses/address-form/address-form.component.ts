import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { faHome, faUser, faPhone, faImagePortrait, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { InputDistrictIdComponent } from '../input-district-id/input-district-id.component';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { IdentitySelectedComponent } from '../../identities/identity-selected/identity-selected.component';

@Component({
  selector: 'app-address-form',
  imports: [
    InputGroupComponent,
    CommonModule,
    InputDistrictIdComponent,
    ReactiveFormsModule,
    JsonPipe,
    IdentitySelectedComponent
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class AddressFormComponent {

  faUser = faUser;
  faHome = faHome;
  faImagePortrait = faImagePortrait;
  faPhone = faPhone;
  faLocationDot = faLocationDot;

  constructor(private controlContainer: ControlContainer) { }

  get form(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

}

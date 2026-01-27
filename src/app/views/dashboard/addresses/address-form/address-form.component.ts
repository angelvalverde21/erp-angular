import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { faHome, faUser, faPhone, faImagePortrait, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { InputDistrictIdComponent } from '../input-district-id/input-district-id.component';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  imports: [
    InputGroupComponent,
    CommonModule,
    InputDistrictIdComponent
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent {

  faUser = faUser;
  faHome = faHome;
  faImagePortrait = faImagePortrait;
  faPhone = faPhone;
  faLocationDot = faLocationDot;

  @Input({ required: true }) form!: FormGroup;

}

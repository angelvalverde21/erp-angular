import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from 'src/app/views/shared/components/form/input-group/input-group.component';

@Component({
  selector: 'app-address-form',
  imports: [
    InputGroupComponent,
    CommonModule
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent {

  faUser = faUser;
  faHome = faHome;

}

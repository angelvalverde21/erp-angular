import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import {
  faPenToSquare,
  faGear,
  faSave,
  faShirt,
  faTags,
  faIdBadge,
  faEnvelope,
  faPhone,
  faMoneyBill
} from '@fortawesome/free-solid-svg-icons';
import { faImage, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    InputGroupComponent,
    FontAwesomeModule,
    NgSelectModule,
    JsonPipe
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent {

  @Input() form!: FormGroup;

  @Input() roles: any[] = [];

  faPenToSquare = faPenToSquare;
  faImage = faImage;
  faGear = faGear;
  faShirt = faShirt;
  faCircleCheck = faCircleCheck;
  faTags = faTags;
  faIdBadge = faIdBadge;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faMoneyBill = faMoneyBill;


}

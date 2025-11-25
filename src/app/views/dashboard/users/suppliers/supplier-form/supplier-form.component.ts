import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { InputGroupComponent } from '../../../../shared/components/form/input-group/input-group.component';
import { faPenToSquare, faIdBadge, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-supplier-form',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    InputGroupComponent,
    FontAwesomeModule,
    NgSelectModule
  ],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent {

  @Input() form!: FormGroup;
  @Input() roles: any[] = [];

  faPenToSquare = faPenToSquare;
  faIdBadge = faIdBadge;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
}

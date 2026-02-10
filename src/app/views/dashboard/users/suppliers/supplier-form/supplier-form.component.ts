import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { InputGroupComponent } from '../../../../shared/components/form/input-group/input-group.component';
import { faPenToSquare, faIdBadge, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { JsonPipe } from '@angular/common';
import { IdentitySelectedComponent } from '../../../identities/identity-selected/identity-selected.component';

@Component({
  selector: 'app-supplier-form',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    InputGroupComponent,
    FontAwesomeModule,
    NgSelectModule,
    JsonPipe,
    IdentitySelectedComponent
  ],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent {


  @Input({ required: true }) form!: FormGroup;
  @Input() roles: any[] = [];
  @Input() show_roles: boolean = true;

  faPenToSquare = faPenToSquare;
  faIdBadge = faIdBadge;
  faEnvelope = faEnvelope;
  faPhone = faPhone;

  // get control() {
  //   return this.form.controls;
  // }

  get(name: string) {
    return this.form?.get(name) ?? null;
  }

  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }

  hasError(controlName: string, error?: string): boolean {
    const control = this.form?.get(controlName);
    if (!control) return false;

    // Solo después de salir del input (blur)
    if (!control.touched) return false;

    // Error específico
    if (error) {
      return control.hasError(error);
    }

    // Error general
    return control.invalid;
  }

}

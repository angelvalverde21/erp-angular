import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupComponent } from '../../../../shared/components/form/input-group/input-group.component';
import { faPenToSquare, faIdBadge, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-courier-form',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    FontAwesomeModule,
    NgSelectModule,
    JsonPipe
  ],
  templateUrl: './courier-form.component.html',
  styleUrl: './courier-form.component.scss'
})
export class CourierFormComponent {


  //Aqui esta el form
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

  get(path: string) {
    return this.form?.get(path) ?? null;
  }

  hasError(path: string, error?: string): boolean {
    const control = this.form?.get(path);
    if (!control) return false;

    // Mostrar error solo si el usuario interactuó
    if (!control.touched && !control.dirty) return false;

    // Error específico
    if (error) {
      return control.hasError(error);
    }

    // Error general
    return control.invalid;
  }

}

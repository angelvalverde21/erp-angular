import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { IdentitySelectedComponent } from '../../../identities/identity-selected/identity-selected.component';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, NgSelectModule, IdentitySelectedComponent],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() roles: any[] = [];

  get roleOptions(): string[] {
    return this.roles.map(role => typeof role === 'string' ? role : role.name);
  }

  invalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control?.invalid && !!control.touched;
  }
}

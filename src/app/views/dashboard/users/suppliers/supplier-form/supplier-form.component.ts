import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IdentitySelectedComponent } from '../../../identities/identity-selected/identity-selected.component';
@Component({ selector: 'app-supplier-form', imports: [ReactiveFormsModule, IdentitySelectedComponent], templateUrl: './supplier-form.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class SupplierFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() roles: any[] = [];
  @Input() show_roles = false;
  invalid(name: string): boolean { const control = this.form.get(name); return !!control?.touched && control.invalid; }
}

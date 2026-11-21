import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({ selector: 'app-customer-form', imports: [ReactiveFormsModule, NgSelectModule], templateUrl: './customer-form.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class CustomerFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() roles: any[] = [];

  invalid(name: string): boolean { const control = this.form.get(name); return !!control?.touched && control.invalid; }
}

import { Component, Input, OnInit, Output, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { ContactEditor } from '../../shared/contact-editor';
@Component({ selector: 'app-customer-edit', imports: [ReactiveFormsModule, CustomerFormComponent], templateUrl: './customer-edit.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class CustomerEditComponent extends ContactEditor implements OnInit {
  protected service = inject(CustomerService);
  @Input({ required: true }) customer: any;
  @Output() updated = this.saved;
  ngOnInit(): void { this.initialize('customer', this.customer); }
}

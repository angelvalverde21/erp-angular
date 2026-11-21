import { Component, OnInit, Output, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { ContactEditor } from '../../shared/contact-editor';
@Component({ selector: 'app-customer-create', imports: [ReactiveFormsModule, CustomerFormComponent], templateUrl: './customer-create.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class CustomerCreateComponent extends ContactEditor implements OnInit {
  protected service = inject(CustomerService);

  @Output() emitCustomerCreate = this.saved;
  ngOnInit(): void { this.initialize('customer'); }
}

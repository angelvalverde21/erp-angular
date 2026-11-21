import { Component, OnInit, Output, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SupplierService } from '../supplier.service';
import { AddressFormComponent } from '../../../addresses/address-form/address-form.component';
import { ContactEditor } from '../../shared/contact-editor';
@Component({ selector: 'app-supplier-create', imports: [ReactiveFormsModule, AddressFormComponent], templateUrl: './supplier-create.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class SupplierCreateComponent extends ContactEditor implements OnInit {
  protected service = inject(SupplierService);

  @Output() emitSupplierCreate = this.saved;
  ngOnInit(): void { this.initialize('supplier'); }
  protected override preparePayload(value: Record<string, any>): Record<string, any> {
    const { primary, secondary, references, district_id, ...supplier } = value;
    return { ...supplier, address: { primary, secondary, references, district_id } };
  }
}

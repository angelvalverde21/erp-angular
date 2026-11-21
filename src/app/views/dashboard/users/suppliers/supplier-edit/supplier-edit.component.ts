import { Component, Input, OnInit, Output, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SupplierService } from '../supplier.service';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';
import { ContactEditor } from '../../shared/contact-editor';
@Component({ selector: 'app-supplier-edit', imports: [ReactiveFormsModule, SupplierFormComponent], templateUrl: './supplier-edit.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class SupplierEditComponent extends ContactEditor implements OnInit {
  protected service = inject(SupplierService);
  @Input({ required: true }) supplier: any;
  @Output() updated = this.saved;
  ngOnInit(): void { this.initialize('supplier', this.supplier); }
}

import { SupplierAddressSelectionComponent } from '../../users/suppliers/supplier-address-selection/supplier-address-selection.component';
import { DeliverySetupComponent } from '@shared/components/delivery-tracking/delivery-setup.component';
import { Component, EventEmitter, Input, Output, TemplateRef, inject } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SupplierCreateComponent } from '../../users/suppliers/supplier-create/supplier-create.component';
import { SupplierSelectedComponent, supplierOptions } from '../../users/suppliers/supplier-selected/supplier-selected.component';

@Component({
  selector: 'app-purchase-form',
  imports: [SupplierAddressSelectionComponent, DeliverySetupComponent, ReactiveFormsModule, SupplierCreateComponent, SupplierSelectedComponent],
  templateUrl: './purchase-form.component.html',
  styleUrl: './purchase-form.component.scss',
})
export class PurchaseFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() supplier_id: number | null = 0;
  @Input() suppliers: readonly unknown[] = [];
  @Input() suppliersLoading = false;
  @Input() manageDelivery = false;
  @Input() deliveryExpanded = false;
  @Input() deliveryTracked = false;
  @Output() deliveryRequested = new EventEmitter<void>();
  @Input() units: unknown;
  @Input() purchase_items!: FormArray<FormGroup>;
  private readonly modalService = inject(NgbModal);
  private modal?: NgbModalRef;
  get deliveryForm(): FormGroup | null { return this.form.get('delivery') as FormGroup | null; }
  get deliveryOpen(): boolean { return !!this.deliveryForm?.value.enabled || this.deliveryExpanded; }
  get deliveryButtonText(): string {
    if (this.manageDelivery) return this.deliveryExpanded ? 'Ocultar entrega' : this.deliveryTracked ? 'Seguimiento' : 'Añadir entrega';
    return this.deliveryOpen ? 'Quitar entrega' : 'Añadir entrega';
  }
  toggleDelivery(): void {
    const delivery = this.deliveryForm;
    if (!delivery) { this.deliveryRequested.emit(); return; }
    delivery.get('enabled')?.setValue(!delivery.get('enabled')?.value);
    delivery.markAsDirty();
  }

  openVerticallyCentered(content: TemplateRef<unknown>): void {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', keyboard: false });
  }

  supplierReceiveCreate(supplier: unknown): void {
    const option = supplierOptions([supplier])[0];
    if (!option) return;
    this.suppliers = [supplier, ...this.suppliers.filter(record => supplierOptions([record])[0]?.id !== option.id)];
    this.form.get('supplier_id')?.setValue(option.id);
    this.form.get('supplier_id')?.markAsDirty();
    this.modal?.close();
  }
}

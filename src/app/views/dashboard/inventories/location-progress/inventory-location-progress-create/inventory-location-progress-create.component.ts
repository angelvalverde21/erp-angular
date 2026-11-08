import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocationProgressPayload, InventoryWorkspaceOptions, InventoryVariant, LocationProgressStatus } from 'src/app/interfaces/inventory-workspace.interface';
import { BranchFieldValidationDirective } from '../../../branches/branch-field-validation.directive';
import { InventoryVariantPickerComponent } from '../../inventory-variant-picker/inventory-variant-picker.component';
import { INVENTORY_STATUS_LABELS } from '../../inventory-workflow';
import { WarehouseSelectComponent } from '../../../warehouses/warehouse-select/warehouse-select.component';
@Component({ selector: 'app-inventory-location-progress-create', imports: [WarehouseSelectComponent, RouterLink, ReactiveFormsModule, BranchFieldValidationDirective], templateUrl: './inventory-location-progress-create.component.html', styleUrl: './inventory-location-progress-create.component.scss' })
export class InventoryLocationProgressCreateComponent {
  @Input() options: InventoryWorkspaceOptions | null = null;
  @Input() saving = false;
  @Input() readOnly = false;
  @Input() variants: InventoryVariant[] = [];
  @Input() searching = false;
  @Input() searchError = '';
  @Output() searchVariants = new EventEmitter<string>();
  @Output() save = new EventEmitter<LocationProgressPayload>();
  selectedVariant: InventoryVariant | null = null;
  editing = false;
  cancelPath = ['../'];
  readonly labels = INVENTORY_STATUS_LABELS;
  states: LocationProgressStatus[] = ['pending'];
  readonly form;
  get locationOptions() {
    return (this.options?.locations ?? []).map(location => ({
      ...location,
      contextName: location.warehouse?.name,
      subtitle: location.warehouse?.subtitle,
    }));
  }
  constructor(private fb: FormBuilder) { this.form = this.fb.nonNullable.group({ location_id: [null as number | null, Validators.required], status: ['pending' as LocationProgressStatus] }); }
  
  submit(): void {
    if (this.saving || this.readOnly) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    this.save.emit({ location_id: value.location_id!, ...(this.editing ? {status: value.status} : {}) });
  }
}

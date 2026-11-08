import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Inventory, InventoryOptions } from 'src/app/interfaces/inventory.interface';
import { InventorySessionPayload, InventorySessionStatus } from 'src/app/interfaces/inventory-session.interface';
import { BranchFieldValidationDirective } from '../../../branches/branch-field-validation.directive';
import { INVENTORY_STATUS_LABELS } from '../../inventory-workflow';
import { Warehouse } from 'src/app/interfaces/warehouse.interface';
import { InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryCountLocationPickerComponent } from '../../counts/inventory-count-location-picker/inventory-count-location-picker.component';
@Component({ selector: 'app-inventory-session-create', imports: [RouterLink, ReactiveFormsModule, BranchFieldValidationDirective, InventoryCountLocationPickerComponent], templateUrl: './inventory-session-create.component.html', styleUrl: './inventory-session-create.component.scss' })
export class InventorySessionCreateComponent {
  @Input() options: InventoryOptions | null = null;
  @Input() workspaceOptions: InventoryWorkspaceOptions | null = null;
  @Input() inventory: Inventory | null = null;
  get fixedBranchId(): number | null {
    return this.inventory?.scope_type === 'branch' ? this.inventory.inventoriable_id : null;
  }
  sessionWarehouse: Warehouse | null = null;
  get warehouseSubtitle(): string | null {
    const warehouse = this.sessionWarehouse ?? this.workspaceOptions?.warehouses?.find(item => item.id === this.form.controls.warehouse_id.value);
    return warehouse?.subtitle ?? null;
  }
  get warehousePath(): string {
    const warehouse = this.sessionWarehouse ?? this.workspaceOptions?.warehouses?.find(item => item.id === this.form.controls.warehouse_id.value);
    const branch = this.sessionWarehouse?.branch?.name ?? this.workspaceOptions?.branches?.find(item => item.id === warehouse?.branch_id)?.name;
    return [branch, warehouse?.name].filter(Boolean).join(' / ') || 'Almacén no disponible';
  }
  @Input() saving = false;
  @Input() readOnly = false;
  @Input() set defaultUserId(id: number) { if (!this.editing && !this.form.controls.user_id.value) this.form.controls.user_id.setValue(id); }
  editing = false;
  cancelPath = ['../'];
  readonly labels = INVENTORY_STATUS_LABELS;
  @Output() save = new EventEmitter<InventorySessionPayload>();
  readonly form;
  constructor(private fb: FormBuilder) { this.form = this.fb.nonNullable.group({ warehouse_id: [null as number | null, Validators.required], user_id: [0, [Validators.required, Validators.min(1)]], comment: ['', Validators.maxLength(5000)], status: ['open' as InventorySessionStatus] }); }
  submit(): void {
    if (this.saving || this.readOnly) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    this.save.emit({ warehouse_id: value.warehouse_id!, user_id: value.user_id, comment: value.comment.trim() || null, ...(this.editing ? { status: value.status } : {}) });
  }
}

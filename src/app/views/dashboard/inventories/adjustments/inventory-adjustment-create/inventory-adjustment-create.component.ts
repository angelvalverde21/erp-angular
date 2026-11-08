import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventoryAdjustmentPayload, InventoryWorkspaceOptions, InventoryVariant } from 'src/app/interfaces/inventory-workspace.interface';
import { BranchFieldValidationDirective } from '../../../branches/branch-field-validation.directive';
import { InventoryVariantPickerComponent } from '../../inventory-variant-picker/inventory-variant-picker.component';
import { INVENTORY_STATUS_LABELS } from '../../inventory-workflow';
@Component({ selector: 'app-inventory-adjustment-create', imports: [RouterLink, ReactiveFormsModule, BranchFieldValidationDirective, InventoryVariantPickerComponent], templateUrl: './inventory-adjustment-create.component.html', styleUrl: './inventory-adjustment-create.component.scss' })
export class InventoryAdjustmentCreateComponent {
  @Input() options: InventoryWorkspaceOptions | null = null;
  @Input() saving = false;
  @Input() readOnly = false;
  @Input() variants: InventoryVariant[] = [];
  @Input() searching = false;
  @Input() searchError = '';
  @Output() searchVariants = new EventEmitter<string>();
  @Output() save = new EventEmitter<InventoryAdjustmentPayload>();
  selectedVariant: InventoryVariant | null = null;
  editing = false;
  cancelPath = ['../'];
  readonly labels = INVENTORY_STATUS_LABELS;
  
  readonly form;
  constructor(private fb: FormBuilder) { this.form = this.fb.nonNullable.group({ variant_id: [null as number | null, Validators.required], comment: ['', Validators.maxLength(5000)], refresh: [false] }); }
  chooseVariant(variant: InventoryVariant): void { this.selectedVariant = variant; this.form.controls.variant_id.setValue(variant.id); this.form.controls.variant_id.markAsTouched(); }
  submit(): void {
    if (this.saving || this.readOnly) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    this.save.emit({ variant_id: value.variant_id!, comment: value.comment.trim() || null, refresh: value.refresh });
  }
}

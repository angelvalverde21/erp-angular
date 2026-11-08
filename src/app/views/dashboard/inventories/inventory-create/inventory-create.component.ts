import { WarehouseSelectComponent } from '../../warehouses/warehouse-select/warehouse-select.component';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { InventoryOptions, InventoryPayload, InventoryScope, InventoryStatus, InventoryTarget } from 'src/app/interfaces/inventory.interface';
import { BranchFieldValidationDirective } from '../../branches/branch-field-validation.directive';
import { INVENTORY_STATUS_LABELS } from '../inventory-workflow';
@Component({ selector: 'app-inventory-create', imports: [WarehouseSelectComponent, RouterLink, ReactiveFormsModule, BranchFieldValidationDirective], templateUrl: './inventory-create.component.html', styleUrl: './inventory-create.component.scss' })
export class InventoryCreateComponent implements OnDestroy {
  @Input() options: InventoryOptions | null = null;
  @Input() saving = false;
  editing = false;
  scopeLocked = false;
  cancelPath = ['../'];
  statuses: InventoryStatus[] = ['draft'];
  readonly labels = INVENTORY_STATUS_LABELS;
  @Output() save = new EventEmitter<InventoryPayload>();
  readonly form;
  private readonly scopeChanges: Subscription;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({ name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(255)]], comment: ['', Validators.maxLength(5000)], inventoriable_type: ['' as InventoryScope | ''], inventoriable_id: [null as number | null], status: ['draft' as InventoryStatus] });
    this.scopeChanges = this.form.controls.inventoriable_type.valueChanges.pipe(distinctUntilChanged()).subscribe(type => {
      this.form.controls.inventoriable_id.setValue(null);
      this.form.controls.inventoriable_id.setValidators(type ? Validators.required : null);
      this.form.controls.inventoriable_id.updateValueAndValidity();
    });
  }
  get targets(): InventoryTarget[] {
    const type = this.form.controls.inventoriable_type.value;
    if (!this.options || !type) return [];
    return type === 'branch' ? this.options.branches : type === 'warehouse' ? this.options.warehouses : this.options.locations;
  }
  get targetOptions() {
    return this.targets.map(target => ({
      ...target,
      contextName: target.warehouse?.name,
      subtitle: target.subtitle ?? target.warehouse?.subtitle,
    }));
  }
  submit(): void {
    if (this.saving) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    this.save.emit({ name: value.name.trim(), comment: value.comment.trim() || null, inventoriable_type: value.inventoriable_type || null, inventoriable_id: value.inventoriable_type ? value.inventoriable_id : null, ...(this.editing ? { status: value.status } : {}) });
  }
  ngOnDestroy(): void { this.scopeChanges.unsubscribe(); }
}

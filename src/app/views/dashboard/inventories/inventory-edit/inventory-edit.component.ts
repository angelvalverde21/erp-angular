import { WarehouseSelectComponent } from '../../warehouses/warehouse-select/warehouse-select.component';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Inventory } from 'src/app/interfaces/inventory.interface';
import { InventoryCreateComponent } from '../inventory-create/inventory-create.component';
import { BranchFieldValidationDirective } from '../../branches/branch-field-validation.directive';
import { inventoryTransitions } from '../inventory-workflow';
@Component({ selector: 'app-inventory-edit', imports: [WarehouseSelectComponent, RouterLink, ReactiveFormsModule, BranchFieldValidationDirective], templateUrl: '../inventory-create/inventory-create.component.html', styleUrl: '../inventory-create/inventory-create.component.scss' })
export class InventoryEditComponent extends InventoryCreateComponent implements OnChanges {
  @Input({ required: true }) inventory!: Inventory;
  override editing = true;
  override cancelPath = ['../../'];
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['inventory'] || !this.inventory) return;
    this.form.patchValue({ name: this.inventory.name, comment: this.inventory.comment ?? '', inventoriable_type: this.inventory.scope_type ?? '', inventoriable_id: this.inventory.inventoriable_id, status: this.inventory.status });
    this.statuses = inventoryTransitions(this.inventory.status);
    this.scopeLocked = (this.inventory.sessions_count ?? 0) > 0 || (this.inventory.location_progress_count ?? 0) > 0 || (this.inventory.adjustments_count ?? 0) > 0;
    if (this.scopeLocked) { this.form.controls.inventoriable_type.disable({ emitEvent: false }); this.form.controls.inventoriable_id.disable({ emitEvent: false }); }
    this.form.markAsPristine();
  }
}

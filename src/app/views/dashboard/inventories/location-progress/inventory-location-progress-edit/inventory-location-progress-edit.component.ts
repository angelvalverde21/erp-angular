import { WarehouseSelectComponent } from '../../../warehouses/warehouse-select/warehouse-select.component';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventoryLocationProgress, LocationProgressStatus } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryLocationProgressCreateComponent } from '../inventory-location-progress-create/inventory-location-progress-create.component';
import { BranchFieldValidationDirective } from '../../../branches/branch-field-validation.directive';
import { InventoryVariantPickerComponent } from '../../inventory-variant-picker/inventory-variant-picker.component';
@Component({ selector: 'app-inventory-location-progress-edit', imports: [WarehouseSelectComponent, RouterLink, ReactiveFormsModule, BranchFieldValidationDirective], templateUrl: '../inventory-location-progress-create/inventory-location-progress-create.component.html', styleUrl: '../inventory-location-progress-create/inventory-location-progress-create.component.scss' })
export class InventoryLocationProgressEditComponent extends InventoryLocationProgressCreateComponent implements OnChanges {
  @Input({required:true}) record!: InventoryLocationProgress;
  override editing = true;
  override cancelPath = ['../../'];
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['record'] || !this.record) return;
    this.form.patchValue({ location_id: this.record.location_id, status: this.record.status });
    this.form.controls.location_id.disable({emitEvent:false});
    const steps: Record<LocationProgressStatus, LocationProgressStatus[]> = { pending: ['pending','in_progress'], in_progress: ['in_progress','counted'], counted: ['counted','verified'], verified: ['verified'] }; this.states = steps[this.record.status];
    this.form.markAsPristine();
  }
}

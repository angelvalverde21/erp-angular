import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventorySession } from 'src/app/interfaces/inventory-session.interface';
import { InventorySessionCreateComponent } from '../inventory-session-create/inventory-session-create.component';
import { BranchFieldValidationDirective } from '../../../branches/branch-field-validation.directive';
import { InventoryCountLocationPickerComponent } from '../../counts/inventory-count-location-picker/inventory-count-location-picker.component';
@Component({ selector: 'app-inventory-session-edit', imports: [RouterLink, ReactiveFormsModule, BranchFieldValidationDirective, InventoryCountLocationPickerComponent], templateUrl: '../inventory-session-create/inventory-session-create.component.html', styleUrl: '../inventory-session-create/inventory-session-create.component.scss' })
export class InventorySessionEditComponent extends InventorySessionCreateComponent implements OnChanges {
  @Input({ required: true }) session!: InventorySession;
  override editing = true;
  override cancelPath = ['../../'];
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['session'] || !this.session) return;
    this.form.patchValue({ warehouse_id: this.session.warehouse_id, user_id: this.session.user_id, comment: this.session.comment ?? '', status: this.session.status });
    this.form.controls.warehouse_id.disable();
    this.sessionWarehouse = this.session.warehouse ?? null;
    this.form.markAsPristine();
  }
}

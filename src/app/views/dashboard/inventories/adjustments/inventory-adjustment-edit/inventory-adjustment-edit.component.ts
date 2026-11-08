import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventoryAdjustment, InventoryAdjustmentAction } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryAdjustmentCreateComponent } from '../inventory-adjustment-create/inventory-adjustment-create.component';
import { BranchFieldValidationDirective } from '../../../branches/branch-field-validation.directive';
import { InventoryStatusComponent } from '../../inventory-status/inventory-status.component';

@Component({ selector: 'app-inventory-adjustment-edit', imports: [DatePipe, RouterLink, ReactiveFormsModule, BranchFieldValidationDirective, InventoryStatusComponent], templateUrl: './inventory-adjustment-edit.component.html', styleUrl: './inventory-adjustment-edit.component.scss' })
export class InventoryAdjustmentEditComponent extends InventoryAdjustmentCreateComponent implements OnChanges {
  @Input({ required: true }) record!: InventoryAdjustment;
  @Output() action = new EventEmitter<InventoryAdjustmentAction>();
  override editing = true;
  override cancelPath = ['../../'];

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['record'] || !this.record) return;
    this.selectedVariant = this.record.variant ?? null;
    this.form.patchValue({ variant_id: this.record.variant_id, comment: this.record.comment ?? '', refresh: false });
    this.form.controls.variant_id.disable({ emitEvent: false });
    this.form.markAsPristine();
  }

  refreshCalculation(): void {
    this.form.controls.refresh.setValue(true);
    this.submit();
  }
}

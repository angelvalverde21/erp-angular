import { ImagePreviewComponent } from 'src/app/views/shared/components/image-preview/image-preview.component';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryCount } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryCountCreateComponent } from '../inventory-count-create/inventory-count-create.component';
import { BranchFieldValidationDirective } from '../../../branches/branch-field-validation.directive';
import { WarehouseSelectComponent } from '../../../warehouses/warehouse-select/warehouse-select.component';
@Component({ selector: 'app-inventory-count-edit', imports: [ImagePreviewComponent, WarehouseSelectComponent, CurrencyPipe, DatePipe, UpperCasePipe, RouterLink, ReactiveFormsModule, BranchFieldValidationDirective], templateUrl: '../inventory-count-create/inventory-count-create.component.html', styleUrl: '../inventory-count-create/inventory-count-create.component.scss' })
export class InventoryCountEditComponent extends InventoryCountCreateComponent implements OnChanges {
  @Input({required:true}) record!: InventoryCount;
  override editing = true;
  override cancelPath = ['../../'];
  override ngOnChanges(changes: SimpleChanges): void {
    if (!changes['record'] || !this.record) return;
    this.initialQuantity = this.record.quantity;
    this.form.patchValue({ location_id: this.record.location_id, variant_id: this.record.variant_id, quantity: this.record.quantity, status: this.record.status === 'cancelled' ? 'cancelled' : 'valid' });
    this.form.controls.location_id.disable({emitEvent:false});
    this.selectedVariant = this.record.variant ?? { id: this.record.variant_id, sku: null, stock: null };
    this.round = this.record.count_round;
    this.recordStatus = this.record.status;
    this.form.controls.variant_id.disable({emitEvent:false}); if (this.record.status !== 'valid') this.readOnly = true;
    this.form.markAsPristine();
  }
}

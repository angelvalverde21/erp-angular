import { WarehouseSelectComponent } from '../../../warehouses/warehouse-select/warehouse-select.component';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { InventoryWorkspaceOptions } from 'src/app/interfaces/inventory-workspace.interface';

@Component({
  selector: 'app-inventory-count-location-picker',
  imports: [WarehouseSelectComponent],
  templateUrl: './inventory-count-location-picker.component.html',
  styleUrl: './inventory-count-location-picker.component.scss',
})
export class InventoryCountLocationPickerComponent implements OnChanges {
  @Input() options: InventoryWorkspaceOptions | null = null;
  @Input() selectedLocationId: number | null = null;
  @Input() disabled = false;
  @Input() warehouseOnly = false;
  @Input() fixedBranchId: number | null = null;
  @Input() selectedWarehouseId: number | null = null;
  @Output() warehouseChange = new EventEmitter<number | null>();
  @Input() requiredError = false;
  @Input() description = 'Elige la ubicación para registrar conteos. El listado mostrará los registros de esa ubicación.';
  @Output() locationChange = new EventEmitter<number | null>();
  @ViewChild('branchInput') private branchInput?: ElementRef<HTMLSelectElement>;
  @ViewChild('warehouseInput') private warehouseInput?: WarehouseSelectComponent;
  @ViewChild('locationInput') private locationInput?: ElementRef<HTMLSelectElement>;
  branchId: number | null = null;
  warehouseId: number | null = null;

  get branches() { return this.options?.branches ?? []; }
  get fixedBranchName(): string { return this.branches.find(branch => branch.id === this.fixedBranchId)?.name ?? 'Sucursal del inventario'; }
  get warehouses() { return this.options?.warehouses?.filter(item => item.branch_id === this.branchId) ?? []; }
  get locations() { return this.options?.locations.filter(item => item.warehouse_id === this.warehouseId) ?? []; }

  ngOnChanges(): void {
    if (this.fixedBranchId !== null) this.branchId = this.fixedBranchId;
    if (this.warehouseOnly) {
      const warehouse = this.options?.warehouses?.find(item => item.id === this.selectedWarehouseId);
      const allowed = warehouse && (this.fixedBranchId === null || warehouse.branch_id === this.fixedBranchId);
      this.warehouseId = allowed ? warehouse.id : null;
      if (allowed) this.branchId = warehouse.branch_id;
      return;
    }
    const location = this.options?.locations.find(item => item.id === this.selectedLocationId);
    if (!location) return;
    this.warehouseId = location.warehouse_id;
    this.branchId = location.warehouse?.branch_id ?? this.options?.warehouses?.find(item => item.id === location.warehouse_id)?.branch_id ?? null;
  }

  selectBranch(value: string): void {
    if (this.fixedBranchId !== null) return;
    this.branchId = value ? Number(value) : null;
    this.warehouseId = null;
    if (this.warehouseOnly) this.warehouseChange.emit(null);
    else this.locationChange.emit(null);
  }

  selectWarehouse(value: string | number | null): void {
    this.warehouseId = value ? Number(value) : null;
    if (this.warehouseOnly) this.warehouseChange.emit(this.warehouseId);
    else this.locationChange.emit(null);
  }

  selectLocation(value: string): void { this.locationChange.emit(value ? Number(value) : null); }

  focus(): void {
    if (this.branchId && !this.warehouseId) { this.warehouseInput?.focus(); return; }
    const input = !this.branchId ? this.branchInput : this.locationInput;
    input?.nativeElement.focus();
  }
}

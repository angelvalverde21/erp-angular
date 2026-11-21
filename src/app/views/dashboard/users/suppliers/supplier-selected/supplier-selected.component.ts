import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

export interface SupplierOption {
  id: number;
  name: string;
  detail: string;
}

/** Supports both supplier resources and flattened supplier/user responses. IDs always belong to suppliers. */
export function supplierOptions(records: readonly unknown[] | null | undefined): SupplierOption[] {
  return (records ?? []).flatMap(record => {
    if (!record || typeof record !== 'object') return [];
    const supplier = record as Record<string, unknown>;
    const user = supplier['user'] && typeof supplier['user'] === 'object'
      ? supplier['user'] as Record<string, unknown> : {};
    const id = Number(supplier['id']);
    if (!Number.isSafeInteger(id) || id <= 0) return [];
    const name = String(supplier['name'] || user['name'] || '').trim() || `Proveedor #${id}`;
    const detail = [supplier['document_number'] || user['document_number'], supplier['phone'] || user['phone']]
      .filter(Boolean).join(' · ');
    return [{ id, name, detail }];
  });
}

@Component({
  selector: 'app-supplier-selected',
  imports: [FormsModule, NgSelectModule],
  templateUrl: './supplier-selected.component.html',
  styleUrl: './supplier-selected.component.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SupplierSelectedComponent), multi: true }],
})
export class SupplierSelectedComponent implements ControlValueAccessor {
  @Input() loading = false;
  @Input() labelForId = 'supplier-selected';
  @Input() set suppliers(value: readonly unknown[] | null | undefined) {
    this.options = supplierOptions(value);
  }
  options: SupplierOption[] = [];
  supplier_id: number | null = null;
  isDisabled = false;
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | null): void { this.supplier_id = value == null || !value ? null : Number(value); }
  registerOnChange(fn: (value: number | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(value: boolean): void { this.isDisabled = value; }
  setSupplier(value: number | null): void {
    this.supplier_id = value ?? null;
    this.onChange(this.supplier_id);
    this.touch();
  }
  touch(): void { this.onTouched(); }
}

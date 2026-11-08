import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventoryVariant } from 'src/app/interfaces/inventory-workspace.interface';
@Component({ selector: 'app-inventory-variant-picker', templateUrl: './inventory-variant-picker.component.html', styleUrl: './inventory-variant-picker.component.scss' })
export class InventoryVariantPickerComponent {
  @Input() variants: InventoryVariant[] = [];
  @Input() selected: InventoryVariant | null = null;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() error = '';
  @Output() search = new EventEmitter<string>();
  @Output() choose = new EventEmitter<InventoryVariant>();
  term = '';
  searched = false;
  submit(): void { if (!this.disabled && !this.loading && this.term.trim()) { this.searched = true; this.search.emit(this.term.trim()); } }
}

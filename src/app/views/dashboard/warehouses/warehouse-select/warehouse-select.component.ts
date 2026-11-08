import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';

interface WarehouseOption { id: number; name: string; subtitle?: string | null; contextName?: string | null; }

@Component({
  selector: 'app-warehouse-select',
  imports: [FormsModule, NgSelectModule],
  template: `
    <ng-select [items]="items" bindLabel="name" bindValue="id" [labelForId]="inputId"
      [ngModel]="value" [ngModelOptions]="{ standalone: true }" (ngModelChange)="select($event)"
      [disabled]="disabled" [placeholder]="placeholder" [clearable]="true" [searchFn]="search" [trackByFn]="trackWarehouse"
      (blur)="onTouched()">
      <ng-template ng-label-tmp let-item="item"><span class="warehouse-option-name">{{ item.name }}</span>@if (item.contextName) { <small>{{ item.contextName }}</small> }@if (item.subtitle) { <small>{{ item.subtitle }}</small> }</ng-template>
      <ng-template ng-option-tmp let-item="item"><span class="warehouse-option-name">{{ item.name }}</span>@if (item.contextName) { <small>{{ item.contextName }}</small> }@if (item.subtitle) { <small>{{ item.subtitle }}</small> }</ng-template>
    </ng-select>
  `,
  styles: `
    :host { display: block; min-width: 0; }
    .warehouse-option-name { display: block; font-size: .82rem; line-height: 1.5; }
    small { display: block; margin-top: .1rem; color: #8491a5; font-size: .72rem; line-height: 1.4; }
    :host ::ng-deep .ng-select-container { min-height: 44px; height: auto !important; border-radius: 8px; padding-block: .35rem; }
    :host ::ng-deep .ng-value { white-space: normal !important; }
    :host(.is-invalid) ::ng-deep .ng-select-container { border-color: #dc3545; }
  `,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WarehouseSelectComponent), multi: true }],
})
export class WarehouseSelectComponent implements ControlValueAccessor {
  @Input() items: WarehouseOption[] = [];
  @Input() value: number | null = null;
  @Input() disabled = false;
  @Input() inputId = '';
  @Input() placeholder = 'Selecciona una tienda o almacén';
  @Output() valueChange = new EventEmitter<number | null>();
  @ViewChild(NgSelectComponent) private selectControl?: NgSelectComponent;
  private onChange: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};

  readonly trackWarehouse = (item: WarehouseOption): number => item.id;

  readonly search = (term: string, item: WarehouseOption): boolean =>
    [item.name, item.subtitle, item.contextName].some(value => (value ?? '').toLocaleLowerCase().includes(term.toLocaleLowerCase()));

  writeValue(value: number | null): void { this.value = value; }
  registerOnChange(fn: (value: number | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.disabled = disabled; }
  focus(): void { this.selectControl?.focus(); }

  select(value: number | null): void {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }
}

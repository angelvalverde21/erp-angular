import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-button-switch',
  standalone: true,
  imports: [],
  templateUrl: './button-switch.component.html',
  styleUrl: './button-switch.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ButtonSwitchComponent),
      multi: true,
    },
  ],
})

export class ButtonSwitchComponent implements ControlValueAccessor {

  @Input() label: string = 'Status';
  @Input() id: string = '';
  @Input() textActive: string = 'Activo';
  @Input() textDesactive: string = 'Desactivado';
  @Input() textOff: boolean = false;


  value: boolean = false;
  isDisabled: boolean = false;

  onChange = (value: boolean) => {};
  onTouched = () => {};

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.checked;
    this.onChange(this.value);
    this.onTouched();
  }

}
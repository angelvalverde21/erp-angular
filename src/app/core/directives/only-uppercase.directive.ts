import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[UpperCase]'
})
export class UpperCaseDirective {

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    const start = input.selectionStart;
    const end = input.selectionEnd;

    const upper = input.value.toUpperCase();

    if (upper !== input.value) {
      // 🔹 actualiza el DOM
      input.value = upper;

      // 🔹 actualiza el FormControl
      this.ngControl.control?.setValue(upper, { emitEvent: true });

      // 🔹 restaura la posición del cursor
      input.setSelectionRange(start!, end!);
    }
  }
}

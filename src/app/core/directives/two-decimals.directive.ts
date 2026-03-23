import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[twoDecimals]',
  standalone: true
})
export class TwoDecimalsDirective {

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private control: NgControl
  ) {}

  @HostListener('blur')
  onBlur() {
    const value = this.el.nativeElement.value;

    if (value === '' || value === null) return;

    const num = Number(value);

    if (isNaN(num)) return;

    const formatted = num.toFixed(2);

    // Actualiza input
    this.el.nativeElement.value = formatted;

    // Actualiza el FormControl
    this.control?.control?.setValue(formatted, {
      emitEvent: false
    });
  }
}
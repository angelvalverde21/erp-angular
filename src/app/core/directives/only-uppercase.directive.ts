import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';


@Directive({
  selector: '[onlyUppercase]'
})
export class OnlyUppercaseDirective {

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const upper = value.toUpperCase();
    this.ngControl.control?.setValue(upper, { emitEvent: false });
  }

}

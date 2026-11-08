import { Directive, HostBinding, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ selector: 'input[formControlName], select[formControlName], textarea[formControlName]' })
export class BranchFieldValidationDirective {
  constructor(@Self() private control: NgControl) {}

  @HostBinding('class.is-invalid')
  get invalid(): boolean { return !!this.control.invalid && !!this.control.touched; }

  @HostBinding('attr.aria-invalid')
  get ariaInvalid(): string | null { return this.invalid ? 'true' : null; }
}

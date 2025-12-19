import { AbstractControl, ValidationErrors } from '@angular/forms';

export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return { phoneRequired: true };
  }
  // if (!value) return null;

  if (!/^\d+$/.test(value)) {
    return { phoneFormat: true };
  }

  if (value.startsWith('9')) {
    return value.length === 9 ? null : { phoneLength9: true };
  }

  if (/^[2-8]/.test(value)) {
    return value.length >= 7 ? null : { phoneMin7: true };
  }

  return { phoneInvalid: true };
}

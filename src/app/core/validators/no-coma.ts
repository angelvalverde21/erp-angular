import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noCommaValidator(
  control: AbstractControl
): ValidationErrors | null {

  const value = control.value;

  if (!value) {
    return null; // vacío = válido
  }

  return value.includes(',')
    ? { commaNotAllowed: true }
    : null;
}
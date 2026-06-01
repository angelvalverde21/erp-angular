import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneQuantityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const formArray = control as FormArray;

    const hasOneValue = formArray.controls.some(group => {
      const quantity = group.get('quantity')?.value;

      return quantity !== null &&
             quantity !== undefined &&
             quantity !== '';
    });

    return hasOneValue ? null : { atLeastOne: true };
  };
}
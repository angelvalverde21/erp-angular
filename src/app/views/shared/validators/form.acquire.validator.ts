import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador que verifica que al menos un elemento del array sea válido
export function atLeastOneValidVariantValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const variantsArray = control as FormArray;
    
    // Si no hay elementos, es inválido
    if (variantsArray.length === 0) {
      return { atLeastOneVariant: true };
    }
    
    // Verificar si al menos un grupo es válido
    const hasValidVariant = variantsArray.controls.some(group => {
      // Verificar que cada campo del grupo sea válido (no tenga errores)
      return group.valid;
    });
    
    return hasValidVariant ? null : { atLeastOneVariant: true };
  };
}
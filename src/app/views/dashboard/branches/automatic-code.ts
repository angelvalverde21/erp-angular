import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export function snakeCaseCode(name: string, maxLength = 50): string {
  return name.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, maxLength)
    .replace(/_+$/g, '');
}

export function bindAutomaticCode(
  name: FormControl<string>,
  code: FormControl<string>,
  maxLength = 50,
): Subscription {
  let previousGeneratedCode = snakeCaseCode(name.value, maxLength);

  return name.valueChanges.subscribe(value => {
    const generatedCode = snakeCaseCode(value, maxLength);
    if (!code.value.trim() || code.value === previousGeneratedCode) {
      code.setValue(generatedCode, { emitEvent: false });
    }
    previousGeneratedCode = generatedCode;
  });
}

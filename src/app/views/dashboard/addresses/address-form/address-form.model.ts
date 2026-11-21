import { FormBuilder, Validators } from '@angular/forms';

/** Location fields shared by address registration and initial supplier registration. */
export function addressLocationControls(fb: FormBuilder) {
  return {
    primary: fb.nonNullable.control('', [Validators.required, Validators.maxLength(255)]),
    secondary: fb.nonNullable.control('', Validators.maxLength(255)),
    references: fb.nonNullable.control('', Validators.maxLength(255)),
    district_id: fb.control<number | null>(null, Validators.required),
  };
}

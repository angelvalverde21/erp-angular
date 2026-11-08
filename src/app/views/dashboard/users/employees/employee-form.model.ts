import { FormBuilder, Validators } from '@angular/forms';

export function createEmployeeForm(fb: FormBuilder, creating = true) {
  return fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', creating ? [Validators.required, Validators.minLength(8), Validators.maxLength(72)] : [Validators.minLength(8), Validators.maxLength(72)]],
    password_confirmation: ['', creating ? [Validators.required] : []],
    phone: [''],
    identity_id: [null as number | null],
    document_number: [''],
    biometric_code: [''],
    status: [true],
    roles: [[] as string[], Validators.required],
    salary: [null as number | null, [Validators.min(0)]],
    type: ['fulltime'],
    comission: [null as number | null, [Validators.min(0), Validators.max(100)]],
    tag_sales: [''],
    date_entry: [''],
    work_time_start: ['09:00:00'],
    work_time_end: ['19:00:00'],
    tolerance_minutes: [15, [Validators.min(0), Validators.max(120)]],
    allow_extra_hours: [true],
  }, { validators: form => form.get('password')?.value === form.get('password_confirmation')?.value ? null : { passwordMismatch: true } });
}

export function employeePayload(value: Record<string, any>): Record<string, any> {
  const payload = Object.fromEntries(Object.entries(value).map(([key, field]) => [key, field === '' ? null : field]));
  if (!payload['password']) {
    delete payload['password'];
    delete payload['password_confirmation'];
  }
  return payload;
}

export function employeeError(error: any): string {
  const validation = error?.error?.errors as Record<string, string[]> | undefined;
  return validation ? Object.values(validation).flat().join(' ') : 'No se pudo guardar el empleado. Inténtalo nuevamente.';
}

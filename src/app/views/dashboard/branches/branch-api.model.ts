import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

export interface RecordResponse<T> { data: T; }
export interface ListResponse<T> { data: T[]; current_page?: number; last_page?: number; total?: number; }

export function markBranchFieldErrors(form: FormGroup | undefined, error: unknown): void {
  if (!form || !(error instanceof HttpErrorResponse) || error.status !== 422) return;
  const errors = error.error?.errors as Record<string, string[]> | undefined;
  for (const [field, messages] of Object.entries(errors ?? {})) {
    const control = form.get(field);
    if (!control || !Array.isArray(messages)) continue;
    control.setErrors({ ...control.errors, server: messages.join(' ') });
    control.markAsTouched();
  }
}

export function branchError(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) return fallback;
  const messages = error.error?.errors as Record<string, string[]> | undefined;
  return messages ? Object.values(messages).flat().join(' ') : error.error?.message || fallback;
}

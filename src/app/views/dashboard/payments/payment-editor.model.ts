import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export function buildPaymentForm(fb: FormBuilder, type: string, id: number, payment?: any): FormGroup {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return fb.group({
    amount: [payment?.amount ?? '', [Validators.required, Validators.min(.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    date: [payment?.date?.slice(0, 10) || today, Validators.required],
    direction: [payment?.direction || 'out', [Validators.required, Validators.pattern(/^(in|out)$/)]],
    gateway_id: [payment?.gateway_id ?? 2, Validators.required],
    comment: [payment?.comment || '', Validators.maxLength(255)],
    images: [[]], paymentable_type: [type, Validators.required], paymentable_id: [id, [Validators.required, Validators.min(1)]],
  });
}

export function paymentFormData(value: Record<string, any>): FormData {
  const data = new FormData();
  for (const [key, item] of Object.entries(value)) {
    if (key === 'images') { for (const file of item || []) data.append('images[]', file); }
    else if (item !== null && item !== undefined) data.append(key, String(item));
  }
  return data;
}

export function paymentError(response: any): string {
  const errors = response.error?.errors as Record<string, string[]> | undefined;
  return errors ? Object.values(errors).flat().join(' ') : 'No se pudo guardar el pago. Revisa la conexión e intenta nuevamente.';
}

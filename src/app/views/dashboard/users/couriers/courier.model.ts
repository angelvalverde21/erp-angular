import { FormBuilder, Validators } from '@angular/forms';

export interface Courier {
  id: number;
  name: string;
  phone: string | null;
  status: number;
  is_cod: boolean;
  freight_collect: boolean;
  delivery_type: 'agency' | 'express' | 'store_pickup';
  addresses?: any[];
  addresses_count?: number;
  created_at?: string;
}

export const DELIVERY_LABELS = {
  agency: 'Envío por agencia',
  express: 'Envío express',
  store_pickup: 'Recojo en tienda',
};

export function createCourierForm(fb: FormBuilder) {
  return fb.group({
    name: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(/\S/)]],
    phone: ['', Validators.maxLength(30)],
    status: [1, Validators.required],
    delivery_type: ['agency', Validators.required],
    is_cod: [false],
    freight_collect: [false],
  });
}

export function courierErrorMessage(error: any): string {
  const errors = error?.error?.errors;
  if (errors) {
    return Object.values(errors).flat().join(' ');
  }
  return error?.error?.message ?? 'No se pudo guardar el courier. Inténtalo nuevamente.';
}
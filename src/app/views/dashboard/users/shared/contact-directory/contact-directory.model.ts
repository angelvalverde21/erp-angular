export type ContactKind = 'supplier' | 'customer';
export interface ContactRow {
  id: number; routeId: number; name: string; initials: string;
  phone: string; email: string; document: string; active: boolean | null; createdAt: string | null;
}
export function contactRow(record: any, kind: ContactKind): ContactRow {
  const user = record?.user ?? record ?? {};
  const name = String(user.name || record?.name || 'Sin nombre');
  const status = user.status ?? record?.status;
  return {
    id: Number(record.id), routeId: Number(kind === 'customer' ? record.user_id ?? record.user?.id ?? record.id : record.id),
    name, initials: name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase(),
    phone: user.phone || '', email: user.email || '', document: user.document_number || '',
    active: status == null ? null : Number(status) === 1, createdAt: record.created_at || user.created_at || null,
  };
}
export function contactError(error: any): string {
  const errors = error?.error?.errors;
  return errors ? Object.values(errors).flat().join(' ') : error?.error?.message || 'No se pudo guardar. Tus datos se conservan para reintentar.';
}

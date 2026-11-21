import type { PhotoContact, PhotoReferenceImage } from './contacts/photo-contact.model';
import type { PhotoLocation } from './locations/photo-location.model';
export type PhotoSessionStatus = 'planned' | 'in_progress' | 'editing' | 'completed' | 'archived';
export interface PhotoAssignedContact extends Pick<PhotoContact, 'id' | 'name'> { active?: boolean; phone?: string | null; email?: string | null; company?: string | null; instagram?: string | null; images?: PhotoReferenceImage[]; }
export interface PhotoSessionPayload {
  photographer_contact_id?: number | null; model_ids?: number[];
  photographer_ids?: number[]; location_ids?: number[];
  photo_location_id?: number | null;
  name: string; status: PhotoSessionStatus; shoot_date: string | null; starts_at: string | null; ends_at: string | null;
  delivery_date: string | null; responsible_id: number | null; location: string | null; collection: string | null;
  photographer: string | null; team: string | null; brief: string | null; notes: string | null; budget: number | null;
}
export interface PhotoSession extends PhotoSessionPayload {
  can_open_workspace?: boolean;
  photographers?: PhotoAssignedContact[]; locations?: PhotoLocation[];
  tasks_count?: number; completed_tasks_count?: number; overdue_tasks_count?: number;
  photographer_contact?: { id: number; name: string } | null;
  photo_location?: { id: number; name: string; address: { primary: string | null } | null } | null;
  models?: PhotoAssignedContact[];
  id: number; responsible?: { id: number; name: string } | null; photos_count?: number; videos_count?: number; total_bytes?: number | null;
}
export interface PhotoSessionOptions {
  locations?: { id: number; name: string; type: string; address: string | null; active: boolean }[];
  photographers?: { id: number; name: string; active: boolean }[];
  models?: { id: number; name: string; active: boolean }[];
  employees: { id: number; employee_id: number; name: string }[]; storage: { configured: boolean; provider: string; max_bytes: number };
}
export interface PhotoAsset {
  id: string; name: string; kind: 'photo' | 'video'; category: 'original' | 'edited' | 'final'; bytes: number;
  selected: boolean; caption: string | null; status: string;
  image: { url_thumbnail: string; url_medium: string; url_large: string } | null;
}
export interface PhotoPage<T> { data: T[]; current_page: number; last_page: number; total: number; can_create?: boolean; }
export interface PhotoRecord<T> { data: T; message?: string; }
export interface PhotoUploadPlan { id: string; part_bytes: number; parts: number; }
export const PHOTO_SESSION_STATUSES: { value: PhotoSessionStatus; label: string }[] = [
  { value: 'planned', label: 'En preparación' }, { value: 'in_progress', label: 'En sesión' },
  { value: 'editing', label: 'En edición' }, { value: 'completed', label: 'Completada' }, { value: 'archived', label: 'Archivada' },
];
export const PHOTO_ASSET_CATEGORIES = [{ value: 'original', label: 'Originales' }, { value: 'edited', label: 'Editados' }, { value: 'final', label: 'Finales' }] as const;
export function photoFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '0 B';
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 4);
  return `${(bytes / 1024 ** index).toLocaleString('es-PE', { maximumFractionDigits: 1 })} ${['B', 'KB', 'MB', 'GB', 'TB'][index]}`;
}
export function photoSessionError(error: unknown): string {
  const body = (error as { error?: { message?: string; errors?: Record<string, string[]> } })?.error;
  return body?.errors ? Object.values(body.errors).flat().join(' ') : body?.message || 'No se pudo completar la operación. Vuelve a intentarlo.';
}

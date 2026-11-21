export type PhotoContactKind = 'photographer' | 'model';
export interface PhotoContactPayload {
  kind: PhotoContactKind; name: string; phone: string | null; email: string | null; instagram: string | null;
  portfolio_url: string | null; company: string | null; notes: string | null; active: boolean;
}
export interface PhotoReferenceImage { id: number; name: string; url_thumbnail: string; url_medium: string; url_large: string; }
export interface PhotoContact extends PhotoContactPayload { id: number; images?: PhotoReferenceImage[]; images_count?: number; }
export const PHOTO_CONTACT_LABELS = {
  photographer: { title: 'Fotógrafos', singular: 'fotógrafo', company: 'Estudio / productora', description: 'Directorio de fotógrafos y sus datos de contacto.' },
  model: { title: 'Modelos', singular: 'modelo', company: 'Agencia / representante', description: 'Directorio de modelos para tus sesiones fotográficas.' },
} as const;

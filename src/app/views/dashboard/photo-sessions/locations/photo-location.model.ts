export type PhotoLocationType = 'airbnb' | 'cafe' | 'studio' | 'hotel' | 'house' | 'outdoor' | 'other';
export interface PhotoLocationAddressPayload {
  primary: string | null; secondary: string | null; references: string | null; district_id: number | null;
  city: string | null; url_maps: string | null; latitud: number | null; longitud: number | null;
}
export interface PhotoLocationAddress extends PhotoLocationAddressPayload {
  id: number;
  district?: { id: number; name: string; province?: { name: string; department?: { name: string } } } | null;
}
export interface PhotoLocationPayload {
  name: string; type: PhotoLocationType; address: PhotoLocationAddressPayload | null;
  contact_name: string | null; phone: string | null; email: string | null; reference_url: string | null;
  rate: number | null; rate_unit: 'hour' | 'day' | 'session'; notes: string | null; active: boolean;
}
export interface PhotoLocation extends PhotoLocationPayload {
  id: number; sessions_count?: number; address: PhotoLocationAddress | null;
  display_address?: string | null; district_name?: string | null; city_name?: string | null;
}
export const PHOTO_LOCATION_TYPES: { value: PhotoLocationType; label: string; icon: string }[] = [
  { value: 'airbnb', label: 'Airbnb / alojamiento', icon: 'fa-house' },
  { value: 'cafe', label: 'Cafetería', icon: 'fa-mug-saucer' },
  { value: 'studio', label: 'Estudio', icon: 'fa-camera' },
  { value: 'hotel', label: 'Hotel', icon: 'fa-hotel' },
  { value: 'house', label: 'Casa / departamento', icon: 'fa-building' },
  { value: 'outdoor', label: 'Exteriores', icon: 'fa-tree' },
  { value: 'other', label: 'Otro', icon: 'fa-location-dot' },
];
export const PHOTO_RATE_UNITS = [{ value: 'hour', label: 'Por hora' }, { value: 'day', label: 'Por día' }, { value: 'session', label: 'Por sesión' }] as const;

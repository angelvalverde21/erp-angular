import type { PhotoSession } from './photo-session.model';
import type { PhotoTaskSummary } from './tasks/photo-session-task.model';

export type PhotoSessionSection = 'session' | 'tasks' | 'photographers' | 'models' | 'locations' | 'library';
export const PHOTO_SESSION_SECTIONS: { key: PhotoSessionSection; label: string; icon: string }[] = [
  { key: 'session', label: 'Resumen', icon: 'fa-chart-line' },
  { key: 'tasks', label: 'Tareas', icon: 'fa-list-check' },
  { key: 'photographers', label: 'Fotógrafos', icon: 'fa-camera' },
  { key: 'models', label: 'Modelos', icon: 'fa-user' },
  { key: 'locations', label: 'Locaciones', icon: 'fa-location-dot' },
  { key: 'library', label: 'Biblioteca', icon: 'fa-images' },
];

export function photoSessionSectionCount(section: PhotoSessionSection, session: PhotoSession, tasks: PhotoTaskSummary | null, assets: number | null): number {
  switch (section) {
    case 'tasks': return tasks?.total ?? session.tasks_count ?? 0;
    case 'photographers': return session.photographers?.length ?? (session.photographer_contact ? 1 : 0);
    case 'models': return session.models?.length ?? 0;
    case 'locations': return session.locations?.length ?? (session.photo_location ? 1 : 0);
    case 'library': return assets ?? (session.photos_count || 0) + (session.videos_count || 0);
    default: return 0;
  }
}

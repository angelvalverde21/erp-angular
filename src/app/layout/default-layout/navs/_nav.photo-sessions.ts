import { CustomNavData } from '../../../interfaces/nav.interface';
export const navPhotoSessions: CustomNavData[] = [{
  name: 'Sesiones fotográficas', url: 'dashboard/photo-sessions', icon: 'fa-solid fa-camera-retro',
  children: [
    { name: 'Sesiones', url: 'dashboard/photo-sessions', icon: 'fa-solid fa-calendar-days', linkProps: { routerLinkActiveOptions: { exact: true } } },
    { name: 'Fotógrafos', url: 'dashboard/photo-sessions/photographers', icon: 'fa-solid fa-camera', roles: ['master', 'ceo', 'admin', 'marketing'] },
    { name: 'Modelos', url: 'dashboard/photo-sessions/models', icon: 'fa-solid fa-user', roles: ['master', 'ceo', 'admin', 'marketing'] },
    { name: 'Locaciones', url: 'dashboard/photo-sessions/locations', icon: 'fa-solid fa-location-dot', roles: ['master', 'ceo', 'admin', 'marketing'] },
  ],
}];

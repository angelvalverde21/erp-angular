import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./photo-location-index-page/photo-location-index-page.component').then(m => m.PhotoLocationIndexPageComponent), data: { title: 'Locaciones' } },
  { path: 'create', loadComponent: () => import('./photo-location-create-page/photo-location-create-page.component').then(m => m.PhotoLocationCreatePageComponent), data: { title: 'Crear locación' } },
  { path: ':photo_location_id', loadComponent: () => import('./photo-location-edit-page/photo-location-edit-page.component').then(m => m.PhotoLocationEditPageComponent), data: { title: 'Editar locación' } },
];

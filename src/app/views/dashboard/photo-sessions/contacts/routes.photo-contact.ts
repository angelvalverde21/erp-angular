import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./photo-contact-index-page/photo-contact-index-page.component').then(m => m.PhotoContactIndexPageComponent), data: { title: 'Directorio' } },
  { path: 'create', loadComponent: () => import('./photo-contact-create-page/photo-contact-create-page.component').then(m => m.PhotoContactCreatePageComponent), data: { title: 'Registrar ficha' } },
  { path: ':contact_id', loadComponent: () => import('./photo-contact-edit-page/photo-contact-edit-page.component').then(m => m.PhotoContactEditPageComponent), data: { title: 'Editar ficha' } },
];

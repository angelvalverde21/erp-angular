import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { BaseService } from '../../base.service';
import { dashboardRoles } from '../area-dashboards/dashboard.model';
import type { PhotoSessionEditPageComponent } from './photo-session-edit-page/photo-session-edit-page.component';

const canAccess = () => dashboardRoles().some(role => ['master', 'ceo', 'admin', 'marketing'].includes(role))
  || inject(Router).createUrlTree(['/', inject(BaseService).store ?? '', 'dashboard', 'panels']);
export const routes: Routes = [
  { path: '', loadComponent: () => import('./photo-session-index-page/photo-session-index-page.component').then(m => m.PhotoSessionIndexPageComponent), data: { title: 'Sesiones fotográficas' } },
  { path: 'create', canActivate: [canAccess], loadComponent: () => import('./photo-session-create-page/photo-session-create-page.component').then(m => m.PhotoSessionCreatePageComponent), data: { title: 'Crear sesión fotográfica' } },
  { path: 'photographers', canActivate: [canAccess], data: { contactKind: 'photographer', title: 'Fotógrafos' }, loadChildren: () => import('./contacts/routes.photo-contact').then(m => m.routes) },
  { path: 'models', canActivate: [canAccess], data: { contactKind: 'model', title: 'Modelos' }, loadChildren: () => import('./contacts/routes.photo-contact').then(m => m.routes) },
  { path: 'locations', canActivate: [canAccess], data: { title: 'Locaciones' }, loadChildren: () => import('./locations/routes.photo-location').then(m => m.routes) },
  { path: ':photo_session_id/tasks', loadComponent: () => import('./tasks/photo-session-task-index-page/photo-session-task-index-page.component').then(m => m.PhotoSessionTaskIndexPageComponent), data: { title: 'Tareas de la sesión' } },
  { path: ':photo_session_id', canActivate: [canAccess], canDeactivate: [(component: PhotoSessionEditPageComponent) => component.canLeave()], loadComponent: () => import('./photo-session-edit-page/photo-session-edit-page.component').then(m => m.PhotoSessionEditPageComponent), data: { title: 'Editar sesión fotográfica' } },
];

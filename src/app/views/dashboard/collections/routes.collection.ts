import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { BaseService } from '../../base.service';
import { dashboardRoles } from '../area-dashboards/dashboard.model';

const access = () => dashboardRoles().some(role => ['master', 'ceo', 'admin'].includes(role))
  || inject(Router).createUrlTree(['/', inject(BaseService).store ?? '', 'dashboard', 'panels']);
export const routes: Routes = [
  { path: '', canActivate: [access], loadComponent: () => import('./collections.component').then(m => m.CollectionsComponent), data: { title: 'Colecciones' } },
  { path: ':collection_id', canActivate: [access], loadComponent: () => import('./collections.component').then(m => m.CollectionsComponent), data: { title: 'Colección' } },
];

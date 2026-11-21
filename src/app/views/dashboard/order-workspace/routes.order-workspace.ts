import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { BaseService } from '../../base.service';
import { dashboardRoles, MANAGEMENT_ROLES } from '../area-dashboards/dashboard.model';

// Keep the same access as the imported data source during the design phase.
const canPreview = () => dashboardRoles().some(role => MANAGEMENT_ROLES.includes(role))
  || inject(Router).createUrlTree(['/', inject(BaseService).store ?? '', 'dashboard', 'panels']);

export const routes: Routes = [
  { path: '', canActivate: [canPreview], loadComponent: () => import('./order-workspace-list.component').then(m => m.OrderWorkspaceListComponent), data: { title: 'Pedidos · Nueva versión' } },
  { path: ':id', canActivate: [canPreview], loadComponent: () => import('./order-workspace-detail.component').then(m => m.OrderWorkspaceDetailComponent), data: { title: 'Detalle del pedido · Nueva versión' } },
];

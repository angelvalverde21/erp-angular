import { Routes } from '@angular/router';
import { dashboardAccessGuard } from './dashboard-access.guard';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./dashboard-hub.component').then(module => module.DashboardHubComponent), data: { title: 'Dashboards' } },
  { path: ':area', canActivate: [dashboardAccessGuard], loadComponent: () => import('./area-dashboard.component').then(module => module.AreaDashboardComponent), data: { title: 'Dashboard de área' } },
];
import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { BaseService } from '../../base.service';
import { dashboardRoles, MANAGEMENT_ROLES } from '../area-dashboards/dashboard.model';

export const routes: Routes = [
  { path: '', redirectTo: 'shopify-orders', pathMatch: 'full' },
  {
    path: 'shopify-orders',
    canActivate: [() => {
      const base = inject(BaseService);
      return dashboardRoles().some(role => MANAGEMENT_ROLES.includes(role)) ||
        inject(Router).createUrlTree(['/', base.store ?? '', 'dashboard', 'panels']);
    }],
    loadComponent: () => import('./shopify-order-migration.component').then(module => module.ShopifyOrderMigrationComponent),
    data: { title: 'Migración de pedidos Shopify' },
  },
];
import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { BaseService } from '../../base.service';
import { dashboardRoles, MANAGEMENT_ROLES } from '../area-dashboards/dashboard.model';

const canManage = () => dashboardRoles().some(role => MANAGEMENT_ROLES.includes(role)) || inject(Router).createUrlTree(['/', inject(BaseService).store ?? '', 'dashboard', 'panels']);

export const routes: Routes = [
  { path: '', redirectTo: 'shopify', pathMatch: 'full' },
  { path: 'shopify', canActivate: [canManage],
    loadComponent: () => import('./initial-shopify-import.component').then(module => module.InitialShopifyImportComponent), data: { title: 'Primera importación de Shopify' } },
  { path: 'orders/:id', canActivate: [canManage], loadComponent: () => import('./orders/imported-order-detail.component').then(module => module.ImportedOrderDetailComponent), data: { title: 'Detalle del pedido importado' } },
  { path: 'orders', canActivate: [canManage], loadComponent: () => import('./orders/imported-orders.component').then(module => module.ImportedOrdersComponent), data: { title: 'Pedidos de primera importación' } },
];

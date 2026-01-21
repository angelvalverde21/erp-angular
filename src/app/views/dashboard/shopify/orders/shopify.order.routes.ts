import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shopify-order-index-page/shopify-order-index-page.component').then((m) => m.ShopifyOrderIndexPageComponent),
    data: {
      title: 'pedidos',
      // name: 'shopify.order.index', // 👈 nombre único
    },
  },
  {
    path: 'pending',
    loadComponent: () => import('./shopify-order-pending-page/shopify-order-pending-page.component').then((m) => m.ShopifyOrderPendingPageComponent),
    data: {
      title: 'Pedidos Pendientes',
      // name: 'shopify.order.index', // 👈 nombre único
    },
  },
  {
    path: 'prepared',
    loadComponent: () => import('./shopify-order-prepared-page/shopify-order-prepared-page.component').then((m) => m.ShopifyOrderPreparedPageComponent),
    data: {
      title: 'Pedidos preparados',
      // name: 'shopify.order.index', // 👈 nombre único
    },
  },
  {
    path: 'create',
    loadComponent: () => import('./shopify-order-prepared-page/shopify-order-prepared-page.component').then((m) => m.ShopifyOrderPreparedPageComponent),
    data: {
      title: 'Pedidos preparados',
      // name: 'shopify.order.index', // 👈 nombre único
    },
  },
];

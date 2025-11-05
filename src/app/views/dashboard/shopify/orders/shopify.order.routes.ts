import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shopify-order-index-page/shopify-order-index-page.component').then((m) => m.ShopifyOrderIndexPageComponent),
    data: {
      title: 'pedidos',
      name: 'shopify.order.index', // 👈 nombre único
    },
    
  },
];

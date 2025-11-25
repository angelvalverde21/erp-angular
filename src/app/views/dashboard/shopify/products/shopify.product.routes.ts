import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shopify-product-index-page/shopify-product-index-page.component').then((m) => m.ShopifyProductIndexPageComponent),
    data: {
      title: 'Productos',
      // name: 'shopify.order.index', // 👈 nombre único
    },
    
  },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
//   {
//     path: '',
//     loadComponent: () => import('./shopify.component').then(m => m.shopifyComponent),
//     data: {
//       title: $localize`shopify`
//     }
//   },

  {
    path: 'orders',
    loadChildren: () =>
      import('../../views/shopify/orders/shopify.order.routes').then(
        (m) => m.routes
      ),
  },
];


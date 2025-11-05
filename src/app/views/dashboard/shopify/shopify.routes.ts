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
      import('./orders/shopify.order.routes').then(
        (m) => m.routes
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/routes.report').then(
        (m) => m.routes
      ),
  },
];


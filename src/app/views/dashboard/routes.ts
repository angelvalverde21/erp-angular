import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    data: {
      title: `Dashboard`
    }
  },

  {
    path: 'products',
    loadChildren: () =>
      import('../../views/dashboard/products/routes.product').then(
        (m) => m.routes
      ),
  },

  {
    path: 'categories',
    loadChildren: () =>
      import('../../views/dashboard/categories/routes.category').then(
        (m) => m.routes
      ),
  },
  {
    path: 'shopify',
    loadChildren: () =>
      import('../../views/dashboard/shopify/shopify.routes').then((m) => m.routes),
    // canActivate: [authGuard],
  },
  {
    path: 'mercadopago',
    loadChildren: () =>
      import('../../views/dashboard/mercadopago/routes.mercadopago').then((m) => m.routes),
    // canActivate: [authGuard],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../../views/dashboard/users/routes.user').then((m) => m.routes),
    // canActivate: [authGuard],
  }
];


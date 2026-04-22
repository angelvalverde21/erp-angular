
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
    path: 'inventories',
    loadChildren: () =>
      import('./inventories/routes.inventory').then(
        (m) => m.routes
      ),
  },

  {
    path: 'products',
    loadChildren: () =>
      import('./products/routes.product').then(
        (m) => m.routes
      ),
  },

  {
    path: 'marketing',
    loadChildren: () =>
      import('./marketing/routes.marketing').then(
        (m) => m.routes
      ),
  },

  {
    path: 'locations',
    loadChildren: () =>
      import('./locations/routes.location').then(
        (m) => m.routes
      ),
  },

  {
    path: 'manufactures',
    loadChildren: () =>
      import('./manufactures/routes.manufacture').then(
        (m) => m.routes
      ),
  },

  {
    path: 'batches',
    loadChildren: () =>
      import('./batches/routes.batch').then(
        (m) => m.routes
      ),
  },
  // {
  //   path: 'productions',
  //   loadChildren: () =>
  //     import('./productions/routes.production').then(
  //       (m) => m.routes
  //     ),
  // },

  {
    path: 'pettycashes',
    loadChildren: () =>
      import('./petty-cashes/route.pettycash').then(
        (m) => m.routes
      ),
  },

  {
    path: 'purchases',
    loadChildren: () =>
      import('./purchases/routes.purchase').then(
        (m) => m.routes
      ),
  },

  {
    path: 'categories',
    loadChildren: () =>
      import('./categories/routes.category').then(
        (m) => m.routes
      ),
  },
  {
    path: 'shopify',
    loadChildren: () =>
      import('./shopify/shopify.routes').then((m) => m.routes),
    // canActivate: [authGuard],
  },
  {
    path: 'mercadopago',
    loadChildren: () =>
      import('./mercadopago/routes.mercadopago').then((m) => m.routes),
    // canActivate: [authGuard],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/routes.user').then((m) => m.routes),
    // canActivate: [authGuard],
  },
  {
    path: 'couriers',
    loadChildren: () =>
      import('./users/couriers/routes.courier').then((m) => m.routes),
    // canActivate: [authGuard],
  },
  {
    path: 'gateways',
    loadChildren: () =>
      import('./gateways/routes.gateway').then((m) => m.routes),
    // canActivate: [authGuard],
  },
  {
    path: 'attendances',
    loadChildren: () =>
      import('./attendances/routes.attendance').then((m) => m.routes),
    // canActivate: [authGuard],
  }
];
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    data: {
      title: $localize`Dashboard`
    }
  },

  {
    path: 'products',
    loadChildren: () =>
      import('../../views/dashboard/products/routes.product').then(
        (m) => m.routes
      ),
  },
];


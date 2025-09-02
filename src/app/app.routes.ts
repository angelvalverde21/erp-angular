import { Routes } from '@angular/router';
import { authGuard } from './views/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },

  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then(
        (m) => m.Page404Component
      ),
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then(
        (m) => m.Page500Component
      ),
    data: {
      title: 'Page 500',
    },
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./views/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    data: {
      title: 'Register Page',
    },
  },
  {
    path: ':store/login',
    loadComponent: () =>
      import('./views/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: {
      title: 'Login Page',
    },
  },

  {
    path: ':store',
    loadComponent: () =>
      import('./layout').then((m) => m.DefaultLayoutComponent),
    data: {
      title: 'Dashboard',
    },

    canActivate: [authGuard],

    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/routes').then((m) => m.routes),
      },
      /* inventario */
      {
        path: 'inventories',
        loadChildren: () =>
          import('./views/dashboard/products/routes.product').then(
            (m) => m.routes
          ),
      },
    ],

  },

  { path: '**', redirectTo: '404' },
];

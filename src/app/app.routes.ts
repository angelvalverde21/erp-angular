import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    data: {
      title: 'Dashboard'
    },
    // canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      /* inventario */
      {
        path: 'products',
        loadChildren: () => import('./views/dashboard/products/routes.product').then((m) => m.routes)
      },
      {
        path: 'batches',
        loadChildren: () => import('./views/dashboard/batches/routes.batch').then((m) => m.routes)
      },
      {
        path: 'categories',
        loadChildren: () => import('./views/dashboard/categories/routes.category').then((m) => m.routes)
      },
      /* compras o purchases */
      
      {
        path: 'suppliers',
        loadChildren: () => import('./views/dashboard/suppliers/route.supplier').then((m) => m.routes)
      },

      {
        path: 'purchases',
        loadChildren: () => import('./views/dashboard/purchases/route.purchase').then((m) => m.routes)
      },


      /* ventas o sales */
      {
        path: 'settings',
        loadChildren: () => import('./views/dashboard/settings/route.settings').then((m) => m.routes)
      },
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'batches' }
];

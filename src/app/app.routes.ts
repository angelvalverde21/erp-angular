import { Routes } from '@angular/router';
import { authGuard } from './views/auth/auth.guard';
import { StoreNameGuard } from './views/StoreNameGuard.';

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
    path: ':store',
    canActivate: [StoreNameGuard], //comprueba si el slug inicial es valido
    children: [
      // rutas PUBLIC
      {
        path: '',
        loadComponent: () =>
          import('./layout/public-layout/public-layout.component').then(
            (m) => m.PublicLayoutComponent
          ),
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./views/public/routes.public').then((m) => m.routes),
          }
        ]
      },
      {
        path: 'app-shopify', //apps de shopify sin el layout general
        loadChildren: () =>
            import('./views/app-shopify/routes.app-shopify').then((m) => m.routes),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./views/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },

      // rutas PRIVADAS
      {
        path: '',
        loadComponent: () =>
          import('./layout/default-layout/default-layout.component').then(
            (m) => m.DefaultLayoutComponent
          ),
        canActivateChild: [authGuard],
        children: [
          {
            path: 'dashboard',
            loadChildren: () =>
              import('./views/dashboard/routes').then((m) => m.routes),
          },
        ]
      }
    ]
  },

  { path: '**', redirectTo: '404' },
];

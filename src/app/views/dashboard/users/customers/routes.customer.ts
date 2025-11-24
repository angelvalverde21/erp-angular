import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./customer-index-page/customer-index-page.component').then((m) => m.CustomerIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.user.index', //
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./customer-create-page/customer-create-page.component').then((m) => m.CustomerCreatePageComponent),
    data: {
      title: 'Create',
      name: 'dashboard.user.create', //
    }
  },
  {
    path: ':customer_id',
    loadComponent: () => import('./customer-edit-page/customer-edit-page.component').then((m) => m.CustomerEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.user.edit', //
    }
  },
];



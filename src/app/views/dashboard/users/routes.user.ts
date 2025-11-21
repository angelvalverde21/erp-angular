import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-index-page/user-index-page.component').then((m) => m.UserIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.user.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./user-create-page/user-create-page.component').then((m) => m.UserCreatePageComponent),
    data: {
      title: 'Create',
      name: 'dashboard.user.create', // 👈 nombre único
    }
  },
  {
    path: 'settings',
    loadComponent: () => import('./user-edit-page/user-edit-page.component').then((m) => m.UserEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.user.edit', // 👈 nombre único
    }
  },
  {
    path: ':user_id',
    loadComponent: () => import('./user-edit-page/user-edit-page.component').then((m) => m.UserEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.user.edit', // 👈 nombre único
    }
  },
];

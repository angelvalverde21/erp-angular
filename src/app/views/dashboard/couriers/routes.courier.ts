import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./courier-index-page/courier-index-page.component').then((m) => m.CourierIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.courier.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./courier-create-page/courier-create-page.component').then((m) => m.CourierCreatePageComponent),
    data: {
      title: 'Create',
      name: 'dashboard.courier.create', // 👈 nombre único
    }
  },
    {
    path: 'edit',
    loadComponent: () => import('./courier-edit-page/courier-edit-page.component').then((m) => m.CourierEditPageComponent),
    data: {
      title: 'Editar Courier',
      name: 'dashboard.courier.edit', // 👈 nombre único
    }
  }
];

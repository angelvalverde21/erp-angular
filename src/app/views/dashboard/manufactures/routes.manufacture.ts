import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./manufacture-index-page/manufacture-index-page.component').then((m) => m.ManufactureIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.manufacture.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./manufacture-create-page/manufacture-create-page.component').then((m) => m.ManufactureCreatePageComponent),
    data: {
      title: 'Create',
      name: 'dashboard.manufacture.create', // 👈 nombre único
    }
  },
  {
    path: 'productions',
    loadChildren: () =>
      import('./productions/routes.production').then((m) => m.routes),
    data: {
      title: 'Producciones',
      name: 'dashboard.manufacture.create', // 👈 nombre único
    }
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./orders/routes.orders').then((m) => m.routes),
    data: {
      title: 'Ordenes de compra',
      name: 'dashboard.manufacture.create', // 👈 nombre único
    }
  },
  {
    path: ':manufacture_id',
    loadComponent: () => import('./manufacture-edit-page/manufacture-edit-page.component').then((m) => m.ManufactureEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.manufacture.edit', // 👈 nombre único
    }
  },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./manufacture-index-page/manufacture-index-page.component').then((m) => m.ManufactureIndexPageComponent),
    data: {
      title: 'Todos',
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./manufacture-create-page/manufacture-create-page.component').then((m) => m.ManufactureCreatePageComponent),
    data: {
      title: 'Create',
    }
  },
  {
    path: 'productions',
    loadChildren: () =>
      import('./productions/routes.production').then((m) => m.routes),
    data: {
      title: 'Producciones',
    }
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./orders/routes.orders').then((m) => m.routes),
    data: {
      title: 'Ordenes de compra',
    }
  },
  {
    path: 'receptions',
    loadComponent: () => import('./receptions/reception-index-page/reception-index-page.component').then((m) => m.ReceptionIndexPageComponent),
    data: {
      title: 'Entrada y Salida de mercaderia',
      // name: 'dashboard.manufacture.edit', // 👈 nombre único
    }
  },
  {
    path: ':manufacture_id',
    loadComponent: () => import('./manufacture-edit-page/manufacture-edit-page.component').then((m) => m.ManufactureEditPageComponent),
    data: {
      title: 'Editar',
    }
  },
];

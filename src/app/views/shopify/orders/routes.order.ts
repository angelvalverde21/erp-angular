import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./order-index-page/order-index-page.component').then((m) => m.OrderIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'order.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./order-create/order-create.component').then(m => m.OrderCreateComponent),
    data: {
      title: 'Crear',
      name: 'order.create',
    }
  },
  {
    path: 'search/:search',
    loadComponent: () => import('./order-search/order-search.component').then(m => m.OrderSearchComponent),
    data: {
      title: 'Buscar',
      name: 'order.search',
    }
  },
  {
    path: ':order_id',
    loadComponent: () => import('./order-edit-page/order-edit-page.component').then(m => m.OrderEditPageComponent),
    data: {
      title: 'Editar',
      name: 'order.edit',
    }
  }
];

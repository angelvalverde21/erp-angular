import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import( './order-index-page/order-index-page.component' ).then((m) => m.OrderIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.manufacture.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import( './order-create-page/order-create-page.component' ).then((m) => m.OrderCreatePageComponent),
    data: {
      title: 'Create',
      name: 'dashboard.manufacture.create', // 👈 nombre único
    }
  },
  {
    path: ':order_id',
    loadComponent: () => import( './order-edit-page/order-edit-page.component' ).then((m) => m.OrderEditPageComponent),
    data: {
      title: 'Ordenes de Compra',
      name: 'dashboard.manufacture.create', // 👈 nombre único
    }
  },

];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import( './order-index-page/order-index-page.component' ).then((m) => m.OrderIndexPageComponent),
    data: {
      title: 'Todos',
    }
  },
  {
    path: 'create',
    loadComponent: () => import( './order-create-page/order-create-page.component' ).then((m) => m.OrderCreatePageComponent),
    data: {
      title: 'Create',
    }
  },

  {
    path: ':order_id/receptions',
    loadComponent: () => import( '../receptions/receptions-page/receptions-page.component' ).then((m) => m.ReceptionsPageComponent),
    data: {
      title: 'Recepciones',
    }
  },
  {
    path: ':order_id',
    loadComponent: () => import( './order-edit-page/order-edit-page.component' ).then((m) => m.OrderEditPageComponent),
    data: {
      title: 'Ordenes de Compra',
    }
  },
];

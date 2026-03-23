import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./manufacture-order-index-page/manufacture-order-index-page.component').then((m) => m.ManufactureOrderIndexPageComponent),
    data: {
      title: 'Todos',
    }
  },

  {
    path: 'create',
    loadComponent: () => import('./manufacture-order-create-page/manufacture-order-create-page.component').then((m) => m.ManufactureOrderCreatePageComponent),
    data: {
      title: 'Create',
    }
  },

  {
    path: ':order_id',
    loadComponent: () => import('./manufacture-order-edit-page/manufacture-order-edit-page.component').then((m) => m.ManufactureOrderEditPageComponent),
    data: {
      title: 'Ordenes de Compra',
    },
    children: [
      {
        path: '',
        loadComponent: () => import('../orders/order-edit-page/order-summary/order-summary.component').then((m) => m.OrderSummaryComponent),
        data: {
          title: 'Resumen',
        }
      },
      {
        path: 'variants',
        loadComponent: () => import('../orders/order-edit-page/order-variant-index/order-variant-index.component').then((m) => m.OrderVariantIndexComponent),
        data: {
          title: 'Variantes',
        }
      },
      {
        path: 'receptions',
        loadComponent: () => import('../orders/order-edit-page/order-reception-index/order-reception-index.component').then((m) => m.OrderReceptionIndexComponent),
        data: {
          title: 'Recepciones',
        }
      },
    ]
  },
];

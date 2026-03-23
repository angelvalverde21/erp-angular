import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Compras',
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./purchase-index-page/purchase-index-page.component').then((m) => m.PurchaseIndexPageComponent),
        data: {
          title: 'Todos'
        }
      },
      {
        path: 'create',
        loadComponent: () => import('./purchase-create-page/purchase-create-page.component').then(m => m.PurchaseCreatePageComponent),
        data: {
          title: 'Crear Compra'
        }
      },

      {
        path: 'orders',
        loadChildren: () =>
          import('../../../views/dashboard/purchases/orders/routes.purchase_order').then(
            (m) => m.routes
          ),
      },

      {
        path: ':purchase_id',
        loadComponent: () => import('./purchase-edit-page/purchase-edit-page.component').then(m => m.PurchaseEditPageComponent),
        data: {
          title: 'Editar'
        }
      }
    ]
  },
];

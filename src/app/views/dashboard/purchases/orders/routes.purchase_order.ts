import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ordenes de Compra',
    },
    children: [
      {
        path: '',
        loadComponent: () => import( './purchase-order-index-page/purchase-order-index-page.component' ).then((m) => m.PurchaseOrderIndexPageComponent),
        data: {
          title: 'Todos'
        }
      },
      {
        path: 'create',
        loadComponent: () => import('./purchase-order-create-page/purchase-order-create-page.component').then(m => m.PurchaseOrderCreatePageComponent),
        data: {
          title: 'Crear Compra'
        }
      },
      {
        path: ':purchase_order_id',
        loadComponent: () => import('./purchase-order-edit-page/purchase-order-edit-page.component').then(m => m.PurchaseOrderEditPageComponent),
        data: {
          title: 'Editar'
        }
      }
    ]
  },
];

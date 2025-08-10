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
        loadComponent: () => import( '../purchases/purchase-index-page/purchase-index-page.component' ).then((m) => m.PurchaseIndexPageComponent),
        data: {
          title: 'Todos'
        }
      },
      {
        path: 'create',
        loadComponent: () => import('../purchases/purchase-create-page/purchase-create-page.component').then(m => m.PurchaseCreatePageComponent),
        data: {
          title: 'Crear Compra'
        }
      },
      {
        path: ':purchase_id',
        loadComponent: () => import('../purchases/purchase-edit-page/purchase-edit-page.component').then(m => m.PurchaseEditPageComponent),
        data: {
          title: 'Editar'
        }
      }
    ]
  },
];

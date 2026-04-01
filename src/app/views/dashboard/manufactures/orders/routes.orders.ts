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
        loadComponent: () => import('./manufacture-order-edit-page/manufacture-order-edit/manufacture-order-edit.component').then((m) => m.ManufactureOrderEditComponent),
        data: {
          title: 'Editar',
        }
      },
      {
        path: 'variants',
        loadComponent: () => import('./manufacture-order-edit-page/manufacture-order-variant-index/manufacture-order-variant-index.component').then((m) => m.ManufactureOrderVariantIndexComponent),
        data: {
          title: 'Variantes',
        }
      },
      {
        path: 'kardexes',
        loadComponent: () => import('./manufacture-order-edit-page/manufacture-order-kardex-index/manufacture-order-kardex-index.component').then((m) => m.ManufactureOrderKardexIndexComponent),
        data: {
          title: 'Recepciones',
        }
      },
    ]
  },
];

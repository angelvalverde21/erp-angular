import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./acquire-index-page/acquire-index-page.component').then((m) => m.AcquireIndexPageComponent),
    data: {
      title: 'Ordenes de Compra',
    }
  },

  {
    path: 'create',
    loadComponent: () => import('./acquire-create-page/acquire-create-page.component').then((m) => m.AcquireCreatePageComponent),
    data: {
      title: 'Create',
    }
  },

  {
    path: ':acquire_id',
    loadComponent: () => import('./acquire-edit-page/acquire-edit-page.component').then((m) => m.AcquireEditPageComponent),
    data: {
      title: 'Ordenes de Compra',
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./acquire-edit-page/acquire-resumen/acquire-resumen.component').then((m) => m.AcquireResumenComponent),
        data: {
          title: 'Ordenes de Compra',
        }
      },
      {
        path: 'batches',
        loadComponent: () => import('./acquire-edit-page/acquire-batch-index-page/acquire-batch-index-page.component').then((m) => m.AcquireBatchIndexPageComponent),
        data: {
          title: 'acquire/batches',
        }
      },
      // {
      //   path: 'variants',
      //   loadComponent: () => import('./acquire-edit-page/acquire-variant-index/acquire-variant-index.component').then((m) => m.AcquireVariantIndexComponent),
      //   data: {
      //     title: 'acquire/variantes',
      //   }
      // },
      // {
      //   path: 'payments',
      //   loadComponent: () => import('./acquire-edit-page/acquire-payment-index/acquire-payment-index.component').then((m) => m.AcquirePaymentIndexComponent),
      //   data: {
      //     title: 'acquire/pagos realizados',
      //   }
      // },
      // {
      //   path: 'kardexes',
      //   loadComponent: () => import('./acquire-edit-page/acquire-kardex-index/acquire-kardex-index.component').then((m) => m.AcquireKardexIndexComponent),
      //   data: {
      //     title: 'acquire/recepciones',
      //   }
      // },
    ]
  },
];

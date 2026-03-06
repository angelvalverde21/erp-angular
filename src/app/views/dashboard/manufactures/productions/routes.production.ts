import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./production-index-page/production-index-page.component').then((m) => m.ProductionIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.manufacture.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./production-create-page/production-create-page.component').then((m) => m.ProductionCreatePageComponent),
    data: {
      title: 'Create'
    }
  },
  // {
  //   path: ':production_id/purchases',
  //   loadComponent: () =>
  //     import('./production-edit-page/production-purchase-index-page/production-purchase-index-page.component')
  //       .then(m => m.ProductionPurchaseIndexPageComponent),
  //   data: { title: 'Compras' }
  // },
  {
    path: ':production_id',
    loadComponent: () =>
      import('./production-edit-page/production-edit-page.component')
        .then(m => m.ProductionEditPageComponent),
    data: {
      title: 'Producciones',
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./production-edit-page/production-summary/production-summary.component')
            .then(m => m.ProductionSummaryComponent),
        data: { title: 'Producciones/Recepciones' }
      },
      {
        path: 'purchases',
        loadComponent: () =>
          import('./production-edit-page/production-purchase-index/production-purchase-index.component')
            .then(m => m.ProductionPurchaseIndexComponent),
        data: { title: 'Producciones/Compras' }
      },
      {
        path: 'variants',
        loadComponent: () =>
          import('./production-edit-page/production-variant-index/production-variant-index.component')
            .then(m => m.ProductionVariantIndexComponent),
        data: { title: 'Producciones/Variantes' }
      },
      {
        path: 'receptions',
        loadComponent: () =>
          import('./production-edit-page/production-reception-index/production-reception-index.component')
            .then(m => m.ProductionReceptionIndexComponent),
        data: { title: 'Producciones/Recepciones' }
      }

    ]
  },


];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./manufacture-production-index-page/manufacture-production-index-page.component').then((m) => m.ManufactureProductionIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.production.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./manufacture-production-create-page/manufacture-production-create-page.component').then((m) => m.ManufactureProductionCreatePageComponent),
    data: {
      title: 'Create',
      name: 'dashboard.production.create', // 👈 nombre único
    }
  },
  {
    path: 'search',
    loadComponent: () => import('./manufacture-production-search-page/manufacture-production-search-page.component').then((m) => m.ManufactureProductionSearchPageComponent),
    data: {
      title: 'Search',
      name: 'dashboard.production.search', // 👈 nombre único
    }
  },
  {
    path: ':production_id',
    loadComponent: () => import('./manufacture-production-edit-page/manufacture-production-edit-page.component').then((m) => m.ManufactureProductionEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.production.edit', // 👈 nombre único
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./manufacture-production-edit-page/manufacture-production-edit/manufacture-production-edit.component').then(m => m.ManufactureProductionEditComponent),
          data: { title: 'Producciones/calendar' }
      },
      {
        path: 'purchases',
        loadComponent: () =>
          import('./manufacture-production-edit-page/manufacture-production-purchase-index/manufacture-production-purchase-index.component')
            .then(m => m.ManufactureProductionPurchaseIndexComponent),
        data: { title: 'Producciones/Compras' }
      },
      {
        path: 'variants',
        loadComponent: () =>
          import('./manufacture-production-edit-page/manufacture-production-variant-index/manufacture-production-variant-index.component')
            .then(m => m.ManufactureProductionVariantIndexComponent),
        data: { title: 'Producciones/Variantes' }
      },
      {
        path: 'kardexes',
        loadComponent: () =>
          import('./manufacture-production-edit-page/manufacture-production-kardex-index/manufacture-production-kardex-index.component')
            .then(m => m.ManufactureProductionKardexIndexComponent),
        data: { title: 'Producciones/Kardexes' }
      }

    ]
  },
];

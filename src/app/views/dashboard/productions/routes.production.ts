import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./production-index-page/production-index-page.component').then((m) => m.ProductionIndexPageComponent),
    data: {
      title: 'Todos',
      name: 'dashboard.production.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./production-create-page/production-create-page.component').then((m) => m.ProductionCreatePageComponent),
    data: {
      title: 'Create',
      name: 'dashboard.production.create', // 👈 nombre único
    }
  },
  {
    path: 'search',
    loadComponent: () => import('./production-search-page/production-search-page.component').then((m) => m.ProductionSearchPageComponent),
    data: {
      title: 'Search',
      name: 'dashboard.production.search', // 👈 nombre único
    }
  },
  {
    path: ':production_id',
    loadComponent: () => import('./production-edit-page/production-edit-page.component').then((m) => m.ProductionEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.production.edit', // 👈 nombre único
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./production-edit-page/production-calendar/production-calendar.component')
            .then(m => m.ProductionCalendarComponent),
        data: { title: 'Producciones/calendar' }
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
      },
      {
        path: 'kardexes',
        loadComponent: () =>
          import('./production-edit-page/production-kardex-index/production-kardex-index.component')
            .then(m => m.ProductionKardexIndexComponent),
        data: { title: 'Producciones/Kardexes' }
      }

    ]
  },
];

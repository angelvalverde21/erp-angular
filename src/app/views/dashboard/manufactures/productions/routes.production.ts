import { Routes } from '@angular/router';
import { productionSectionLeaveGuard } from './production-section-leave.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./manufacture-production-index-page/manufacture-production-index-page.component').then((m) => m.ManufactureProductionIndexPageComponent),
    data: {
      title: 'Producciones',
      name: 'dashboard.production.index', // 👈 nombre único
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./manufacture-production-create-page/manufacture-production-create-page.component').then((m) => m.ManufactureProductionCreatePageComponent),
    data: {
      title: 'Crear Producción',
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
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () => import('./production-overview.component').then(m => m.ProductionOverviewComponent),
        data: { title: 'Etapas de producción' },
      },
      {
        path: 'details',
        loadComponent: () =>
          import('./manufacture-production-edit-page/manufacture-production-edit/manufacture-production-edit.component').then(m => m.ManufactureProductionEditComponent),
          data: { title: 'Datos de producción' }
      },
      {
        path: 'deliveries',
        loadComponent: () => import('./manufacture-production-edit-page/production-delivery-tracking/production-delivery-tracking.component').then(m => m.ProductionDeliveryTrackingComponent),
        data: { title: 'Seguimiento de compras' }
      },
      {
        path: 'purchases',
        canDeactivate: [productionSectionLeaveGuard],
        loadComponent: () =>
          import('./manufacture-production-edit-page/manufacture-production-purchase-index/manufacture-production-purchase-index.component')
            .then(m => m.ManufactureProductionPurchaseIndexComponent),
        data: { title: 'Produccion/compras' }
      },
      {
        path: 'variants',
        loadComponent: () =>
          import('./manufacture-production-edit-page/manufacture-production-variant-index/manufacture-production-variant-index.component')
            .then(m => m.ManufactureProductionVariantIndexComponent),
        data: { title: 'Produccion/inventario (Variantes)' }
      },
      {
        path: 'kardexes',
        loadComponent: () =>
          import('./manufacture-production-edit-page/manufacture-production-kardex-index/manufacture-production-kardex-index.component')
            .then(m => m.ManufactureProductionKardexIndexComponent),
        data: { title: 'Produccion/recepcion (kardex)' }
      }

    ]
  },
];

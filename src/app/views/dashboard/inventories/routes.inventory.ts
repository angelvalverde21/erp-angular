import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: ':inventory_id/location-progress', loadComponent: () => import('./location-progress/inventory-location-progress-index-page/inventory-location-progress-index-page.component').then(m => m.InventoryLocationProgressIndexPageComponent), data: { title: 'Avance por ubicación' } },
  { path: ':inventory_id/location-progress/create', loadComponent: () => import('./location-progress/inventory-location-progress-create-page/inventory-location-progress-create-page.component').then(m => m.InventoryLocationProgressCreatePageComponent), data: { title: 'Registrar ubicación' } },
  { path: ':inventory_id/location-progress/:progress_id/edit', loadComponent: () => import('./location-progress/inventory-location-progress-edit-page/inventory-location-progress-edit-page.component').then(m => m.InventoryLocationProgressEditPageComponent), data: { title: 'Editar avance' } },
  { path: ':inventory_id/sessions/:session_id/counts', loadComponent: () => import('./counts/inventory-count-index-page/inventory-count-index-page.component').then(m => m.InventoryCountIndexPageComponent), data: { title: 'Conteos' } },
  { path: ':inventory_id/sessions/:session_id/counts/create', redirectTo: ':inventory_id/sessions/:session_id/counts', pathMatch: 'full' },
  { path: ':inventory_id/sessions/:session_id/counts/:count_id/edit', loadComponent: () => import('./counts/inventory-count-edit-page/inventory-count-edit-page.component').then(m => m.InventoryCountEditPageComponent), data: { title: 'Editar conteo' } },
  { path: ':inventory_id/adjustments', loadComponent: () => import('./adjustments/inventory-adjustment-index-page/inventory-adjustment-index-page.component').then(m => m.InventoryAdjustmentIndexPageComponent), data: { title: 'Ajustes' } },
  { path: ':inventory_id/adjustments/create', loadComponent: () => import('./adjustments/inventory-adjustment-create-page/inventory-adjustment-create-page.component').then(m => m.InventoryAdjustmentCreatePageComponent), data: { title: 'Generar ajuste' } },
  { path: ':inventory_id/adjustments/:adjustment_id/edit', loadComponent: () => import('./adjustments/inventory-adjustment-edit-page/inventory-adjustment-edit-page.component').then(m => m.InventoryAdjustmentEditPageComponent), data: { title: 'Revisar ajuste' } },
  { path: '', loadComponent: () => import('./inventory-index-page/inventory-index-page.component').then(m => m.InventoryIndexPageComponent), data: { title: 'Inventarios' } },
  { path: 'create', loadComponent: () => import('./inventory-create-page/inventory-create-page.component').then(m => m.InventoryCreatePageComponent), data: { title: 'Crear inventario' } },
  { path: ':inventory_id/edit', loadComponent: () => import('./inventory-edit-page/inventory-edit-page.component').then(m => m.InventoryEditPageComponent), data: { title: 'Editar inventario' } },
  { path: ':inventory_id/sessions', loadComponent: () => import('./sessions/inventory-session-index-page/inventory-session-index-page.component').then(m => m.InventorySessionIndexPageComponent), data: { title: 'Sesiones de trabajo' } },
  { path: ':inventory_id/sessions/create', loadComponent: () => import('./sessions/inventory-session-create-page/inventory-session-create-page.component').then(m => m.InventorySessionCreatePageComponent), data: { title: 'Crear sesión' } },
  { path: ':inventory_id/sessions/:session_id/edit', loadComponent: () => import('./sessions/inventory-session-edit-page/inventory-session-edit-page.component').then(m => m.InventorySessionEditPageComponent), data: { title: 'Editar sesión' } },
  // {
  //   path: '',
  //   loadComponent: () => import( './inventory-index-page/inventory-index-page.component' ).then((m) => m.InventoryIndexPageComponent),
  //   data: {
  //     title: 'Todos',
  //   }
  // },
  // {
  //   path: 'create',
  //   loadComponent: () => import( './inventory-create-page/inventory-create-page.component' ).then((m) => m.InventoryCreatePageComponent),
  //   data: {
  //     title: 'Create',
  //   }
  // },
  {
    path: 'batches',
    loadComponent: () => import('./batches/inventory-batch-index-page/inventory-batch-index-page.component').then((m) => m.InventoryBatchIndexPageComponent),
    data: {
      title: 'Lotes de inventario',
    }
  },

  {
    path: 'income',
    loadComponent: () => import('./income/inventory-income-index-page/inventory-income-index-page.component').then((m) => m.InventoryIncomeIndexPageComponent),
    data: {
      title: 'Ingreso de inventario',
    }
  },
  {
    path: 'out',
    loadComponent: () => import('./out/inventory-out-index-page/inventory-out-index-page.component').then((m) => m.InventoryOutIndexPageComponent),
    data: {
      title: 'Salida de inventario',
    }
  },
  {
    path: 'barcode',
    loadComponent: () => import('./barcode/inventory-barcode-search-page/inventory-barcode-search-page.component').then((m) => m.InventoryBarcodeSearchPageComponent),
    data: {
      title: 'Buscar Barcode',
    }
  },
  {
    path: 'movements',
    loadComponent: () => import('./movements/inventory-movement-index-page/inventory-movement-index-page.component').then((m) => m.InventoryMovementIndexPageComponent),
    data: {
      title: 'Traslados de inventario',
    }
  },
  {
    path: 'batches',
    loadChildren: () => import('./batches/routes.batch').then((m) => m.routes),
  },
];

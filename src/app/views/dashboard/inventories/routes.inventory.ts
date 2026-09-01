import { Routes } from '@angular/router';

export const routes: Routes = [
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

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import( './inventory-index-page/inventory-index-page.component' ).then((m) => m.InventoryIndexPageComponent),
    data: {
      title: 'Todos',
    }
  },
  // {
  //   path: 'create',
  //   loadComponent: () => import( './inventory-create-page/inventory-create-page.component' ).then((m) => m.InventoryCreatePageComponent),
  //   data: {
  //     title: 'Create',
  //   }
  // },
  {
    path: 'income',
    loadComponent: () => import( './inventory-income-index-page/inventory-income-index-page.component' ).then((m) => m.InventoryIncomeIndexPageComponent),
    data: {
      title: 'Ingreso de inventario',
    }
  },
  {
    path: 'out',
    loadComponent: () => import( './inventory-out-index-page/inventory-out-index-page.component' ).then((m) => m.InventoryOutIndexPageComponent),
    data: {
      title: 'Salida de inventario',
    }
  },
  {
    path: 'barcode',
    loadComponent: () => import( './inventory-barcode-search-page/inventory-barcode-search-page.component' ).then((m) => m.InventoryBarcodeSearchPageComponent),
    data: {
      title: 'Buscar Barcode',
    }
  },
  {
    path: 'income/:inventory_id',
    loadComponent: () => import( './inventory-edit-page/inventory-edit-page.component' ).then((m) => m.InventoryEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.product.edit', // 👈 nombre único
    }
  },
];

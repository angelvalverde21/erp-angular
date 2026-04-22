import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import( './inventory-batch-index-page/inventory-batch-index-page.component' ).then((m) => m.InventoryBatchIndexPageComponent),
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
    path: ':inventory_id',
    loadComponent: () => import('./inventory-batch-edit-page/inventory-batch-edit-page.component').then((m) => m.InventoryBatchEditPageComponent),
    data: {
      title: 'Editar',
      name: 'dashboard.product.edit', // 👈 nombre único
    }
  },
];
